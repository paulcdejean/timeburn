import { Capabilities } from "@/capabilities/Capabilities";
import { Farm } from "@/hacking/Farm";
import type { Batch } from "../types";

export function weakenToMinSecurity(farm: Farm) : Farm {
  const minSecurity = farm.target.minDifficulty ?? 1
  let currentSecurity = farm.target.hackDifficulty ?? 1

  for (let currentCores = farm.maxCores; currentCores >= 1; currentCores/=2) {
    if (currentSecurity > minSecurity) {
      const weakenPerThread = farm.ns.weakenAnalyze(1, currentCores)
      let weakenThreads = Math.ceil((currentSecurity - minSecurity) / weakenPerThread)
      for (weakenThreads; weakenThreads > 0; weakenThreads--) {
        const weakenBatch : Batch = [{
          capability: Capabilities.Weaken,
          threads: weakenThreads,
          allowSpread: true,
          affectStocks: false,
          minimumCores: currentCores,
        }]
        if(farm.schedule(weakenBatch)) {
          break
        }
      }
      currentSecurity -= farm.ns.weakenAnalyze(weakenThreads, currentCores)
    }
  }
  return farm
}
