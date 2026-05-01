
import * as system from "../../_helpers.mjs"

export class CompetenceRollDialog {
    static async create(options = {}) {
        
        let data = {
            isMagie: options.isMagie,
            options: {
                difficulteDefaut: 4,
                difficulte: {
                    mediocre: {
                        value: 0,
                        isDefault: false
                    },
                    correct: {
                        value: 2,
                        isDefault: false
                    },
                    moyen: {
                        value: 4,
                        isDefault: true
                    },
                    bon: {
                        value: 6,
                        isDefault: false
                    },
                    excellent: {
                        value: 8,
                        isDefault: false
                    },
                    legendaire: {
                        value: 10,
                        isDefault: false
                    }
                }
            }
        };

        return await system.Common.Dialog.input({
            content: await foundry.applications.handlebars.renderTemplate(system.Consts.TEMPLATES_PATH + "/dice/competence/roll-dialog.hbs", data),
            window: {title: "lancer de dé"},
            ok: {
                label: game.i18n.format(system.Consts.SYSTEMID + ".roll.common.rolldice"),
                default: true,
                icon: "fa-solid fa-floppy-disk",
            }
        });
    }
}