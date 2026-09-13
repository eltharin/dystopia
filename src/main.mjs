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
import { TraitSheet } from "./Item/Sheet/TraitSheet.mjs";
import { CompetenceSheet } from "./Item/Sheet/CompetenceSheet.mjs";
import { EffetContainerSheet } from "./Item/Sheet/EffetContainerSheet.mjs";

import { AppliqueSheet } from "./Effet/Sheet/AppliqueSheet.mjs"
import { ConsommeSheet } from "./Effet/Sheet/ConsommeSheet.mjs"
import { PorteSheet } from "./Effet/Sheet/PorteSheet.mjs"

import { ObjetDataModel } from "./Item/DataModel/ObjetDataModel.mjs";
import { ArmeDataModel } from "./Item/DataModel/ArmeDataModel.mjs";
import { ArmureDataModel } from "./Item/DataModel/ArmureDataModel.mjs";
import { SortDataModel } from "./Item/DataModel/SortDataModel.mjs";
import { TraitDataModel } from "./Item/DataModel/TraitDataModel.mjs";
import { CompetenceDataModel } from "./Item/DataModel/CompetenceDataModel.mjs";
import { EffetContainerDataModel } from "./Item/DataModel/EffetContainerDataModel.mjs";

import { AppliqueDataModel } from "./Effet/DataModel/AppliqueDataModel.mjs"
import { ConsommeDataModel } from "./Effet/DataModel/ConsommeDataModel.mjs"
import { PorteDataModel } from "./Effet/DataModel/PorteDataModel.mjs"

import {registerFunctions as registerHandleBarFunctions} from "./SystemBase/Helpers/Handlebars.mjs"
import {CombatBars} from "./Settings/CombatBars.mjs"
import { MessageActionResolver } from "./SystemBase/ChatMessage/MessageActionResolver.mjs";
import { CombatManager } from "./Combat/CombatManager.mjs";
import { DynamicChatMessageManager } from "./SystemBase/ChatMessage/DynamicChatMessageManager.mjs";


CONFIG.ActiveEffect.expiryAction = "delete"

Hooks.once("init", () => {
  console.log(system.Consts.SYSTEMID + " | Initialisation du système " + system.Consts.SYSTEMID);

  system.Base.init();

  system.Base.Helpers.Actor.register("pj", ActorPjDataModel, PjSheet, game.i18n.localize(system.Consts.SYSTEMID + ".sheet.names.pj"));
  system.Base.Helpers.Actor.register("pnj", ActorPnjDataModel, PnjSheet, game.i18n.localize(system.Consts.SYSTEMID + ".sheet.names.pnj"));
  system.Base.Helpers.Actor.register("boss", ActorBossDataModel, BossSheet, game.i18n.localize(system.Consts.SYSTEMID + ".sheet.names.boss"));
  
  system.Base.Helpers.Item.register("objet", ObjetDataModel, ObjetSheet, game.i18n.localize(system.Consts.SYSTEMID + ".sheet.names.objet"));
  system.Base.Helpers.Item.register("arme", ArmeDataModel, ArmeSheet, game.i18n.localize(system.Consts.SYSTEMID + ".sheet.names.arme"));
  system.Base.Helpers.Item.register("armure", ArmureDataModel, ArmureSheet, game.i18n.localize(system.Consts.SYSTEMID + ".sheet.names.armure"));
  system.Base.Helpers.Item.register("sort", SortDataModel, SortSheet, game.i18n.localize(system.Consts.SYSTEMID + ".sheet.names.sort"));
  system.Base.Helpers.Item.register("trait", TraitDataModel, TraitSheet, game.i18n.localize(system.Consts.SYSTEMID + ".sheet.names.trait"));
  system.Base.Helpers.Item.register("competence", CompetenceDataModel, CompetenceSheet, game.i18n.localize(system.Consts.SYSTEMID + ".sheet.names.competence"));
  system.Base.Helpers.Item.register("effetContainer", EffetContainerDataModel, EffetContainerSheet, game.i18n.localize(system.Consts.SYSTEMID + ".sheet.names.effetContainer"));
  
  system.Base.Helpers.Effet.register("effetPorte", PorteDataModel, PorteSheet, game.i18n.localize(system.Consts.SYSTEMID + ".sheet.names.effetPorte"));
  system.Base.Helpers.Effet.register("effetApplique", AppliqueDataModel, AppliqueSheet, game.i18n.localize(system.Consts.SYSTEMID + ".sheet.names.effetApplique"));
  system.Base.Helpers.Effet.register("effetConsomme", ConsommeDataModel, ConsommeSheet, game.i18n.localize(system.Consts.SYSTEMID + ".sheet.names.effetConsomme"));
  system.Base.Helpers.Effet.register("effetEtat", PorteDataModel, PorteSheet, game.i18n.localize(system.Consts.SYSTEMID + ".sheet.names.effetConsomme"));

  system.Settings.fct.registerSettings();

  registerHandleBarFunctions();

  system.Actor.Events.register();

  system.DiceRoller.fct.registerDiceRolls();

  
  system.Base.Helpers.Migration.register( system.Settings.Migration  );

  CombatBars.init();
  
  system.Combat.CombatManager.init();

  MessageActionResolver.register("reponseAttaque", CombatManager._onReponseAttaque)
  MessageActionResolver.register("enleverPV", CombatManager._onEnlevePV)
  MessageActionResolver.register("affectDegatEffets", CombatManager._onAffectDegatEffets)
  MessageActionResolver.register("ajoutEtatEffets", CombatManager._onAjoutEtatEffets)

  system.Settings.StatusEffect.init();

  DynamicChatMessageManager.init();
  DynamicChatMessageManager.register('attaque', system.Combat.AttaqueMessage);

});

