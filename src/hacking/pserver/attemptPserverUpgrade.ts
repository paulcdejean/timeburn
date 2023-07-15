import { home } from "@/constants";
import { Network } from "@/hacking/network";
import { NS } from "@ns";

export function attemptPserverUpgrade(ns: NS, network: Network) {
  const minimumCost = 1e9

  let ram = ns.getPurchasedServerMaxRam()
  let cost = ns.getPurchasedServerCost(ram)

  while (cost > minimumCost) {
    if (ns.getServerMoneyAvailable(home) >= cost) {
      ns.purchaseServer("testinglol", ram)
      network.upToDate = false
      return
    } else {
      ram /= 2
      cost = ns.getPurchasedServerCost(ram)
    }
  }
}
