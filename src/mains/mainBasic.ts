import { NS } from "@ns";
import * as basicList from "@/staticRam"
import { TerminalUI } from "@/TerminalUI/TerminalUI"

export const basicFunctions = Object.keys(basicList)

export async function mainBasic(ns: NS): Promise<void> {
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
