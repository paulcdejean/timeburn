import { Capabilities } from "@/capabilities/Capabilities"
import type { NS } from "@ns";
import { Network } from "@/hacking/network"
import { prepSingle } from "@/hacking/farmingAlgos/prepSingle";
import { basicHWGW } from "@/hacking/farmingAlgos/basicHWGW";
import { Farm } from "@/hacking/Farm";
import { foodnstuff, noodles } from "@/constants";
import { noodlesHGW } from "./noodlesHGW";
import { quickHack } from "./quickHack";

type FarmingAlgo = (ns: NS, network: Network, target: string) => Farm

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function metaFarming(ns: NS, capabilities: Capabilities, target: string) : FarmingAlgo {
  if (target === foodnstuff) {
    return quickHack
  }

  if(ns.getServerMinSecurityLevel(target) !== ns.getServerSecurityLevel(target) ||
  ns.getServerMoneyAvailable(target) !== ns.getServerMaxMoney(target)) {
    ns.tprint(`Farming target ${target} with algorithm "prepSingle"`)
    return prepSingle
  } else {
    if (target === noodles) {
      ns.tprint(`Farming target ${target} with algorithm "noodlesHGW"`)
      return noodlesHGW
    } else {
      ns.tprint(`Farming target ${target} with algorithm "basicHWGW"`)
      return basicHWGW
    }
  }
}