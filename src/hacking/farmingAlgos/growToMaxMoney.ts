import { Capabilities } from "@/capabilities/Capabilities";
import { Farm } from "@/hacking/Farm";
import type { Batch } from "../types";

export function growToMaxMoney(farm: Farm) : Farm {
  const player = farm.ns.getPlayer()
  const minSecurityTarget = structuredClone(farm.target)
  minSecurityTarget.hackDifficulty = minSecurityTarget.minDifficulty

  while (minSecurityTarget.moneyAvailable < minSecurityTarget.moneyMax) {
    for (let currentCores = farm.maxCores; currentCores >= 1; currentCores--) {
      let growThreads = Math.ceil(farm.ns.formulas.hacking.growThreads(minSecurityTarget, player, Infinity, currentCores))

      for(growThreads; growThreads > 0; growThreads--) {
        const growSecurityIncrease = farm.ns.growthAnalyzeSecurity(growThreads, farm.target.hostname, currentCores)
        const weakenThreads = Math.ceil(growSecurityIncrease / farm.ns.weakenAnalyze(1, currentCores))
        const batch : Batch = [
          {
            capability: Capabilities.Grow,
            threads: growThreads,
            allowSpread: false,
            affectStocks: false,
            minimumCores: currentCores,
          },
          {
            capability: Capabilities.Weaken,
            threads: weakenThreads,
            allowSpread: true,
            affectStocks: false,
            minimumCores: currentCores,
          },
        ]
        if(farm.schedule(batch)) {
          break
        }
      }
      if (growThreads > 0) {
        const growPercentage = farm.ns.formulas.hacking.growPercent(minSecurityTarget, growThreads, player, currentCores)
        minSecurityTarget.moneyAvailable = Math.min(minSecurityTarget.moneyAvailable * growPercentage, minSecurityTarget.moneyMax)
      }
    }
  }

  return farm
}
