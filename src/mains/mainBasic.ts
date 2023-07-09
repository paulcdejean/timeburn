import { NS } from "@ns";
import * as basicList from "@/staticRam"
import { TerminalUI } from "@/TerminalUI/TerminalUI"

export const basicFunctions = Object.keys(basicList)

export async function mainBasic(ns: NS): Promise<void> {
  const ui = new TerminalUI();

  ui.render(ns)

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, no-constant-condition
  while(true) {
    await ns.asleep(500);
    ui.state.testCount++
    ui.update()
  }
}
