import { NS } from "@ns";
import * as staticList from "@/staticRam"
import { TerminalUI } from "@/TerminalUI/TerminalUI"
import { TutorialQuestChain } from "@/quests/TutorialQuests";
import { checkQuests } from "@/quests/Quest";

export const tutorialFunctions = Object.keys(staticList)

export async function mainTutorial(ns: NS): Promise<void> {
  const ui = new TerminalUI(ns)
  ui.update()

  checkQuests(ns, TutorialQuestChain, 2000)
  

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, no-constant-condition
  // while(ui.state.testCount < 30) {
  //   await ns.asleep(500);
  //   ui.state.testCount++
  //   ui.update()
  // }
  // ui.close()
  // await ns.asleep(5000)
}
