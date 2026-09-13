import * as system from "./../_helpers.mjs";




export class StatusEffect  {

    static properties = {
        "pv" : {key: "system.values.pv.val", sens: -1},
        "pvmax" : {key: "system.values.pv.tempMax", sens: -1},
        "pvtemp" : {key: "system.values.pv.temp", sens: 1},
    }
    static customType = {
        brule:     { 
            img: "icons/svg/fire.svg", 
            degatsOnTurn: {type: "pv"}
        },
        poison:    { 
            img: "icons/svg/poison.svg", 
            degatsOnTurn: {type: "pv"}
        },

        glace:     { 
            img: "icons/svg/frozen.svg", 
            degatsOnTurn: {type: "pv"}, 
            changes:[{key: "system.coutDeplacement.temp", value: 2, type: "add"},{key: "system.values.reaction.temp", value: 2, type: "add"}],
            onCreate: (e,n) => {return {changes: [
                {key: "system.coutDeplacement.temp", value: n+2, type: "add"},
                {key: "system.values.reaction.temp", value: n+2, type: "add"}
            ]}}
        },
        
        elec:      { 
            img: "icons/svg/lightning.svg", 
            degatsOnTurn: {type: "pv"},
            onDegats: (roll, token) => {
                if(roll.terms[0]._faces == roll.total) {
                    roll.options.addEffect.push("paralysis");
                }
            }
        },
        saigne:    { 
            img: "icons/svg/blood.svg", 
            degatsOnTurn: {type: "pv"}
        },

        corrosion: { 
            img: "icons/svg/acid.svg", 
            degatsOnTurn: {type: "pv"},
            changes:[{key: "system.malus.armure.physique", value: 2, type: "add"}],
            onCreate: (e,n) => {return {changes: [
                {key: "system.malus.armure.physique", value: n+2, type: "add"}
            ]}}
        },

        necrose:   { 
            img: "icons/svg/bones.svg", 
            degatsOnTurn: {type: "pvmax"}
        },
    };

    static getName(etat) {
        if(this.customType[etat] == undefined)
        {
            return game.i18n.localize(CONFIG.statusEffects[etat].name);    
        }
        return game.i18n.localize(system.Consts.SYSTEMID + ".effet.libelle." + etat);
    }

    static async init() {
        CONFIG.statusEffects = {
            dead: { id: "dead", name: "EFFECT.StatusDead", img: "icons/svg/skull.svg", type: "effetEtat", order: 1 },

            blind: { id: "blind", name: "EFFECT.StatusBlind", img: "icons/svg/blind.svg", type: "effetEtat", order: 10 },
            burrow: { id: "burrow", name: "EFFECT.StatusBurrow", img: "icons/svg/mole.svg", type: "effetEtat", order: 10 },
            fly: { id: "fly", name: "EFFECT.StatusFlying", img: "icons/svg/wing.svg", type: "effetEtat", order: 10 },
            hover: { id: "hover", name: "EFFECT.StatusHover", img: "icons/svg/wingfoot.svg", type: "effetEtat", order: 10 },

            invisible: { id: "invisible", name: "EFFECT.StatusInvisible", img: "icons/svg/invisible.svg", type: "effetEtat", order: 2 },
            paralysis: { id: "paralysis", name: "EFFECT.StatusParalysis", img: "icons/svg/paralysis.svg", type: "effetEtat", order: 2 },
        };

        Object.entries(this.customType).forEach(([key,type]) => {
            CONFIG.statusEffects[key] = {
                id: key, 
                img: type.img, 
                name: this.getName(key), 
                type: "effetEtat", 
                flags: {etat : {id: key}},
                order: 100,
                changes: type.changes || [],
                duration: {expiry: "turnStart", units: "rounds", value:2},
            };
        });
    
        Hooks.on("preCreateActiveEffect", (effect, data, options, userId) => {
            if(effect.type !== "effetEtat" && effect.constructor.name !== "effetEtat") return;
            const oldEffect = effect.parent.effects.find(e => e.flags.etat.id == effect.flags.etat.id);
            if(!oldEffect)
            {
                effect.updateSource({"flags.etat.nb": 1});
            }
            else
            {
                effect.updateSource({"flags.etat.nb": oldEffect.flags.etat.nb + 1});
                effect.updateSource(this.getEffetVariables(effect, oldEffect.flags.etat.nb + 1));
                oldEffect.delete();
            }
            
        });

    }

    static getLevel(score) {
        return Math.min(2, Math.floor(score/3));
    }

    static getDiceLevel(score) {
        switch (this.getLevel(score)) {
            case 1: return "1D6";
                    break;
            case 2: return "1D8";
                    break;
            default:
                return "1D4";
        }
    }

    static lanceDegat(combatant, arrayOfStatuses) {

        const lances = {};

        arrayOfStatuses.forEach(s => {
            const degats = this.customType[s.status].degatsOnTurn;
            if(!degats) return;

            const roll = new system.DiceRoller.DegatEffetsRoll(this.getDiceLevel(s.nb), {}, {
                actor: combatant.actor.name,
                etat: s.status,
                type: degats.type,
                key: this.properties[degats.type],
                token: combatant.actor._uuid,
                onCritical: this.customType[s.status]?.onDegats,
            });
            roll.toMessage({
                //speaker: ChatMessage.getSpeaker({ alias: this.document.name + " ( " + game.user.name + " )"}),
            });  
        })
    }

    static hasLanceDe(status) {
        return (this.customType?.[status]?.degatsOnTurn || null) !== null;
    }

    static getEffetVariables(effect, score) {
        if(this.customType[effect.flags.etat.id]?.onCreate) {
            return this.customType[effect.flags.etat.id]?.onCreate(effect, this.getLevel(score));
        }
        return {};
    }
}