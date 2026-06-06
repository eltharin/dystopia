


export function init() {
    Hooks.on("renderCombatTracker", (app, html, data) => {

        for (const li of html.querySelectorAll("li.combatant")) {
            const combatantId = li.dataset.combatantId;
            const combatant = game.combat.combatants.get(combatantId);

            const actor = combatant?.actor;
            if (!actor) continue;

            if (!combatant.flags[game.system.id]?.reaction) {
                combatant.update({flags: {[game.system.id]: {reaction: 0}}});
            }

            // Conteneur
            const container = document.createElement("div");
            container.classList.add("reaction-container");
            
            const button = document.createElement("div");
            button.classList.add("reaction-button");
            button.innerHTML = combatant.flags[game.system.id]?.reaction;
            container.appendChild(button);

            button.onclick = async (e) => {
                e.stopPropagation();
                const reaction = combatant.flags[game.system.id]?.reaction || 0;
                await combatant.update({flags: {[game.system.id]: {reaction: reaction == 0 ? 10 : reaction + 2}}});
            };

            
            button.ondoubleclick = async (e) => {
                e.stopPropagation();
                await combatant.update({flags: {[game.system.id]: {reaction: 0}}});
            };

       /*     // Génération des barres
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
            }*/

            // Injection dans l’entrée du tracker
            li.insertBefore(container, li.lastElementChild);
        }
    });

    Hooks.on("createCombatant", (combatant, options, userId) => {
        
    });

    Hooks.on("updateCombatant", (combatant, options, userId) => {
        document.querySelector(`li.combatant[data-combatant-id="${combatant.id}"] .reaction-button`).innerHTML = combatant.flags[game.system.id]?.reaction || 0;
    });
}