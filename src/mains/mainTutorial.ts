import { NS } from "@ns";
import * as staticList from "@/staticRam"
import { TerminalUI } from "@/TerminalUI/TerminalUI"
import { TutorialQuestChain } from "@/quests/TutorialQuests";
import { checkQuests } from "@/quests/Quest";
import { Network } from "@/hacking/network";
import { crackNetwork } from "@/hacking/crack";
import { Capabilities, upgradeCapabilities } from "@/capabilities/Capabilities";
import { pickFarm } from "@/hacking/pickFarm";

export const tutorialFunctions = Object.keys(staticList)

export async function mainTutorial(ns: NS): Promise<void> {
  const capability = Capabilities.Tutorial

  const network = new Network(ns)
  crackNetwork(ns, network, 2000)

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
    const farm = pickFarm(ns, network, capability)
    ui.state.currentHackingTarget = farm.target
    ui.update()
    await farm.run(ns)
  }
}
