import { NS } from "@ns";
import { TerminalUI } from "@/TerminalUI/TerminalUI"
import { Network } from "@/hacking/network";
import { Capabilities, upgradeCapabilities } from "@/capabilities/Capabilities";
import { Farm } from "@/hacking/Farm";
import { HWGW } from "@/hacking/farmingAlgos/HWGW";

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
    const target = "harakiri-sushi"
    const farm = new Farm(ns, network, ns.getServer(target))
    HWGW(farm)
    ui.state.currentHackingTarget = farm.target
    ui.update()
    await farm.run()
  }
}
