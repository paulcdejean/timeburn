import { NS } from "@ns";
import { TerminalUI } from "@/TerminalUI/TerminalUI"
import { Network } from "@/hacking/network";
import { Capabilities, upgradeCapabilities } from "@/capabilities/Capabilities";
import { Farm } from "@/hacking/Farm";
import { HWGW } from "@/hacking/farmingAlgos/HWGW";
import { attemptPserverUpgrade } from "@/hacking/pserver/attemptPserverUpgrade";

export async function mainStandardFormulas(ns: NS): Promise<void> {
  const capability = Capabilities.StandardFormulas

  const network = new Network(ns)

  const ui = new TerminalUI(ns, capability)
  ui.update()

  ns.atExit(() => {
    ui.close()
  })

  while (!upgradeCapabilities(ns, capability)) {
    attemptPserverUpgrade(ns, network)

    if (!network.upToDate) {
      network.refresh()
    }
    // TODO
    const target = "joesguns"
    const farm = new Farm(ns, network, ns.getServer(target))
    HWGW(farm)
    ui.state.currentHackingTarget = farm.target
    ui.update()
    ns.tprint("Starting farm")
    await farm.run()
  }
}
