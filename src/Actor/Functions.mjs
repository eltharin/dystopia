import {TokenHighlighter}  from "./TokenHighlighter.mjs"


export function getArmure(actor) {
    return actor.items.filter(i => i.type == "armure").reduce((acc, armure) => {
      return {
        physique: acc.physique + armure.system.armure.physique, 
        magique:acc.magique + armure.system.armure.magique, 
        mixte:acc.mixte + armure.system.armure.mixte
      }
    }, {physique:0, magique:0, mixte:0});
}
