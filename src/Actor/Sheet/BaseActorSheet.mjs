import * as system  from "../../_helpers.mjs";


export class BaseActorSheet extends system.Base.BaseSheet (
  foundry.applications.sheets.ActorSheetV2
) {
  static PARTS = {
    form: { 
      template: system.Consts.TEMPLATES_PATH + "/actor/pj/pj-sheet.hbs",
      templates: [      ] ,
    },
    main: {
      template: system.Consts.TEMPLATES_PATH + "/actor/parts/carac.hbs",
      container: { id: "form" , element: ".tabscontainer" },
    },
    perso: {
      template: system.Consts.TEMPLATES_PATH + "/actor/parts/perso.hbs",
      container: { id: "form" , element: ".tabscontainer" },
    },
    aptitudes: {
      template: system.Consts.TEMPLATES_PATH + "/actor/parts/aptitudes.hbs",
      container: { id: "form" , element: ".tabscontainer" },
      scrollable: [".tabscontainer"]
    },
    competences: {
      template: system.Consts.TEMPLATES_PATH + "/actor/parts/competences.hbs",
      container: { id: "form" , element: ".tabscontainer" },
      scrollable: [".tabscontainer"]
    },
    combat: {
      template: system.Consts.TEMPLATES_PATH + "/actor/parts/combat.hbs",
      container: { id: "form" , element: ".tabscontainer" },
    },
    inventaire: {
      template: system.Consts.TEMPLATES_PATH + "/actor/parts/inventaire.hbs",
      container: { id: "form" , element: ".tabscontainer" },
    },
    notes: {
      template: system.Consts.TEMPLATES_PATH + "/actor/parts/notes.hbs",
      container: { id: "form" , element: ".tabscontainer" },
    },
    GM: {
      template: system.Consts.TEMPLATES_PATH + "/actor/parts/gm.hbs",
      container: { id: "form" , element: ".tabscontainer" },
    },

    
  };

  static TABS = {
    sheet: {
      tabs: [
        {id: "main", label: system.Consts.SYSTEMID + ".sheet.actor.tabs.main"},
        {id: "perso", label: system.Consts.SYSTEMID + ".sheet.actor.tabs.perso"},
        {id: "aptitudes", label: system.Consts.SYSTEMID + ".sheet.actor.tabs.aptitudes"},
        {id: "competences", label: system.Consts.SYSTEMID + ".sheet.actor.tabs.competences"},
        {id: "combat", label: system.Consts.SYSTEMID + ".sheet.actor.tabs.combat"},
        {id: "inventaire", label: system.Consts.SYSTEMID + ".sheet.actor.tabs.inventaire"},
        {id: "notes", label: system.Consts.SYSTEMID + ".sheet.actor.tabs.notes"},
        {id: "GM", label: system.Consts.SYSTEMID + ".sheet.actor.tabs.GM"},
      ],
      initial: "main",
    }
  };

  static PARTIALS = {
    sidebar: system.Consts.TEMPLATES_PATH + "/actor/parts/sidebar.hbs",
    topbar: system.Consts.TEMPLATES_PATH + "/actor/parts/topbar.hbs",
    //actionHeroique_liste: system.Consts.TEMPLATES_PATH + "/shared/actionHeroique/liste.hbs",
  };

  static DEFAULT_OPTIONS = {
    classes: [],
    actions: {
      verouillage: this.verouillage,
      deverouillage: this.deverouillage,
      toggle: this._onToggle,

      addItem: this._onAddItem,
      editItem: this._onEditItem,
      deleteItem: this._onDeleteItem,

      globalRoll: this._onGlobalRoll,
      attaqueRoll: this._onAttaqueRoll,
    },
    position: {
      width: 1030,
      height: 800,
    },
    window: {
      resizable: true,
      controls: [
        {
          action: "verouillage",
          icon: "fa-solid fa-lock",
          label: system.Consts.SYSTEMID + ".sheet.common.verrou",
          ownership: "OWNER",
          visible: this.#canVerouillage
        },
        {
          action: "deverouillage",
          icon: "fa-solid fa-unlock",
          label: system.Consts.SYSTEMID + ".sheet.common.deverrou",
          ownership: "OWNER",
          visible: this.#canDeverouillage
        }
      ]
    },
  }

  static #canVerouillage() {
    return this.isEditable && !this.actor.system.isLocked;
  }
  
  static #canDeverouillage() {
    return this.isEditable && this.actor.system.isLocked;
  }

  static async verouillage() {
    await this.actor.update({"system.isLocked":true});
    this._updateFrame({window: {}});
  }
  
  static async deverouillage() {
    await this.actor.update({"system.isLocked":false});
    this._updateFrame({window: {}});
  }

  static async _onToggle(event, target) {
    this.element.querySelectorAll("[data-toggle_section='" + target.dataset.toggle + "']").forEach(e => e.classList.toggle("visible"));
    //--TODO: ajouter changement icone
  }

  _prepareSubmitData(event, form, formData, updateData) { 

    let data  = super._prepareSubmitData(event, form, formData, updateData);

    return data ; 
  }

  
  async _prepareContext(options) {
    
    const context = await super._prepareContext(options)

    context.isVerrou = this.actor.system.isLocked;


    let allItems = foundry.utils.deepClone(this.document.items.documentsByType);

    context.armes = allItems.arme || [];
    delete allItems.arme;
    context.armures = allItems.armure || [];
    delete allItems.armure;
    context.sorts = allItems.sort || [];
    delete allItems.sort;
    context.aptitudes = allItems.aptitude || [];
    delete allItems.aptitude;
    context.competences = allItems.competence || [];
    delete allItems.competence;
    context.consommables = allItems.consommable || [];
    delete allItems.consommable;
    
    context.items = Object.values(allItems).reduce((a, b ) => [...a, ...b], []);

    context.system.coutDeplacement.bonus = context.armures.reduce((acc, armure) => acc + armure.system.coutDeplacement, 0);

    context.system.coutDeplacement.total = context.system.coutDeplacement.val + context.system.coutDeplacement.temp + context.system.coutDeplacement.bonus;


    return context
  }
  
  static async _onAddItem(event, target) {
    event.preventDefault();
    const type = target.dataset.type;
    
    const itemData = {
      name: type,
      type: type,
      system: {}
    };
    
    // Creer l'item sans render automatique
    const created = await this.document.createEmbeddedDocuments("Item", [itemData], { render: true });
    if (created && created[0]) {
      created[0].sheet.render(true, { force: true });
    }
    
    return created;
  }
  
  static async _onEditItem(event, target) {
    event.preventDefault();
    const item = this.document.items.get(target.dataset.itemid);
    if (item) {      
      if (item.sheet.rendered) {
        item.sheet.bringToTop();
      } else {
        item.sheet.render(true, { force: true });
      }
    }
  }
  
  static async _onDeleteItem(event, target) {
    event.preventDefault();
    const item = this.document.items.get(target.dataset.itemid);


    if (item) {
      if(item.system.isDefault == true)
      {
        ui.notifications.error(`Vous ne pouvez pas supprimer ${item.name}, c'est un �l�ment de base.`);
        return;
      }

      let confirmed = false;

      if(event.ctrlKey && event.shiftKey)
      {
        confirmed = true;
      }
      else
      {
        confirmed = await system.Base.Dialog.confirm({
          content: `<p>�tes-vous s�r de vouloir supprimer ${item.name}?</p>`,
          rejectClose: false,
          modal: true
        });
      }

      if (confirmed) {

        await item.delete({ render: true });
        ui.notifications.info(`${item.name} supprim�(e)`);
      }
    }
  }  

  static async _onGlobalRoll(event, target){
    event.preventDefault();

    const actor = this.document;

    const modificateurs = await system.DiceRoller.GlobalRollDialog.create({ });
    if (modificateurs == null) { return; }

    const myRoll = new system.DiceRoller.GlobalRoll("2d10",{}, {
        modificateurs: modificateurs,
        actor: actor.uuid,
        seuilCritique: actor.system.seuilCritique.total,
    });

    myRoll.toMessage({
      speaker: ChatMessage.getSpeaker({ alias: this.document.name + " ( " + game.user.name + " )"}),
    });

  }

  static async _onAttaqueRoll(event, target){
    event.preventDefault();

    const actor = this.document;
    const arme =  this.document.items.get(target.dataset.arme);

    if(!game.user.targets.size) {
      ui.notifications.error("Veuillez sélectionner une cible pour l'attaque.");
      return;
    }

    ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ alias: this.document.name + " ( " + game.user.name + " )"}),
      content: `Attaque avec l'arme ${arme.name} sur la cible ${[...game.user.targets].map(t => t.name).join(", ")}`
    });
    
/*
    const modificateurs = await system.DiceRoller.AttaqueRollDialog.create({ });
    if (modificateurs == null) { return; }
*/
    const myRoll = new system.DiceRoller.AttaqueRoll("2d10",{}, {
        actor: actor.uuid,
        seuilCritique: actor.system.seuilCritique.total,
        cibles: [...game.user.targets].map(t => { return { uuid: t.uuid, nom: t.name, seuilDefense: t.actor.system.seuilDefense }; }),
        arme: {
          nom: arme.name,
          degat: arme.system.degatsBase,
          //degatsMagiques: arme.system.degatsMagiques,
          bonusDegats: 0
        }
    });

    myRoll.toMessage({
      speaker: ChatMessage.getSpeaker({ alias: this.document.name + " ( " + game.user.name + " )"}),
    });
  
  }
  
/*
  static async _onToggle(event, target) {
    this.element.querySelectorAll("[data-toggle_section='" + target.dataset.toggle + "']").forEach(e => e.classList.toggle("visible"));
    //--TODO: ajouter changement icone
  }
*/

  async _onDrop(event) {
    const data = foundry.applications.ux.TextEditor.implementation.getDragEventData(event);

    switch(data.type)
    {
      case "Item": 
        const item = fromUuidSync(data.uuid);
        
        if(item.type == "objet" || item.type == "arme" || item.type == "armure" || item.type == "sort" || item.type == "aptitude" || item.type == "competence") {
          super._onDrop(event);

        }
    }
  }
  /*
  static async _onAddItem(event, target) {
    event.preventDefault();
    const type = target.dataset.type;
    
    const itemData = {
      name: type,
      type: type,
      system: {}
    };
    
    // Cr�er l'item sans render automatique
    const created = await this.document.createEmbeddedDocuments("Item", [itemData], { render: true });
    if (created && created[0]) {
      created[0].sheet.render(true, { force: true });
    }
    
    return created;
  }
  
  static async _onEditItem(event, target) {
    event.preventDefault();
    const item = this.document.items.get(target.dataset.itemid);
    if (item) {      
      if (item.sheet.rendered) {
        item.sheet.bringToTop();
      } else {
        item.sheet.render(true, { force: true });
      }
    }
  }
  
  static async _onDeleteItem(event, target) {
    event.preventDefault();
    const item = this.document.items.get(target.dataset.itemid);

    if (item) {
      if(item.system.isDefault == true)
      {
        ui.notifications.error(`Vous ne pouvez pas supprimer ${item.name}, c'est un �l�ment de base.`);
        return;
      }

      let confirmed = false;

      if(event.ctrlKey && event.shiftKey)
      {
        confirmed = true;
      }
      else
      {
        confirmed = await system.Common.Dialog.confirm({
          content: `<p>�tes-vous s�r de vouloir supprimer ${item.name}?</p>`,
          rejectClose: false,
          modal: true
        });
      }

      if (confirmed) {

        await item.delete({ render: true });
        ui.notifications.info(`${item.name} supprim�(e)`);
      }
    }
  }  
*/
  /*
  static async _onEquipeArmure(event, target) {
    this.actor.items.get(target.dataset.itemid).update({"system.isEquipe": true});
  } 

  static async _onDesequipeArmure(event, target) {
    this.actor.items.get(target.dataset.itemid).update({"system.isEquipe": false});
  } 
*/
  
}