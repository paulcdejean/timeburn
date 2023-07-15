import { Farm } from "@/hacking/Farm";
import { weakenToMinSecurity } from "./weakenToMinSecurity";
import { growToMaxMoney } from "./growToMaxMoney";
import { onlyWeaken } from "./onlyWeaken";
import { NS, Server, Player } from "@ns";
import { Batch } from "../types";
import { Capabilities, getCapabilityRam } from "@/capabilities/Capabilities";

export function HWGW(farm: Farm) : Farm {
  weakenToMinSecurity(farm)
  growToMaxMoney(farm)

  const player = farm.ns.getPlayer()
  const preppedTarget = structuredClone(farm.target)
  preppedTarget.hackDifficulty = preppedTarget.minDifficulty
  preppedTarget.moneyAvailable = preppedTarget.moneyMax

  for (let currentCores = farm.maxCores; currentCores >= 1; currentCores/=2) {
    let highscore = 0
    let bestHackThreads = 0

    let hackThreads = Math.floor(1 / farm.ns.formulas.hacking.hackPercent(preppedTarget, player))
    for (hackThreads; hackThreads > 0; hackThreads--) {
      const batch = calculateBatch(farm.ns, hackThreads, player, preppedTarget, currentCores)
      const batchScore = scoreBatch(farm.ns, batch, preppedTarget, player)
      if (batchScore > highscore) {
        highscore = batchScore
        bestHackThreads = hackThreads
      }
    }

    let batch = calculateBatch(farm.ns, bestHackThreads, player, preppedTarget, currentCores)
    while(bestHackThreads > 0) {
      if (!farm.schedule(batch)) {
        bestHackThreads--
        batch = calculateBatch(farm.ns, bestHackThreads, player, preppedTarget, currentCores)
      }
    }
  }

  onlyWeaken(farm)
  return farm
}

function calculateBatch(ns: NS, hackThreads: number, player: Player, target: Required<Server>, cores: number) : Batch {
  const result : Batch = []
  const clonedTarget = structuredClone(target)

  result.push({
    capability: Capabilities.Hack,
    threads: hackThreads,
    allowSpread: false,
    affectStocks: false,
    minimumCores: 1,
  })

  clonedTarget.moneyAvailable -= clonedTarget.moneyAvailable * hackThreads * ns.formulas.hacking.hackPercent(clonedTarget, player)

  const hackSecurityGain = ns.hackAnalyzeSecurity(hackThreads, target.hostname)
  const firstWeakenThreads = Math.ceil(hackSecurityGain / ns.weakenAnalyze(1, cores))
  result.push({
    capability: Capabilities.Weaken,
    threads: firstWeakenThreads,
    allowSpread: true,
    affectStocks: false,
    minimumCores: cores,
  })

  const growThreads = ns.formulas.hacking.growThreads(clonedTarget, player, Infinity, cores)
  result.push({
    capability: Capabilities.Grow,
    threads: growThreads,
    allowSpread: false,
    affectStocks: false,
    minimumCores: cores,
  })

  const growSecurityGain = ns.growthAnalyzeSecurity(growThreads, undefined, cores)
  const secondWeakenThreads = Math.ceil(growSecurityGain / ns.weakenAnalyze(1, cores))
  result.push({
    capability: Capabilities.Weaken,
    threads: secondWeakenThreads,
    allowSpread: true,
    affectStocks: false,
    minimumCores: cores,
  })

  return result
}

function scoreBatch(ns: NS, batch: Batch, target: Required<Server>, player: Player) : number {
  let moneyHacked = 0
  let ramUsed = 0
  batch.forEach(operation => {
    ramUsed += (getCapabilityRam(ns, operation.capability) * operation.threads)
    if(operation.capability === Capabilities.Hack) {
      moneyHacked += (target.moneyAvailable * ns.formulas.hacking.hackPercent(target, player) * operation.threads)
    }
  })
  return moneyHacked / ramUsed
}
