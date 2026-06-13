import * as system from "./../_helpers.mjs";




export class CombatBars  {

    static init() {
        this.registerSettings();
        this.registerHooks();
    }

    static getSettings() {
        return {
            showTokenBars: game.settings.get(system.Consts.SYSTEMID, "showTokenBars"),
            showCombattantBars: game.settings.get(system.Consts.SYSTEMID, "showCombattantBars"),
        }
    }
    
    static registerSettings() {
        game.settings.register(system.Consts.SYSTEMID, "showTokenBars", {
            name: system.Consts.SYSTEMID + ".settings.combatBars.showTokenBars",
            scope: "user",
            config: true,
            type: Boolean,
            default: false,
            requiresReload: true
        });

        game.settings.register(system.Consts.SYSTEMID, "showCombattantBars", {
            name: system.Consts.SYSTEMID + ".settings.combatBars.showCombattantBars",
            scope: "user",
            config: true,
            type: Boolean,
            default: true,
            requiresReload: true
        });
    }

    static registerHooks() {
        Hooks.on("refreshToken", (token) => {
            this.drawTokenCustomBars(token);
        });

        Hooks.on("renderCombatTracker", (app, html, data) => {
            this.drawCombattantCustomBars(app, html, data);
        });
    }

    static drawTokenCustomBars(token) {
        if(!this.getSettings().showTokenBars) return;

        const actor = token.actor;
        if (!actor) return;

        // Supprimer les anciennes barres
        if (token._customBars) {
            token._customBars.forEach(g => g.destroy());
        }
        token._customBars = [];

        const bars = [
            { color: 0xff0000, data: actor.system.values.pv },      // HP
            { color: 0x00ff00, data: actor.system.values.pm }, // Stamina
            { color: 0x4a6df0, data: actor.system.values.pe }     // Mana
        ];

        const height = 20;
        const spacing = 10;

        bars.forEach((bar, index) => {
            if (!bar.data || bar.data.max === 0) return;

            const pct = bar.data.val / bar.data.max;
            const g = new PIXI.Graphics();

            const y = token.h + (index * (height + spacing));

            // Fond
            g.beginFill(0x000000, 0.6);
            g.drawRect(-10, y, token.w+20, height);
            g.endFill();

            // Barre colorée
            g.beginFill(bar.color);
            g.drawRect(-10, y, (token.w+20) * pct, height);
            g.endFill();

            token.addChild(g);
            token._customBars.push(g);
        });
    }

    static drawCombattantCustomBars(app, html, data) {
        if(!this.getSettings().showCombattantBars) return;

        for (const li of html.querySelectorAll("li.combatant")) {
            const combatantId = li.dataset.combatantId;
            const combatant = game.combat.combatants.get(combatantId);

            const actor = combatant?.actor;

            if (!actor) continue;

            // Récupération des ressources
            const bars = [
            { color: system.Consts.COLOR_ACTOR_VALUES_PV, data: actor.system.values.pv },
            { color: system.Consts.COLOR_ACTOR_VALUES_PM, data: actor.system.values.pm },
            { color: system.Consts.COLOR_ACTOR_VALUES_PE, data: actor.system.values.pe }
            ];

            // Conteneur
            const container = document.createElement("div");
            container.classList.add("custom-bars");

            // Génération des barres
            for (const bar of bars) {
                if (!bar.data || bar.data.max === 0) continue;

                const pct = (bar.data.val / bar.data.max) * 100;

                const line = document.createElement("div");
                line.classList.add("bar-line");

                const fill = document.createElement("div");
                fill.classList.add("bar-fill");
                fill.style.width = pct + "%";
                fill.style.background = bar.color;

                line.appendChild(fill);
                container.appendChild(line);
            }

            // Injection dans l’entrée du tracker
            li.querySelector('.token-name').appendChild(container);
        }
    };
}