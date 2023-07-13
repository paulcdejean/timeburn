import { Capabilities, getCapabilityRam } from "@/capabilities/Capabilities"
import { home, homeReservedRam, thisScript } from "@/constants"
import { Network } from "@/hacking/network"
import { BasicHGWOptions, NS, RunOptions } from "@ns"
import { Batch } from "./types"

interface ExecSpawn {
  capability : Capabilities
  threads : number
  host : string
  hgwOptions : BasicHGWOptions
  ram : number
}

export class Farm {
  private availableRam : Record<string, number>
  private plan : ExecSpawn[] = []
  private cycleTime : number
  private target : string

  getTarget() {
    return this.target
  }

  constructor(ns: NS, network: Network, target: string, cycleTime?: number) {
    this.availableRam = {}
    this.target = target
    if(cycleTime === undefined) {
      this.cycleTime = ns.getWeakenTime(this.target)
    } else {
      this.cycleTime = cycleTime
    }
    for (const server in network.servers) {
      if (network.servers[server].hasAdminRights) {
        if (server == home) {
          this.availableRam[server] = Math.max(network.servers[server].maxRam - homeReservedRam, 0)
        } else {
          this.availableRam[server] = network.servers[server].maxRam
        }
      }
    }
  }

  schedule(ns: NS, batch: Batch) : boolean {
    const simulatedAvailableRam = Object.assign({}, this.availableRam)
    const simulatedPlan : ExecSpawn[] = []

    const weakenTime = ns.getWeakenTime(this.target)
    const hackTime = ns.getHackTime(this.target)
    const growTime = ns.getGrowTime(this.target)

    for (const operation of batch) {
      const operationScriptRam = getCapabilityRam(ns, operation.capability)
      let successfulPlan = false

      let currentThreads = operation.threads

      let additionalMsec = 0
      if(operation.capability === Capabilities.Hack) {
        additionalMsec = Math.max(this.cycleTime - hackTime, 0)
      } else if(operation.capability === Capabilities.Grow) {
        additionalMsec = Math.max(this.cycleTime - growTime, 0)
      } else if(operation.capability === Capabilities.Weaken) {
        additionalMsec = Math.max(this.cycleTime - weakenTime, 0)
      }
      
      
      for (const server in simulatedAvailableRam) {
        if (simulatedAvailableRam[server] >= operationScriptRam * currentThreads) {
          // Attempt to put the operation on a single server
          const hgwOptions : BasicHGWOptions = {
            threads: currentThreads,
            stock: false,
            additionalMsec: additionalMsec
          }

          simulatedPlan.push({
            capability: operation.capability,
            threads: currentThreads,
            host: server,
            hgwOptions: hgwOptions,
            ram: operationScriptRam,
          })
          simulatedAvailableRam[server] = simulatedAvailableRam[server] - (operationScriptRam * currentThreads)
          successfulPlan = true
          break
        } else if (operation.allowSpread) {
          const attemptingThreads =  Math.floor(simulatedAvailableRam[server] / operationScriptRam)
          if (attemptingThreads > 0 ) {
            const hgwOptions : BasicHGWOptions = {
              threads: attemptingThreads,
              stock: false,
              additionalMsec: additionalMsec
            }

            simulatedPlan.push({
              capability: operation.capability,
              threads: attemptingThreads,
              host: server,
              hgwOptions: hgwOptions,
              ram: operationScriptRam,
            })
          }
          simulatedAvailableRam[server] = simulatedAvailableRam[server] - (operationScriptRam * attemptingThreads)
          currentThreads = currentThreads - attemptingThreads
        }
      }

      if(!successfulPlan && operation.threads !== Infinity) {
        return false
      }
    }

    Object.assign(this.availableRam, simulatedAvailableRam)
    this.plan.push(...simulatedPlan)
    return true
  }

  run(ns: NS) : Promise<true> {
    for(const spawn in this.plan) {
      const runOptions: RunOptions = {
        preventDuplicates: false,
        temporary: true,
        threads: this.plan[spawn].threads,
        ramOverride: this.plan[spawn].ram
      }

      const pid = ns.exec(thisScript, this.plan[spawn].host, runOptions,
        this.plan[spawn].capability,
        this.target,
        this.plan[spawn].hgwOptions.additionalMsec ?? 0,
        this.plan[spawn].hgwOptions.stock ?? false,
        this.plan[spawn].hgwOptions.threads ?? 1
      )

      if (pid === 0) {
        ns.tprint(`ERROR: Exec in farm run failed on host ${this.plan[spawn].host}`)
        return ns.asleep(0)
      }
    }

    return ns.asleep(this.cycleTime + 500)
  }
}
