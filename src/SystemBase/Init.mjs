

import { MessageActionResolver } from "./ChatMessage/MessageActionResolver.mjs";

export function init() {
    console.log("Initializing Global System");
    
    initializeChatMessageActions();
}

function initializeChatMessageActions() {
    Hooks.on("renderChatMessageHTML", (message, html, data) => {
        html.querySelectorAll(".chat-message [data-action]").forEach(btn => {
            btn.addEventListener("click", event => {
                const action = event.currentTarget.dataset.action;
                MessageActionResolver.executeAction(action, event, message, data);
            });
        });

        html.querySelectorAll(".chat-message [data-hover]").forEach(btn => {
            btn.addEventListener("mouseenter", event => {
                const action = event.currentTarget.dataset.hover;
                MessageActionResolver.executeAction(action, event, message, data);
            });
            
            btn.addEventListener("mouseout", event => {
                const action = event.currentTarget.dataset.hover;
                MessageActionResolver.executeAction(action, event, message, data);
            });
        });
    });
}