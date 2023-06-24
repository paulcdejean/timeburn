import { Network } from "@/network";
import { growthAnalyzeSecurity, hackAnalyzeSecurity, weakenAnalyze } from "@/utils";
import { NS } from "@ns";

class Batch {
  public hack = 0
  public firstWeaken = 0
  public grow = 0
  public secondWeaken = 0
}


// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function startingHWGW(ns: NS, network: Network, target: string) : Promise<number> {
  
  ns.tprint(calculateBatchSize(ns, target))

  // An example of how to return a correct value, maybe useful later
  return new Promise<number>((resolve) => {
    resolve(5)
  })
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function calculateBatchSize(ns: NS, target: string) : Batch {
  const batch = new Batch()

  const hackRate = ns.hackAnalyze(target)
  // The amount of growing required to get back to max money after a single successful hack.
  const requiredGrowthRate = 1 / (1 - hackRate)
  // The number of threads required to get back to max money after a single successful hack.
  const growThreadsPerHack = ns.growthAnalyze("n00dles", requiredGrowthRate)

  if (growThreadsPerHack < 1) {
    // One grow, multiple hacks
    batch.grow = 1
    batch.hack = Math.floor(1 / growThreadsPerHack)
  } else {
    // One hack, multiple grows
    batch.hack = 1
    batch.grow = Math.floor(growThreadsPerHack)
  }

  const hackSecurityGain = hackAnalyzeSecurity(ns, batch.hack, target)
  const growthSecurityGain = growthAnalyzeSecurity(ns, batch.grow, target)

  ns.tprint("hackSecurityGain = ", hackSecurityGain)
  ns.tprint("growthSecurityGain = ", growthSecurityGain)
  ns.tprint("Single weaken = ", weakenAnalyze(ns, 1))

  batch.firstWeaken = Math.ceil(hackSecurityGain / weakenAnalyze(ns, 1))
  batch.secondWeaken = Math.ceil(growthSecurityGain / weakenAnalyze(ns, 1))

  return batch
}
