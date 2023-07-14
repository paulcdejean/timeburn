import { Farm } from "@/hacking/Farm";
import { Network } from "@/hacking/network";
import { NS } from "@ns";
import { Batch } from "../types";
import { Capabilities } from "@/capabilities/Capabilities";

export function quickHack(ns: NS, network: Network, target: string) : Farm {
  ns.tprint(`Running farming algorithm "quickHack" on target ${target}`)
  const hackTime = ns.getHackTime(target)
  const farm = new Farm(ns, network, ns.getServer(target), hackTime)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const hackBatch : Batch = [{
    capability: Capabilities.Hack,
    threads: Infinity,
    allowSpread: true,
    affectStocks: false,
    minimumCores: 1,
  }]

  farm.schedule(ns, hackBatch)

  return farm
}
