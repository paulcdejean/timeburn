import { NS } from "@ns";
import * as basicFunctions from "@/staticRam"
import { CompletedProgramName, baseRamCost, home, thisScript } from "@/constants";
import { standardFunctions } from "./standardFunctions";


// It's important that this is a string enum, because we want the args passed to be human readable for QoL
export const enum Capabilities {
  Tutorial = "tutorial",
  Hack = "hack",
  Weaken = "weaken",
  Grow = "grow",
  Standard = "standard",
  StandardFormulas = "standard+formulas",
}

const capabilityFunctions = {
  [Capabilities.Tutorial]: Object.keys(basicFunctions), // 8GB of RAM
  [Capabilities.Hack]: ["hack"], // Hack farmer
  [Capabilities.Grow]: ["grow"], // Grow farmer
  [Capabilities.Weaken]: ["weaken"], // Weaken farmer
  [Capabilities.Standard]: standardFunctions, // 32GB of RAM
  [Capabilities.StandardFormulas]: standardFunctions, // 32GB of RAM and Formulas
}

export function getCapabilityRam(ns: NS, capability: Capabilities) : number {
  let capabilityRam = baseRamCost
  capabilityFunctions[capability].forEach(functionName => {
   capabilityRam = capabilityRam + ns.getFunctionRamCost(functionName)
  })
  return capabilityRam
}

export function upgradeCapabilities(ns: NS, currentCapability: Capabilities) : boolean {
  if (currentCapability === Capabilities.Tutorial && ns.getServerMaxRam(home) >= 32) {
    if (!upgradeCapabilities(ns, Capabilities.Standard)) {
      ns.tprint(`Upgrading to capability standard with ${getCapabilityRam(ns, Capabilities.Standard)}GB RAM`)
      ns.exec(thisScript, home, {ramOverride: getCapabilityRam(ns, Capabilities.Standard)}, Capabilities.Standard)
    }
    return true
  } else if (currentCapability === Capabilities.Standard && ns.fileExists(CompletedProgramName.formulas, home)) {
    if (!upgradeCapabilities(ns, Capabilities.StandardFormulas)) {
      ns.tprint(`Upgrading to capability standard+formulas with ${getCapabilityRam(ns, Capabilities.StandardFormulas)}GB RAM`)
      ns.exec(thisScript, home, {ramOverride: getCapabilityRam(ns, Capabilities.StandardFormulas)}, Capabilities.StandardFormulas)
    }
    return true
  }
  return false
}
