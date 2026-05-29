

export class SystemDataModel extends foundry.abstract.TypeDataModel {

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