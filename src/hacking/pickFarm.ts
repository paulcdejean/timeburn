import { Capabilities } from "@/capabilities/Capabilities";
import { NS } from "@ns";
import { tutorialTargetting } from "./targettingAlgos/tutorialTargetting";
import { Network } from "./network";
import { Farm } from "./Farm";
import { standardFormulasTargetting } from "./targettingAlgos/standardFormulasTargetting";

export function pickFarm(ns: NS, network: Network, capability: Capabilities) : Farm {
  switch(capability) {
    default: {
      // Default to the tutorial, to keep typescript happy, and for the lowest chance of RAM errors.
      return tutorialTargetting(ns, network)
    }
    case Capabilities.StandardFormulas: {
      return standardFormulasTargetting(ns, network)
    }
  }
}
