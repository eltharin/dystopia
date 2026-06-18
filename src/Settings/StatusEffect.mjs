import * as system from "./../_helpers.mjs";




export class StatusEffect  {

    static properties = {
        "pv" : {key: "system.values.pv.val", sens: -1},
        "pvmax" : {key: "system.values.pv.maxtemp", sens: -1},
    }
    static customType = {
        brule:     { id: "brule", img: "icons/svg/fire.svg", name: "Brule", degatsOnTurn: {type: "pv"}},
        glace:     { id: "glace", img: "icons/svg/frozen.svg", name: "Glacé", degatsOnTurn: {type: "pv"}},
        poison:    { id: "poison", img: "icons/svg/frozen.svg", name: "Empoisonné", degatsOnTurn: {type: "pv"}},
        elec:      { id: "elec", img: "icons/svg/frozen.svg", name: "Electrocuté", degatsOnTurn: {type: "pv"}},
        saigne:    { id: "saigne", img: "icons/svg/frozen.svg", name: "Saignement", degatsOnTurn: {type: "pv"}},
        corrosion: { id: "corrosion", img: "icons/svg/frozen.svg", name: "Corrosion", changes:[{key: "system.seuilCritique.temp", value: 2, type: "subtract"}]},
        necrose:   { id: "necrose", img: "icons/svg/frozen.svg", name: "Nécrose", degatsOnTurn: {type: "pvmax"}},
    };

    static async init() {
        CONFIG.statusEffects = {
            dead: { id: "dead", name: "EFFECT.StatusDead", img: "icons/svg/skull.svg", order: 1 },

            blind: { id: "blind", name: "EFFECT.StatusBlind", img: "icons/svg/blind.svg", order: 10 },
            burrow: { id: "burrow", name: "EFFECT.StatusBurrow", img: "icons/svg/mole.svg", order: 10 },
            fly: { id: "fly", name: "EFFECT.StatusFlying", img: "icons/svg/wing.svg", order: 10 },
            hover: { id: "hover", name: "EFFECT.StatusHover", img: "icons/svg/wingfoot.svg", order: 10 },

            invisible: { id: "invisible", name: "EFFECT.StatusInvisible", img: "icons/svg/invisible.svg", order: 2 },
            paralysis: { id: "paralysis", name: "EFFECT.StatusParalysis", img: "icons/svg/paralysis.svg", order: 2 },
        };

        Object.entries(this.customType).forEach(([key,type]) => {
            CONFIG.statusEffects[key] = {
                id: key, 
                img: type.img, 
                name: type.name, 
                type: "effetEtat", 
                flags: {etat : {id: key}},
                order: 100,
                changes: type.changes || [],
                duration: {expiry: "turnStart", units: "rounds", value:2},
            };
        });
    
        Hooks.on("preCreateActiveEffect", (effect, data, options, userId) => {
      
            const oldEffect = effect.parent.effects.find(e => e.flags.etat.id == effect.flags.etat.id);
                    
            if(!oldEffect)
            {
                effect.updateSource({"flags.etat.nb": 1});
            }
            else
            {
                effect.updateSource({"flags.etat.nb": oldEffect.flags.etat.nb + 1});
                oldEffect.delete();
            }
            
        });

    }

    static lanceDegat(combatant, arrayOfStatuses) {

        const lances = {};

        arrayOfStatuses.forEach(s => {
            const degats = this.customType[s.status].degatsOnTurn;
            if(!degats) return;

            if (!lances[degats.type]) {
                lances[degats.type] = [];
            }
            lances[degats.type].push((s.nb < 3 ? "1D4" : (s.nb < 6 ? "1D6" : "1D8")) + "[" + s.status + "]");
        });

        Object.entries(lances).forEach(([key, l]) => {
            const roll = new system.DiceRoller.DegatEffetsRoll(l.join(" + "), {}, {
                type: key,
                key: this.properties[key],
                token: combatant.actor.uuid,
            });
            roll.toMessage({
                //speaker: ChatMessage.getSpeaker({ alias: this.document.name + " ( " + game.user.name + " )"}),
            });
            
        })
    }

    static hasLanceDe(status) {
        return this.customType[status]?.onTurn !== null;
    }
}