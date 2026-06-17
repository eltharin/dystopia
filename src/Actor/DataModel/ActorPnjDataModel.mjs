import * as system from "../../_helpers.mjs";


export class ActorPnjDataModel extends system.Actor.BaseActorDataModel {
    static defineSchema() {
    // All Actors have resources.
        return {
            ...super.defineSchema(),
        };
    }

    async _preCreate(data, options, user) {
        await super._preCreate(data, options, user);
        this.parent.updateSource({"system.initiative": 2});
    }

}