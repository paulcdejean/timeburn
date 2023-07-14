import { Capabilities, getCapabilityRam } from "@/capabilities/Capabilities"
import { home, homeReservedRam, thisScript } from "@/constants"
import { Network } from "@/hacking/network"
import { BasicHGWOptions, NS, RunOptions } from "@ns"
import type { Batch } from "./types"

interface ExecSpawn {
  capability : Capabilities
  threads : number
  host : string
  hgwOptions : BasicHGWOptions
  ram : number
}

export class Farm {
  private availableRam : Map<string, number>
  private plan : ExecSpawn[] = []
  private cycleTime : number
  readonly target : string

  constructor(ns: NS, network: Network, target: string, cycleTime?: number) {
    this.availableRam = new Map()
    this.target = target
    if(cycleTime === undefined) {
      this.cycleTime = ns.getWeakenTime(this.target)
    } else {
      this.cycleTime = cycleTime
    }

    const networkServersSortedByRam = Array.from(network.servers.keys()).sort((lhs, rhs) => {
      return (network.servers.get(lhs)?.maxRam ?? 0) - (network.servers.get(rhs)?.maxRam ?? 0)
    })

    networkServersSortedByRam.forEach(server => {
      if (network.servers.get(server)?.hasAdminRights) {
        if (server === home) {
          this.availableRam.set(server, Math.max((network.servers.get(server)?.maxRam ?? 0) - homeReservedRam, 0))
        } else {
          this.availableRam.set(server, network.servers.get(server)?.maxRam ?? 0)
        }
      }
    })
  }

  schedule(ns: NS, batch: Batch) : boolean {
    const simulatedAvailableRam = new Map(this.availableRam)
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
      
      
      for (const [server, simulatedRam] of simulatedAvailableRam) {
        if (operation.minimumCores > ns.getServer(server).cpuCores) {
          continue
        }
        if (simulatedRam >= operationScriptRam * currentThreads) {
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
          simulatedAvailableRam.set(server, simulatedRam - (operationScriptRam * currentThreads))
          successfulPlan = true
          break
        } else if (operation.allowSpread) {
          const attemptingThreads =  Math.floor(simulatedRam / operationScriptRam)
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
          simulatedAvailableRam.set(server, simulatedRam - (operationScriptRam * attemptingThreads))
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
