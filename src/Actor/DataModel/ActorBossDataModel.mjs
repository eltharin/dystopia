import * as system from "../../_helpers.mjs";


export class ActorBossDataModel extends system.Actor.BaseActorDataModel {
    static defineSchema() {
    // All Actors have resources.
        return {
            ...super.defineSchema(),
        };
    }

}