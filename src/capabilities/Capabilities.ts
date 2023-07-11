import { NS } from "@ns";
import * as basicFunctions from "@/staticRam"
import { baseRamCost } from "@/constants";


// It's important that this is a string enum, because we want the args passed to be human readable for QoL
export const enum Capabilities {
  Tutorial = "tutorial",
  Hack = "hack",
  Weaken = "weaken",
  Grow = "grow"
}

const capabilityFunctions = {
  [Capabilities.Tutorial]: Object.keys(basicFunctions), // 8GB of RAM
  [Capabilities.Hack]: ["hack"], // Hack farmer
  [Capabilities.Grow]: ["grow"], // Grow farmer
  [Capabilities.Weaken]: ["weaken"], // Weaken farmer
}

export function getCapabilityRam(ns: NS, capability: Capabilities) : number {
  let capabilityRam = baseRamCost
  capabilityFunctions[capability].forEach(functionName => {
   capabilityRam = capabilityRam + ns.getFunctionRamCost(functionName)
  })
  return capabilityRam
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function upgradeCapabilities(ns: NS, currentCapability: Capabilities) : boolean {
  return false

  // TODO: actually allow upgrading of capabilities
}
