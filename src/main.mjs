import * as system from "./_helpers.mjs";

import { PjSheet } from "./Actor/Sheet/PjSheet.mjs";
import { PnjSheet } from "./Actor/Sheet/PnjSheet.mjs";
import { BossSheet } from "./Actor/Sheet/BossSheet.mjs";

import { ActorPjDataModel } from "./Actor/DataModel/ActorPjDataModel.mjs";
import { ActorPnjDataModel } from "./Actor/DataModel/ActorPnjDataModel.mjs";
import { ActorBossDataModel } from "./Actor/DataModel/ActorBossDataModel.mjs";

import { ObjetSheet } from "./Item/Sheet/ObjetSheet.mjs";
import { ArmeSheet } from "./Item/Sheet/ArmeSheet.mjs";
import { ArmureSheet } from "./Item/Sheet/ArmureSheet.mjs";
import { SortSheet } from "./Item/Sheet/SortSheet.mjs";
import { AptitudeSheet } from "./Item/Sheet/AptitudeSheet.mjs";
import { CompetenceSheet } from "./Item/Sheet/CompetenceSheet.mjs";

import { ObjetDataModel } from "./Item/DataModel/ObjetDataModel.mjs";
import { ArmeDataModel } from "./Item/DataModel/ArmeDataModel.mjs";
import { ArmureDataModel } from "./Item/DataModel/ArmureDataModel.mjs";
import { SortDataModel } from "./Item/DataModel/SortDataModel.mjs";
import { AptitudeDataModel } from "./Item/DataModel/AptitudeDataModel.mjs";
import { CompetenceDataModel } from "./Item/DataModel/CompetenceDataModel.mjs";

import {registerFunctions as registerHandleBarFunctions} from "./SystemBase/Helpers/Handlebars.mjs"
import {CombatBars} from "./Settings/CombatBars.mjs"
import { MessageActionResolver } from "./SystemBase/ChatMessage/MessageActionResolver.mjs";
import { CombatManager } from "./Combat/CombatManager.mjs";


Hooks.once("init", () => {
  console.log(system.Consts.SYSTEMID + " | Initialisation du système " + system.Consts.SYSTEMID);

  system.Base.init();

  system.Base.Helpers.Actor.register("pj", ActorPjDataModel, PjSheet, "Feuille de Personnage Joueur");
  system.Base.Helpers.Actor.register("pnj", ActorPnjDataModel, PnjSheet, "Feuille de Personnage Non Joueur");
  system.Base.Helpers.Actor.register("boss", ActorBossDataModel, BossSheet, "Feuille de Personnage Non Joueur");
  
  system.Base.Helpers.Item.register("objet", ObjetDataModel, ObjetSheet, "Feuille d'objet");
  system.Base.Helpers.Item.register("arme", ArmeDataModel, ArmeSheet, "Feuille d'arme");
  system.Base.Helpers.Item.register("armure", ArmureDataModel, ArmureSheet, "Feuille d'armure");
  system.Base.Helpers.Item.register("sort", SortDataModel, SortSheet, "Feuille de sort");
  system.Base.Helpers.Item.register("aptitude", AptitudeDataModel, AptitudeSheet, "Feuille d'aptitude");
  system.Base.Helpers.Item.register("competence", CompetenceDataModel, CompetenceSheet, "Feuille de compétence");


  system.Settings.fct.registerSettings();

  registerHandleBarFunctions();

  system.Actor.Events.register();

  system.DiceRoller.fct.registerDiceRolls();

  
  system.Base.Helpers.Migration.register( system.Settings.Migration  );

  CombatBars.init();
  
  system.Combat.CombatManager.init();

  MessageActionResolver.register("reponseAttaque", CombatManager._onReponseAttaque)
  MessageActionResolver.register("deAttaque", CombatManager._onDeAttaque)
  MessageActionResolver.register("enleverPV", CombatManager._onEnlevePV)
});


































