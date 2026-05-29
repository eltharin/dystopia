import * as system from "../../_helpers.mjs";


export function register(type, dataModel, sheet, label) {
    CONFIG.Actor.dataModels = {
        ...(CONFIG.Actor.dataModels || {}),
        [type]: dataModel,
    };
    
    foundry.documents.collections.Actors.registerSheet(system.Consts.SYSTEMID, sheet, {
        types: [type],
        makeDefault: true,
        label: label
    });
}