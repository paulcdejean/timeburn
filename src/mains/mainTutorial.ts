import { NS } from "@ns";
import * as staticList from "@/staticRam"
import { TerminalUI } from "@/TerminalUI/TerminalUI"
import { TutorialQuestChain } from "@/quests/TutorialQuests";
import { checkQuests } from "@/quests/Quest";
import { Network } from "@/hacking/network";
import { crackNetwork } from "@/hacking/crack";
import { Capabilities } from "@/capabilities/Capabilities";
import { pickFarm } from "@/hacking/pickFarm";

export const tutorialFunctions = Object.keys(staticList)

export async function mainTutorial(ns: NS): Promise<void> {
  const capability = Capabilities.Tutorial

  const network = new Network(ns)
  crackNetwork(ns, network, 2000)

  const questChain = TutorialQuestChain
  checkQuests(ns, questChain, 2000)

  const ui = new TerminalUI(ns)
  ui.update()

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  while (true) {
    if (!network.upToDate) {
      network.refresh()
    }
    await pickFarm(ns, network, capability).run(ns)
  }
  
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, no-constant-condition
  // while(ui.state.testCount < 30) {
  //   await ns.asleep(500);
  //   ui.state.testCount++
  //   ui.update()
  // }
  // ui.close()
  // await ns.asleep(5000)
}
