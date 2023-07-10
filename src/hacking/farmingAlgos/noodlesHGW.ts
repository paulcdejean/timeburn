import { Capabilities } from "@/capabilities/Capabilities";
import { Farm } from "@/hacking/Farm";
import { Network } from "@/hacking/network";
import { NS } from "@ns";

export function noodlesHGW(ns: NS, network: Network, target: string) : Farm {
  const noodlesFuzzFactor = 1 // Totally made up heuristic...

  ns.tprint(`Running farming algorithm "noodlesHGW" on target ${target}`)
  const farm = new Farm(ns, network, target)

  const hackRate = ns.hackAnalyze(target)
  const requiredGrowthRate = 1 / (1 - hackRate)
  const growThreadsPerHack = ns.growthAnalyze(target, requiredGrowthRate)

  let hackThreads = 1
  let growThreads = 1

  if (growThreadsPerHack < 1) {
    // One grow, multiple hacks
    hackThreads = Math.floor(1 / growThreadsPerHack) - noodlesFuzzFactor
  } else {
    // One hack, multiple grows
    growThreads = Math.ceil(growThreadsPerHack)
  }

  while(hackThreads > 0) {
    const hackSecurityGain = ns.hackAnalyzeSecurity (hackThreads, target)
    const growthSecurityGain = ns.growthAnalyzeSecurity(growThreads, target)
    const totalSecurityGain = hackSecurityGain + growthSecurityGain
    const weakenThreads = Math.ceil(totalSecurityGain / ns.weakenAnalyze(1))
    const batch = [
      {capability: Capabilities.Hack, threads: hackThreads, allowSpread: true},
      {capability: Capabilities.Grow, threads: growThreads, allowSpread: true},
      {capability: Capabilities.Weaken, threads: weakenThreads, allowSpread: true},
    ]
    if(!farm.schedule(ns, batch)) {
      hackThreads = hackThreads - 1
    }
  }

  farm.finalWeaken(ns)
  return farm
}
