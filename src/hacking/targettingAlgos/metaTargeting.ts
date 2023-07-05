import { Capabilities } from "@/capabilities/Capabilities"
import type { NS } from "@ns";
import { Network } from "@/hacking/network"
import { fastestResults } from "@/hacking/targettingAlgos/heuristics";

type TargettingAlgo = (ns: NS, network: Network) => string

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function metaTargeting(ns: NS, capabilities: Capabilities) : TargettingAlgo {
  ns.tprint("Using targetting algorithm fastestResults")
  return fastestResults
}
