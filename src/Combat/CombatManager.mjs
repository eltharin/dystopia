import * as system  from "../_helpers.mjs";
import { EsquiveRoll } from "../DiceRoller/Combat/EsquiveRoll.mjs";


export class CombatManager {
    //static FLAG_REACTION = 

    static init() {
        Hooks.on("renderChatMessageHTML", (message, html, data) => {
            if(message.flags.dystopia?.attaqueMessage) {
                html.innerHTML = "<div>" + message.id + "</div>" + "<div>" + message.flags.dystopia.attaqueMessage.id + "</div>" + html.innerHTML;
                return html;
            }
        });


        Hooks.on("preUpdateCombat", (combat, change) => {
            if (!("round" in change)) return;
            if (combat.round >= change.round) return;

            ChatMessage.create({
                user: game.user.id,
                speaker: ChatMessage.getSpeaker({ alias: "" }),
                content: "nouveau tour : " + change.round
            });

            [...combat.combatants].forEach(c => c.setFlag(system.Consts.SYSTEMID, "reaction", 0))
        });

        Hooks.on("renderCombatTracker", (app, html, data) => {

            for (const li of html.querySelectorAll("li.combatant")) {
                const combatantId = li.dataset.combatantId;
                const combatant = game.combat.combatants.get(combatantId);

                const actor = combatant?.actor;
                if (!actor) continue;


                // Conteneur
                const reactionContainer = document.createElement("div");
                reactionContainer.classList.add("reaction-container");
                
                const reactionButton = document.createElement("div");
                reactionButton.classList.add("reaction-button");
                reactionButton.innerHTML = combatant.getFlag(system.Consts.SYSTEMID, "reaction");
                reactionContainer.appendChild(reactionButton);

                reactionButton.onclick = async (e) => {
                    if(!game.user.isGM) return;
                    e.stopPropagation();

                    const dialog = await system.Base.Dialog.input({
                        content: await foundry.applications.handlebars.renderTemplate(system.Consts.TEMPLATES_PATH + "/combat/popup-reset-reaction.hbs", { }),
                        window: {title: game.i18n.localize(system.Consts.SYSTEMID + ".combat.reaction.title")},
                        ok: {
                            label: game.i18n.localize(system.Consts.SYSTEMID + ".combat.reaction.buttons.changer"),
                        },
                        submit: result => {
                            combatant.setFlag(system.Consts.SYSTEMID, "reaction", result.reaction)
                        }
                    });
                };

                // Injection dans l'entrée du tracker
                li.insertBefore(reactionContainer, li.lastElementChild);


                //-- ajout zone effets
                const effetsContainer = document.createElement("div");
                effetsContainer.classList.add("effets-container");

                let allEffects = [];

                [...combatant.actor.allApplicableEffects().filter(e => e.statuses.size > 0)].forEach(e => {
                    e.statuses.forEach(s => {
                        if(system.Settings.StatusEffect.hasLanceDe(s)) {
                            allEffects.push({status: s, nb: e.flags.etat.nb});
                        }
                    });
                });

                if(allEffects.length > 0) {
                    const EffetButton = document.createElement("div");
                    EffetButton.classList.add("reaction-button");
                    EffetButton.innerHTML = "Lancer dés effets";
                    effetsContainer.appendChild(EffetButton);

                    EffetButton.onclick = async (e) => {
                        e.stopPropagation();
                        system.Settings.StatusEffect.lanceDegat(combatant, allEffects)
                    };
                }
                li.querySelector('.token-name').appendChild(effetsContainer);
                
            }
        });  

        Hooks.on("createCombatant", async (combatant, options, userId) => {
            if (!game.user.isGM) return;
            const actor = combatant.actor;
            if (!actor) return;

            const initValue = actor.system?.initiative ?? 0;

            await combatant.update({ initiative: initValue, "flags.dystopia.reaction": 0 });
        });


        Hooks.on("updateCombatant", (combatant, options, userId) => {
            document.querySelector(`li.combatant[data-combatant-id="${combatant.id}"] .reaction-button`).innerHTML = combatant.flags[game.system.id]?.reaction || 0;
        });
    }

    static _getCombatantFromToken(token) {
        return game.combat.getCombatantsByToken(token.parent ? token.token.id : token.getActiveTokens()[0].id)[0];
    }

    static updateAttaqueMesage(messageId) {
        const message = game.messages.get(messageId);
        if (!message) return;

        let hasUpdate = false;

        game.messages.forEach(m => {
            const reponse = m.flags?.[system.Consts.SYSTEMID]?.reponseAttaqueMessage;

            if(!reponse) return;

            if(reponse.id != message.id) return;

            const cible = message.rolls[0].options.cibles[reponse.cible];
            if(!cible) return;

            if(cible.result != reponse.action) {
                message.rolls[0].options.cibles[reponse.cible].result = reponse.action;
                hasUpdate = true;
            }
        });

        if(hasUpdate) {
            message.update({rolls: message.rolls});
        }
    }

    static createAttaqueMessage() {

    }

    static async _onReponseAttaque(event, message, target) {
        const token = fromUuidSync(event.target.dataset.foractoruuid);

        const attaqueMessageId = event.target.closest(".message").dataset.messageId;
    
        const chatMessage = {
            user: game.user.id,
            speaker: ChatMessage.getSpeaker({ alias: token.name }),
            flags: {"dystopia": {"reponseAttaqueMessage": {id: attaqueMessageId, cible: token.uuid, action: null}}}
        };
    
        const dialog = await system.Base.Dialog.wait({
            content: game.i18n.localize(system.Consts.SYSTEMID + ".combat.reponseAttaqueDialog.content"),
            window: {title: game.i18n.localize(system.Consts.SYSTEMID + ".combat.reponseAttaqueDialog.title")},
            buttons: [{
                action: "rien",
                label: game.i18n.localize(system.Consts.SYSTEMID + ".combat.reponseAttaqueDialog.buttons.rien"),
                callback: (event, button, dialog) => {
                    chatMessage.content = game.i18n.format(system.Consts.SYSTEMID + ".combat.reponseAttaqueDialog.actions.rien", { actor: token.name });
                    chatMessage.flags.dystopia.reponseAttaqueMessage.action = "rien";
                    ChatMessage.create(chatMessage);
                }
            },{
                action: "parer",
                label: game.i18n.localize(system.Consts.SYSTEMID + ".combat.reponseAttaqueDialog.buttons.parer"),
                callback: (event, button, dialog) => {
                    chatMessage.content = game.i18n.format(system.Consts.SYSTEMID + ".combat.reponseAttaqueDialog.actions.parer", { actor: token.name });
                    ChatMessage.create(chatMessage);
                }
            }, {
                action: "esquiveoupas",
                label: game.i18n.localize(system.Consts.SYSTEMID + ".combat.reponseAttaqueDialog.buttons.esquiver"),
                callback: (event, button, dialog) => {
                    CombatManager.testEsquive(token, chatMessage)
                },
            }],
        });
        
    }

    static async _onDeAttaque(event, message, target) {
        CombatManager.updateAttaqueMesage(message.id);

        if(Object.values(message.rolls[0].options.cibles).filter(c => c.result == null).length > 0) {
            ui.notifications.error(game.i18n.format(system.Consts.SYSTEMID + ".combat.attaque.waitDeAttaque"));
            return;
        }
         
        const cibles = Object.values(message.rolls[0].options.cibles).filter(c => c.result == "rien").map(c => {
            return c;
        });



        const myRoll = new system.DiceRoller.AttaqueRoll("2d10",{}, {
            actor: message.rolls[0].options.actor,
            cibles: cibles,
            
            item: message.rolls[0].options.item
        });
    
        myRoll.toMessage({
            //speaker: ChatMessage.getSpeaker({ alias: this.document.name + " ( " + game.user.name + " )"}),
        });
    }

    static createResponseAttaqueMessage() {

    }

    static createDegats() {

    }

    static updateAttaqueMessageForReponse(attaqueMessageId, cible, action) {
        
    }

    static clotureAttaqueMessage() {
        
    }

    static async testEsquive(token, chatMsg) {
        
        let reussite = false;

        const combatant = this._getCombatantFromToken(token);

        if(combatant.actor.system.values.pe.total < combatant.actor.system.coutPeEsquive) {
            ui.notifications.error(game.i18n.format(system.Consts.SYSTEMID + ".combat.roll.esquive.noPe"));
            return;
        }

        if((combatant.getFlag(system.Consts.SYSTEMID, "reaction") ?? 0) == 0) {
            reussite = true;

            chatMsg.content = game.i18n.format(system.Consts.SYSTEMID + ".combat.reponseAttaqueDialog.actions.esquiveAuto", { actor: token.name });
            chatMsg.flags.dystopia.reponseAttaqueMessage.action = "esquive";
            chatMsg.speaker = ChatMessage.getSpeaker({ alias: token.name + " ( " + game.user.name + " )"}),
            ChatMessage.create(chatMsg);
            
            combatant.setFlag(system.Consts.SYSTEMID, "reaction", 10);
            combatant.actor.update({ "system.values.pe.val": foundry.utils.getProperty(combatant.actor, "system.values.pe.val") - combatant.actor.system.coutPeEsquive});
        }
        else {

            const myRoll = new system.DiceRoller.EsquiveRoll("2d10",{}, {
                actor: {
                    id: token.uuid,
                    name: token.name
                },
                reaction: combatant.getFlag(system.Consts.SYSTEMID, "reaction") + combatant.actor.system.malus.reaction.val
            });
            
            const msg = await myRoll.toMessage({
                speaker: ChatMessage.getSpeaker({ alias: token.name + " ( " + game.user.name + " )"}),
            }, {create:false});

            const flags = chatMsg.flags;
            flags.dystopia.reponseAttaqueMessage.action = myRoll.getResult() ? "esquive" : "rien";
            
            msg.flags = flags;
            ChatMessage.create(msg);
            
            if(myRoll.getResult()) {
                const oldReact = combatant.getFlag(system.Consts.SYSTEMID, "reaction");

                chatMsg.content = token.name + " passe de réaction " + oldReact + " à " + (oldReact+2);
            
                ChatMessage.create(chatMsg);
            
                combatant.setFlag(system.Consts.SYSTEMID, "reaction", oldReact+2);
                combatant.actor.update({ "system.values.pe.val": foundry.utils.getProperty(combatant.actor, "system.values.pe.val") - combatant.actor.system.coutPeEsquive});
            }
        }
    }

    static _onEnlevePV(event, message, target) {
        const token = fromUuidSync(event.target.dataset.token);
        token.update({"system.values.pv.val" : token.system.values.pv.val - event.target.dataset.nbpv});
    }

    static _onAffectDegatEffets(event, message, target) {
        const token = fromUuidSync(event.target.dataset.token);
        let updates = {};
        updates[event.target.dataset.key] = foundry.utils.getProperty(token, event.target.dataset.key) + event.target.dataset.value * event.target.dataset.sens;
        token.update(updates);
        let rolls = message.rolls;
        rolls[0].options.isAffected = true;
        message.update({rolls: rolls});
    }
    static _onAjoutEtatEffets(event, message, target) {
        const token = fromUuidSync(event.target.dataset.token);

        token.toggleStatusEffect(event.target.dataset.etat, {active: true});

        let rolls = message.rolls;
        rolls[0].options.etatAffected.push(event.target.dataset.etat);
        message.update({rolls: rolls});


        
    }
    
    
}