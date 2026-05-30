
import { SystemConsts } from "../SystemConsts.mjs";

export class Dialog extends foundry.applications.api.DialogV2 {
    static DEFAULT_OPTIONS = {
        ...super.DEFAULT_OPTIONS,
        classes: ["dialog", SystemConsts.SYSTEMID + "-dialog"],
    }
    
}