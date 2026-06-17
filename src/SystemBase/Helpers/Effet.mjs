import * as system from "../../_helpers.mjs";


export function register(type, dataModel, sheet, label) {
   
    CONFIG.ActiveEffect.dataModels = {
        ...(CONFIG.ActiveEffect.dataModels || {}),
        [type]: dataModel,
    };

    foundry.applications.apps.DocumentSheetConfig.registerSheet(ActiveEffect, system.Consts.SYSTEMID, sheet, {
        label: label,
        types: [type],
        makeDefault: true
    });
}