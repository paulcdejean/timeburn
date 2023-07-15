import { NS } from "@ns";
import * as staticList from "@/staticRam"
import { TerminalUI } from "@/TerminalUI/TerminalUI"
import { TutorialQuestChain } from "@/quests/TutorialQuests";
import { checkQuests } from "@/quests/Quest";
import { Network } from "@/hacking/network";
import { Capabilities, upgradeCapabilities } from "@/capabilities/Capabilities";
import { onlyHack } from "@/hacking/farmingAlgos/onlyHack";
import { Farm } from "@/hacking/Farm";

export const tutorialFunctions = Object.keys(staticList)

export async function mainTutorial(ns: NS): Promise<void> {
  const capability = Capabilities.Tutorial

  const network = new Network(ns)

  const questChain = TutorialQuestChain
  checkQuests(ns, questChain, 2000)

  const ui = new TerminalUI(ns, capability)
  ui.update()

  ns.atExit(() => {
    ui.close()
  })

  while (!upgradeCapabilities(ns, capability)) {
    if (!network.upToDate) {
      network.refresh()
    }
    
    // Designed to get 200k as fast as possible

    const tutorialTarget = "foodnstuff"
    const tutorialFarm = new Farm(ns, network, ns.getServer(tutorialTarget), ns.getHackTime(tutorialTarget))
    onlyHack(tutorialFarm)
    ui.state.currentHackingTarget = tutorialFarm.target
    ui.update()
    await tutorialFarm.run()
  }
}
