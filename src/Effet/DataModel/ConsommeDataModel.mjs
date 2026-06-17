import { BaseEffetDataModel } from "./BaseEffetDataModel.mjs";

export class ConsommeDataModel extends BaseEffetDataModel{


    async _preCreate(data, options, user) {
        await super._preCreate(data, options, user);
        this.parent.updateSource({"disabled": true});
    }
}