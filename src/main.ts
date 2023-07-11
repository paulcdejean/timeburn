import type { NS } from "@ns"

import { Capabilities, upgradeCapabilities } from "@/capabilities/Capabilities"

import { mainTutorial } from "@/mains/mainTutorial"
import * as basicFunctions from "@/staticRam"
import { mainHack } from "@/mains/mainHack"
import { mainGrow } from "@/mains/mainGrow"
import { mainWeaken } from "@/mains/mainWeaken"

export async function main(ns: NS): Promise<void> {
  // Prevents spam, forgive the magic word here.
  ns.disableLog("ALL")

  // This bit of code prevents tree shaking, which allows for static RAM to be correctly set.
  if(Object.keys(basicFunctions).length < 0) {
    throw new Error("This code is unreachable and is designed to be a noop!")
  }

  // Detect what capabilities the script was launched with.
  let capability = Capabilities.Tutorial
  if(ns.args.length > 0) {
    capability = ns.args[0] as Capabilities
  }

  if(upgradeCapabilities(ns, capability)) {
    ns.exit()
  }

  // If capabilities are not upgraded, then get to the main bulk of the code.
  switch(capability) {
    case Capabilities.Tutorial: {
      await mainTutorial(ns)
      return
    }
    case Capabilities.Hack: {
      await mainHack(ns)
      return
    }
    case Capabilities.Grow: {
      await mainGrow(ns)
      return
    }
    case Capabilities.Weaken: {
      await mainWeaken(ns)
      return
    }
  }
}
