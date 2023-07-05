import { NS } from "@ns";
import * as basicList from "@/staticRam"
import { sleep } from "@/hacking/utils";
import RouletteHelper from "@/ui/RouletteHelper/RouletteHelper";

export const basicFunctions = Object.keys(basicList)

export async function mainBasic(ns: NS): Promise<void> {
  ns.clearLog()
  // Cleans up react element after exit
  ns.atExit(() => {
    ns.clearLog()
    ns.closeTail()
  })

  ns.tail()
  ns.resizeTail(750, 500)
  ns.moveTail(350, 450)

  ns.printRaw(React.createElement(RouletteHelper))

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, no-constant-condition
  while(true) {
    await sleep(2000)
  }
}
