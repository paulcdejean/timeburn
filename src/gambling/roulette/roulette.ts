import { NS } from "@ns"
import RouletteHelper from "./ui/RouletteHelper"

function fixTail(ns: NS): void {
  setTimeout(ns.resizeTail, 0, 750, 520)
  setTimeout(ns.moveTail, 0, 350, 450)
}

export function roulette(ns: NS): void {
  ns.disableLog("ALL")
  ns.clearLog()
  ns.tail()

  Promise.resolve(1).then(() => {
    fixTail(ns)
  }).catch(() => {})

  setTimeout(fixTail, 0, ns)

  ns.printRaw(React.createElement(RouletteHelper))
}
