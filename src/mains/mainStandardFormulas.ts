import { NS } from "@ns";
import { TerminalUI } from "@/TerminalUI/TerminalUI"
import { Network } from "@/hacking/network";
import { Capabilities, upgradeCapabilities } from "@/capabilities/Capabilities";
import { quickHack } from "@/hacking/farmingAlgos/quickHack";

export async function mainStandardFormulas(ns: NS): Promise<void> {
  const capability = Capabilities.StandardFormulas

  const network = new Network(ns)

  const ui = new TerminalUI(ns, capability)
  ui.update()

  ns.atExit(() => {
    ui.close()
  })

  while (!upgradeCapabilities(ns, capability)) {
    // TODO: attemptPserverUpgrade(ns, network)

    if (!network.upToDate) {
      network.refresh()
    }
    // TODO
    const tutorialFarm = quickHack(ns, network, "sigma-cosmetics")
    ui.state.currentHackingTarget = tutorialFarm.target
    ui.update()
    await tutorialFarm.run(ns)
  }
}
