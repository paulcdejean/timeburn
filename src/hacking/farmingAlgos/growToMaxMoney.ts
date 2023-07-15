import { Capabilities } from "@/capabilities/Capabilities";
import { Farm } from "@/hacking/Farm";
import type { Batch } from "../types";
import { CompletedProgramName, home } from "@/constants";
import type { Server } from "@ns";

export function growToMaxMoney(farm: Farm) : Farm {
  const player = farm.ns.getPlayer()
  // This will only land at min security, so if we have formulas we calculate based off min security.
  if(farm.ns.fileExists(CompletedProgramName.formulas, home)) {
    const minSecurityTarget : Server = structuredClone(farm.target)
    minSecurityTarget.hackDifficulty = minSecurityTarget.minDifficulty

    for (let currentCores = farm.maxCores; currentCores >= 1; currentCores/=2) {
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
      const growPercentage = farm.ns.formulas.hacking.growPercent(minSecurityTarget, growThreads, player, currentCores)
      minSecurityTarget.moneyAvailable = Math.min((minSecurityTarget.moneyAvailable ?? Infinity) * growPercentage, minSecurityTarget.moneyMax ?? 0)
    }
  } else {
    // TODO
  }
  return farm
}
