import { Capabilities } from "@/capabilities/Capabilities";
import { NS } from "@ns";
import { tutorialTargetting } from "./targettingAlgos/tutorialTargetting";
import { Network } from "./network";
import { quickHack } from "./farmingAlgos/quickHack";
import { Farm } from "./Farm";

export function pickFarm(ns: NS, network: Network, capability: Capabilities) : Farm {
  switch(capability) {
    default: {
      // Default to the tutorial, to keep typescript happy, and for the lowest chance of RAM errors.
      const target = tutorialTargetting(ns, network)
      return quickHack(ns, network, target)
    } 
  }
}
