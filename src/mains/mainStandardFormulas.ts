import { NS } from "@ns";
import { TerminalUI } from "@/TerminalUI/TerminalUI"
import { Network } from "@/hacking/network";
import { Capabilities, upgradeCapabilities } from "@/capabilities/Capabilities";
import { onlyHack } from "@/hacking/farmingAlgos/onlyHack";
import { Farm } from "@/hacking/Farm";

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
    const tutorialTarget = "sigma-cosmetics"
    const tutorialFarm = new Farm(ns, network, ns.getServer(tutorialTarget), ns.getHackTime(tutorialTarget))
    onlyHack(tutorialFarm)
    ui.state.currentHackingTarget = tutorialFarm.target
    ui.update()
    await tutorialFarm.run()
  }
}
