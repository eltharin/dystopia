import * as system  from "../_helpers.mjs";

export class BaseRoll extends Roll {
    
    constructor(formula="", data={}, options={}) {
        super(formula, data, options);
        
    }

    async _prepareChatRenderContext({flavor, isPrivate=false, ...options}={}) {
        let ret = await super._prepareChatRenderContext({flavor, isPrivate, ...options});
       // ret.result = game.i18n.format(this.getResultText());
        //ret.totalText = this.getTotalText();
        //ret.totalValue = this.getTotalValue();
        //ret.seuil = this.getSeuil();

        return ret;
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

   /* async toMessage(messageData = {}, options = {}) {
        const msg = await super.toMessage(messageData, options);

        return msg;
    }

    getTotalParts()
    {
        return [
            
        ]
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
    }*/
}
