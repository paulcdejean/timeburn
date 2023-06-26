import { Capabilities } from "@/Capabilities"
import type { NS } from "@ns";
import { Network } from "@/network"
import { fastestResults } from "@/targettingAlgos/fastestResults"
import { largestUnderThreeMinutes } from "./largestUnderThreeMinutes";

type TargettingAlgo = (ns: NS, network: Network) => string

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function metaTargetting(ns: NS, capabilities: Capabilities) : TargettingAlgo {
  if (ns.getTimeSinceLastAug() < 300000) {
    return fastestResults
  } else {
    return largestUnderThreeMinutes
  }
}
