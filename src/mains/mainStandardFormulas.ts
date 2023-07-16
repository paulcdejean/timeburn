import { NS } from "@ns";
import { TerminalUI } from "@/TerminalUI/TerminalUI"
import { Network } from "@/hacking/network";
import { Capabilities, upgradeCapabilities } from "@/capabilities/Capabilities";
import { Farm } from "@/hacking/Farm";
import { HWGW } from "@/hacking/farmingAlgos/HWGW";
import { attemptPserverUpgrade } from "@/hacking/pserver/attemptPserverUpgrade";
import { milisecondsInASecond } from "@/constants";

export async function mainStandardFormulas(ns: NS): Promise<void> {
  const capability = Capabilities.StandardFormulas

  const network = new Network(ns)

  const ui = new TerminalUI(ns, capability)
  ui.update()

  ns.atExit(() => {
    ui.close()
  })
  await ns.asleep(2000)

  while (!upgradeCapabilities(ns, capability)) {
    attemptPserverUpgrade(ns, network)

    if (!network.upToDate) {
      network.refresh()
    }
    // TODO
    const target = "rho-construction"
    const farm = new Farm(ns, network, ns.getServer(target))
    ns.tprint(performance.now())
    HWGW(farm)
    ns.tprint(performance.now())
    await ns.asleep(0)
    ui.state.currentHackingTarget = farm.target
    ui.update()
    ns.tprint("Starting farm")
    const startTime = performance.now()
    const startingMoney = ns.getMoneySources().sinceInstall.hacking
    await farm.run()
    const income = ns.getMoneySources().sinceInstall.hacking - startingMoney
    const incomeString = ns.formatNumber(income)
    const endTime = performance.now()
    const duration = ns.tFormat(endTime - startTime)
    const incomePerSecond = ns.formatNumber(income / ((endTime - startTime) / milisecondsInASecond))
    ns.tprint(`Farmed $${incomeString} in ${duration} for $${incomePerSecond} per second`)
  }
}
