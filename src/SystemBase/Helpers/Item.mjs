import * as system from "../../_helpers.mjs";


export function register(type, dataModel, sheet, label) {
    CONFIG.Item.dataModels = {
        ...(CONFIG.Item.dataModels || {}),
        [type]: dataModel,
    };
    
    foundry.documents.collections.Items.registerSheet(system.Consts.SYSTEMID, sheet, {
        types: [type],
        makeDefault: true,
        label: label
    });
}