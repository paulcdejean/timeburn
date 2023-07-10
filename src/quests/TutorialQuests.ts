import { Quest, QuestChain } from "./Quest";
import type { NS } from "@ns";
import { home, CompletedProgramName } from "@/constants"

const tutorialFinishTutorial: Quest = {
  description: "Upgrade your home computer RAM to 32GB to conclude the tutorial",
  test: (ns: NS) => ns.getServerMaxRam(home) >= 32,
  unlocks: [],
  completed: false,
}

const tutorialPurchaseAll: Quest = {
  description: "Run the command: buy -a",
  test: (ns: NS) => ns.fileExists(CompletedProgramName.bruteSsh, home)
    && ns.fileExists(CompletedProgramName.ftpCrack, home)
    && ns.fileExists(CompletedProgramName.relaySmtp, home)
    && ns.fileExists(CompletedProgramName.httpWorm, home)
    && ns.fileExists(CompletedProgramName.sqlInject, home)
    && ns.fileExists(CompletedProgramName.serverProfiler, home)
    && ns.fileExists(CompletedProgramName.deepScan1, home)
    && ns.fileExists(CompletedProgramName.deepScan2, home)
    && ns.fileExists(CompletedProgramName.autoLink, home)
    && ns.fileExists(CompletedProgramName.formulas, home),
  unlocks: [tutorialFinishTutorial],
  completed: false,
}

const tutorialPurchaseRouter : Quest = {
  description: "Purchase the TOR router from one of the stores in Aevum",
  test: (ns: NS) => ns.hasTorRouter(),
  unlocks: [tutorialPurchaseAll],
  completed: false,
}

const tutorialGetKickedOutOfCasino : Quest = {
  description: "Win 10 billion at the casino in Aevum",
  test: (ns: NS) => ns.getMoneySources().sinceInstall.casino >= 1e10,
  unlocks: [tutorialPurchaseRouter],
  completed: false,
}

const tutorialTravelToAevum : Quest = {
  description: "Travel to Aevum",
  test: (ns: NS) => ns.getPlayer().city === ns.enums.CityName.Aevum,
  unlocks: [tutorialGetKickedOutOfCasino],
  completed: false,
}

export const TutorialQuestChain : QuestChain = [tutorialTravelToAevum]
