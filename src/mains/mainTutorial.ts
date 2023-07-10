import { NS } from "@ns";
import * as staticList from "@/staticRam"
import { TerminalUI } from "@/TerminalUI/TerminalUI"

export const tutorialFunctions = Object.keys(staticList)

export async function mainTutorial(ns: NS): Promise<void> {
  const ui = new TerminalUI(ns)

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, no-constant-condition
  while(ui.state.testCount < 30) {
    await ns.asleep(500);
    ui.state.testCount++
    ui.update()
  }
  ui.close()
  await ns.asleep(5000)
}
