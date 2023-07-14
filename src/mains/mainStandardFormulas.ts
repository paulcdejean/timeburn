import { NS } from "@ns";
import { TerminalUI } from "@/TerminalUI/TerminalUI"
import { Network } from "@/hacking/network";
import { Capabilities, upgradeCapabilities } from "@/capabilities/Capabilities";
import { pickFarm } from "@/hacking/pickFarm";

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
    const farm = pickFarm(ns, network, capability)
    ui.state.currentHackingTarget = farm.target
    ui.update()
    await farm.run(ns)
  }
}
