import * as system  from "../_helpers.mjs";

export class BaseRoll extends Roll {
    
    constructor(formula="", data={}, options={}) {
        super(formula, data, options);
        
        if(this.options.coutFletrine == undefined) {
            this.options.coutFletrine = 0;            
        }
        
        if(this.options.coutFletrineOk == undefined) {
            this.options.coutFletrineOk = false;            
        }
    }

    async _prepareChatRenderContext({flavor, isPrivate=false, ...options}={}) {
        let ret = await super._prepareChatRenderContext({flavor, isPrivate, ...options});
        ret.result = game.i18n.format(this.getResultText());
        ret.totalText = this.getTotalText();
        ret.totalValue = this.getTotalValue();
        ret.seuil = this.getSeuil();

        ret.fletrineTooltip = await this.getFletrineTooltip();

        return ret;
    }
    
    async getFletrineTooltip() {
        
        return foundry.applications.handlebars.renderTemplate(system.Consts.TEMPLATES_PATH + "/dice/affect_fletrine.hbs", {
            isMagie: this.isCompetenceMagie(),
            nb: this.options.coutFletrine, 
            ok: this.options.coutFletrineOk
        });
    }

    isCompetenceMagie()
    {
        console.error("can't have resolve isCompetenceMAgie on " + this.constructor.name);
    }

    getActor()
    {
        console.error("can't have resolve getToken on " + this.constructor.name);
    }

    getResultText()
    {
        return game.i18n.format(system.Consts.SYSTEMID + ".rolldice.result." + this.getResult());
    }

    static fromData(data) {
        return super.fromData(data);
    }

    async toMessage(messageData = {}, options = {}) {
        const msg = await super.toMessage(messageData, options);

        if(this instanceof BaseRoll && this.isCompetenceMagie()) {
            if(this.getActor().isSurchauffe) {
                const myRoll = new system.DiceRoller.SurchauffeRoll("1d12",{}, {});
                myRoll.toMessage({
                    async: true, 
                    flavor: "Surchauffe",
                    speaker: ChatMessage.getSpeaker({ alias: this.getActor().actor.name + " ( " + game.user.name + " )"}),
                });
            } else if (this.getActor().isDissonnance) {
                system.Actor.fct.enterSurchauffe(this.getActor().actor);
            }
        }

        return msg;
    }

    getTotalParts()
    {
        return [
            
        ]
    }

    convertTotal(tableau)
    {
        return tableau.map(e => {
            if(Array.isArray(e)) {
                return [e[0] || 0, e[1] || "+"];
            }
            else {
                return [e || 0, "+"];
            }
        })
    }

    getTotalText()
    {
        return this.getCalculText(this.convertTotal([...this.getTotalParts(), this.total]));
    }

    getTotalValue()
    {
        return this.getCalculValue(this.convertTotal([...this.getTotalParts(), this.total]));
    }

    getCalculText(tableau)
    {
        return tableau.reduce((str, val) => {
            return (str != "" ? str + " " + val[1] + " " : "") + String(val[0]) 
        },"");
    }

    getCalculValue(tableau)
    {
        return tableau.reduce((sum, val) => sum + (Number(val[0] || 0) * (val[1] == "-" ? -1 : 1)),0);
    }

    getResultat()
    {
        return this.getTotalValue() - this.getSeuil() >= 0;
    }

    getSeuil()
    {
        return 0;
    }
}
