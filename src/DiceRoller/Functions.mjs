import * as system  from "../_helpers.mjs";

import { MessageActionResolver } from "../ChatMessage/MessageActionResolver.mjs";

export function registerDiceRolls() {
    CONFIG.Dice.rolls.push(system.DiceRoller.GlobalRoll);
    CONFIG.Dice.rolls.push(system.DiceRoller.AttaqueRoll);
    CONFIG.Dice.rolls.push(system.DiceRoller.CompetenceRoll);
}

export function registerMessageEventListener() {
    Hooks.on("renderChatMessageHTML", (message, html, data) => {
        html.querySelectorAll(".dice-roll button[data-action]").forEach(btn => {
            btn.addEventListener("click", event => {
                const action = event.currentTarget.dataset.action;
                MessageActionResolver.executeAction(action, event, message, data);
            });
        });

    });

    
}