import type { NS } from "@ns"

import { refreshNetwork } from '@/refreshNetwork.ts'
import { Capabilities } from "@/Capabilities"
import { fastestResults } from "@/targettingAlgos/fastestResults.ts"

export async function main(ns: NS): Promise<void> {
  const network = refreshNetwork(ns, Capabilities.Basic)
  
  ns.tprint(fastestResults(ns, network))
}
