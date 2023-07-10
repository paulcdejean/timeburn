import { Capabilities } from "@/capabilities/Capabilities";
import { Farm } from "@/hacking/Farm";
import { Network } from "@/hacking/network";
import { NS } from "@ns";

export function basicHWGW(ns: NS, network: Network, target: string) : Farm {
  ns.tprint(`Running farming algorithm "basicHWGW" on target ${target}`)
  const farm = new Farm(ns, network, target)

  const hackRate = ns.hackAnalyze(target)
  const requiredGrowthRate = 1 / (1 - hackRate)
  const growThreadsPerHack = ns.growthAnalyze(target, requiredGrowthRate)

  let hackThreads = 1
  let growThreads = 1

  if (growThreadsPerHack < 1) {
    // One grow, multiple hacks
    hackThreads = Math.floor(1 / growThreadsPerHack)
  } else {
    // One hack, multiple grows
    growThreads = Math.ceil(growThreadsPerHack)
  }

  while(hackThreads > 0) {
    const hackSecurityGain = ns.hackAnalyzeSecurity (hackThreads, target)
    const growthSecurityGain = ns.growthAnalyzeSecurity(growThreads, target)
    const firstWeakenThreads = Math.ceil(hackSecurityGain / ns.weakenAnalyze(1))
    const secondWeakenThreads =  Math.ceil(growthSecurityGain / ns.weakenAnalyze(1))
    const batch = [
      {capability: Capabilities.Hack, threads: hackThreads, allowSpread: false},
      {capability: Capabilities.Weaken, threads: firstWeakenThreads, allowSpread: true},
      {capability: Capabilities.Grow, threads: growThreads, allowSpread: true},
      {capability: Capabilities.Weaken, threads: secondWeakenThreads, allowSpread: true},
    ]

    if(!farm.schedule(ns, batch)) {
      hackThreads = hackThreads - 1
    }
  }

  farm.finalWeaken(ns)
  return farm
}
