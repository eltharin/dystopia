

export class SystemDataModel extends foundry.abstract.TypeDataModel {

    static DEFAULT_ICON  = "";
    
    constructor(data, options) 
    {
        super(data, options);
        if(this.constructor.DEFAULT_ICON && options.parent.img === options.parent.constructor.DEFAULT_ICON) {
            options.parent.img = this.constructor.DEFAULT_ICON;
        }
    }

    static preSaveFunctions = [
    ];

    async _preUpdate(changes, options, user) {
        const allowed = await super._preUpdate(changes, options, user);
        let clone = this.clone(); 
        foundry.utils.mergeObject(clone, changes.system, { insertKeys: true, insertValues: true }); 
        clone.prepareDerivedData();
        
        this.constructor.preSaveFunctions.forEach(element => {
            this[element](changes, clone);
        });
        
    }
}