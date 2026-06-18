import * as system  from "../_helpers.mjs";

export function registerDiceRolls() {
    CONFIG.Dice.rolls.push(system.DiceRoller.GlobalRoll);
    CONFIG.Dice.rolls.push(system.DiceRoller.AttaqueRoll);
    //CONFIG.Dice.rolls.push(system.DiceRoller.CompetenceRoll);

    CONFIG.Dice.rolls.push(system.DiceRoller.EsquiveRoll);
    CONFIG.Dice.rolls.push(system.DiceRoller.DegatEffetsRoll);


    CONFIG.Dice.rolls.push(system.Combat.AttaqueMessage);


    
}

