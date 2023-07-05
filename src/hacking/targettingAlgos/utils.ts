import { Farm } from "@/hacking/Farm";
import { prepSingleGrowOnly } from "@/hacking/farmingAlgos/prepSingle";
import { Network } from "@/hacking/network";
import { weakenAnalyze } from "@/hacking/utils";
import { NS, Server } from "@ns";

export function getWeakenCycles(ns: NS, network: Network, target: string) : number {
  const requiredWeakenAmount = ns.getServerSecurityLevel(target) - ns.getServerMinSecurityLevel(target)
  const requiredWeakenThreads = Math.ceil(requiredWeakenAmount / weakenAnalyze(ns, 1))
  const farm = new Farm(ns, network, target)
  const weakenThreads = farm.finalWeaken(ns)
  const weakenCycles = Math.ceil(requiredWeakenThreads / weakenThreads)
  return weakenCycles
}

export function getGrowCycles(ns: NS, network: Network, target: string) : number {
  const currentMoney = ns.getServerMoneyAvailable(target)
  const maxMoney = ns.getServerMaxMoney(target)
  const requiredGrowAmount = maxMoney / currentMoney
  const requiredGrowThreads = Math.ceil(ns.growthAnalyze(target, requiredGrowAmount))

  if (requiredGrowThreads === 0) {
    return 0
  }

  const farm = prepSingleGrowOnly(ns, network, target)
  const growThreads = farm.getStats(ns).growThreads


  return Math.ceil(requiredGrowThreads / growThreads)
}

export function getPrepCycles(ns: NS, network: Network, target: string) : number {
  return getWeakenCycles(ns, network, target) + getGrowCycles(ns, network, target)
}

export function getPrepTime(ns: NS, network: Network, target: string) : number {
  const prepCycles = getPrepCycles(ns, network, target)
  const prepTime = ns.getWeakenTime(target)
  return prepCycles * prepTime
}

export function canFarm(ns: NS, target: Server) : boolean {
  if ((target.moneyMax ?? 0) > 0 &&
    target.hasAdminRights &&
    (target.requiredHackingSkill ?? Infinity) <= ns.getHackingLevel()) {
    return true
  } else {
    return false
  }
}