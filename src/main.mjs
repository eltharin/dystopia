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

  system.Base.Helpers.Actor.register("pj", ActorPjDataModel, PjSheet, "Feuille de Personnage Joueur");
  system.Base.Helpers.Actor.register("pnj", ActorPnjDataModel, PnjSheet, "Feuille de Personnage Non Joueur");
  system.Base.Helpers.Item.register("objet", ObjetDataModel, ObjetSheet, "Feuille d'objet");


  system.Settings.fct.registerSettings();

  registerHandleBarFunctions();

  system.DiceRoller.fct.registerMessageEventListener();
  system.Actor.Events.register();

  system.DiceRoller.fct.registerDiceRolls();
});

