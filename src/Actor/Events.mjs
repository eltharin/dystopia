class ActorUpdates
{
    static getChangedValue(actor, changes, property)
    {
        if(! foundry.utils.hasProperty(changes, property) ) return null;
        const oldValue = foundry.utils.getProperty(changes, "flags." + system.Consts.SYSTEMID + ".updateedValues." + property);
        const newValue = foundry.utils.getProperty(actor, property);

        if(oldValue == newValue) return null;

        return {
            old: oldValue,
            new: newValue,
            delta: newValue-oldValue,
            result: ((newValue-oldValue) > 0 ? "+" : "" ) + (newValue-oldValue),
        }
    }

    static printChange(token, message, color)
    {
      let position = token.center;
      position.y -= 50;
      // Affichage du texte flottant
      canvas.interface.createScrollingText(position, message, {
        anchor: CONST.TEXT_ANCHOR_POINTS.TOP,
        direction: CONST.TEXT_ANCHOR_POINTS.TOP,
        distance: 100,
        duration: 3000,
        fill: color,
        textStyle: {
          stroke: 0x000000,
          strokeThickness: 4,
          fontSize: 32
        }
      });
    }


}

export function register()
{
    /*Hooks.on("preUpdateActor", (actor, changes, options, userId) => {
        let flags = {};
        console.log(foundry.utils.deepClone(changes));
        Object.entries(foundry.utils.flattenObject(changes)).forEach(([k,v]) => {foundry.utils.setProperty(flags,k,foundry.utils.getProperty(actor, k));});
        foundry.utils.setProperty(changes, "flags." + system.Consts.SYSTEMID + ".updateedValues", flags);
    });*/
/*
    Hooks.on("preCreateActiveEffect", (effect, changes, options, userId) => {
        if(changes.name == "Mort" && !foundry.utils.getProperty(changes, "flags." + system.Consts.SYSTEMID + ".effetmort") ) {
            effect.parent.createEmbeddedDocuments("ActiveEffect", [{
                label: "Mort",
                name: "Mort",
                statuses:["dead"],
                icon: system.Consts.ASSETS_PATH + "/croix_rouge.webp",
                flags: { 
                    core: { overlay: true } ,
                    " + system.Consts.SYSTEMID + ": {effetmort: true}
                }
            }]);
        }
    });


    Hooks.on("updateActor", (actor, changes, options, userId) => {

    });*/
}