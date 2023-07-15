import { NS } from "@ns";

export const hackFunctions = [
  "hack"
]

export async function mainHack(ns: NS) : Promise<void> {
  ns.enableLog("hack")
  await ns.hack(ns.args[1] as string, {
    additionalMsec: ns.args[2] as number,
    stock: ns.args[3] as boolean,
    threads: (ns.args[4] as number)
  })
  ns.writePort(ns.args[5] as number, 0)
  ns.clearPort(ns.args[5] as number)
}
