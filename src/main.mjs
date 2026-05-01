import * as system from "./_helpers.mjs";

import { PjSheet } from "./Actor/Sheet/PjSheet.mjs";
import { PnjSheet } from "./Actor/Sheet/PnjSheet.mjs";

import { ActorPjDataModel } from "./Actor/DataModel/ActorPjDataModel.mjs";
import { ActorPnjDataModel } from "./Actor/DataModel/ActorPnjDataModel.mjs";

import { ObjetSheet } from "./Item/Sheet/ObjetSheet.mjs";

import { ObjetDataModel } from "./Item/DataModel/ObjetDataModel.mjs";

import {registerFunctions as registerHandleBarFunctions} from "./Handlebars.mjs"


Hooks.once("init", () => {
  console.log(system.Consts.SYSTEMID + " | Initialisation du système " + system.Consts.SYSTEMID);

  CONFIG.Actor.dataModels = {
    pj: ActorPjDataModel,
    pnj: ActorPnjDataModel,
  };
  
  CONFIG.Item.dataModels = {
    objet: ObjetDataModel,
  };
  
  foundry.documents.collections.Actors.registerSheet(system.Consts.SYSTEMID, PjSheet, {
    types: ["pj"],
    makeDefault: true,
    label: "Feuille de Personnage Joueur"
  });
  foundry.documents.collections.Actors.registerSheet(system.Consts.SYSTEMID, PnjSheet, {
    types: ["pnj"],
    makeDefault: true,
    label: "Feuille de Personnage Non Joueur"
  });
  foundry.documents.collections.Items.registerSheet(system.Consts.SYSTEMID, ObjetSheet, {
    types: ["objet"],
    makeDefault: true,
    label: "Feuille d'objet"
  });

  system.Settings.fct.registerSettings();

  registerHandleBarFunctions();

  system.DiceRoller.fct.registerMessageEventListener();
  system.Actor.Events.register();

  system.DiceRoller.fct.registerDiceRolls();
});

