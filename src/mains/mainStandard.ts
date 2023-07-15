import { NS } from "@ns";
import { TerminalUI } from "@/TerminalUI/TerminalUI"
import { Network } from "@/hacking/network";
import { Capabilities, upgradeCapabilities } from "@/capabilities/Capabilities";
import { onlyHack } from "@/hacking/farmingAlgos/onlyHack";
import { Farm } from "@/hacking/Farm";

export async function mainStandard(ns: NS): Promise<void> {
  const capability = Capabilities.Standard

  const network = new Network(ns)

  const ui = new TerminalUI(ns, capability)
  ui.update()

  ns.atExit(() => {
    ui.close()
  })

  while (!upgradeCapabilities(ns, capability)) {
    if (!network.upToDate) {
      network.refresh()
    }
    
    // Designed to get 200k as fast as possible
    // Decided implemented HWGW without formulas wasn't worth
    const target = "foodnstuff"
    const tutorialFarm = new Farm(ns, network, ns.getServer(target), ns.getHackTime(target))
    onlyHack(tutorialFarm)
    ui.state.currentHackingTarget = tutorialFarm.target
    ui.update()
    await tutorialFarm.run()
  }
}
