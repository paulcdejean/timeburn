import { Capabilities, getCapabilityRam } from "@/capabilities/Capabilities"
import { CompletedProgramName, home, homeReservedRam, thisScript } from "@/constants"
import { Network } from "@/hacking/network"
import { BasicHGWOptions, NS, RunOptions, Server } from "@ns"
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
  readonly target : Required<Server>
  private weakenTime : number
  private growTime : number
  private hackTime : number
  readonly ns : NS
  readonly maxCores : number
  private minimumPort = 20000

  constructor(ns: NS, network: Network, target: Server, cycleTime?: number) {
    if(target.backdoorInstalled === undefined
      || target.baseDifficulty === undefined
      || target.hackDifficulty === undefined
      || target.minDifficulty === undefined
      || target.moneyAvailable === undefined
      || target.moneyMax === undefined
      || target.numOpenPortsRequired === undefined
      || target.openPortCount === undefined
      || target.requiredHackingSkill === undefined
      || target.serverGrowth === undefined) {
        throw new Error(`Target ${target.hostname} is not a valid farming target`)
    } else {
      this.target = {
        hostname: target.hostname,
        ip: target.ip,
        sshPortOpen: target.sshPortOpen,
        ftpPortOpen: target.ftpPortOpen,
        smtpPortOpen: target.smtpPortOpen,
        httpPortOpen: target.httpPortOpen,
        sqlPortOpen: target.sqlPortOpen,
        hasAdminRights: target.hasAdminRights,
        cpuCores: target.cpuCores,
        isConnectedTo: target.isConnectedTo,
        ramUsed: target.ramUsed,
        maxRam: target.maxRam,
        organizationName: target.organizationName,
        purchasedByPlayer: target.purchasedByPlayer,
        backdoorInstalled: target.backdoorInstalled,
        baseDifficulty: target.baseDifficulty,
        hackDifficulty: target.hackDifficulty,
        minDifficulty: target.minDifficulty,
        moneyAvailable: target.moneyAvailable,
        moneyMax: target.moneyMax,
        numOpenPortsRequired: target.numOpenPortsRequired,
        openPortCount: target.openPortCount,
        requiredHackingSkill: target.requiredHackingSkill,
        serverGrowth: target.serverGrowth,
      }
    }

    this.availableRam = new Map()
    this.ns = ns

    const player = ns.getPlayer()

    // TODO: Zanny hacknet logic lol
    this.maxCores = ns.getServer(home).cpuCores

    if (ns.fileExists(CompletedProgramName.formulas, home)) {
      this.weakenTime = ns.formulas.hacking.weakenTime(this.target, player)
      this.growTime = ns.formulas.hacking.growTime(this.target, player)
      this.hackTime = ns.formulas.hacking.hackTime(this.target, player)
    } else {
      this.weakenTime = ns.getWeakenTime(this.target.hostname)
      this.growTime = ns.getGrowTime(this.target.hostname)
      this.hackTime = ns.getHackTime(this.target.hostname)
    }

    if(cycleTime === undefined) {
      this.cycleTime = this.weakenTime
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

  schedule(batch: Batch) : boolean {
    const simulatedAvailableRam = new Map(this.availableRam)
    const simulatedPlan : ExecSpawn[] = []

    for (const operation of batch) {
      const operationScriptRam = getCapabilityRam(this.ns, operation.capability)
      let successfulPlan = false

      let currentThreads = operation.threads

      let additionalMsec = 0
      if(operation.capability === Capabilities.Hack) {
        additionalMsec = Math.max(this.cycleTime - this.hackTime, 0)
      } else if(operation.capability === Capabilities.Grow) {
        additionalMsec = Math.max(this.cycleTime - this.growTime, 0)
      } else if(operation.capability === Capabilities.Weaken) {
        additionalMsec = Math.max(this.cycleTime - this.weakenTime, 0)
      }
      
      for (const [server, simulatedRam] of simulatedAvailableRam) {
        if (operation.minimumCores > this.ns.getServer(server).cpuCores) {
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

    this.availableRam = new Map(simulatedAvailableRam)
    this.plan.push(...simulatedPlan)
    return true
  }

  private runSingle(spawn: ExecSpawn, runOptions: RunOptions, port: number) {
    const pid = this.ns.exec(thisScript, spawn.host, runOptions,
      spawn.capability,
      this.target.hostname,
      spawn.hgwOptions.additionalMsec ?? 0,
      spawn.hgwOptions.stock ?? false,
      spawn.hgwOptions.threads ?? 1,
      port
    )
    if (pid === 0) {
      this.ns.tprint(`ERROR: Exec in farm run failed on host ${spawn.host}`)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  run() : Promise<(true | void)[]> {
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    const promiseArray : Promise<true | void>[] = [this.ns.asleep(this.cycleTime)]

    this.ns.tprint(`DEBUG: Running farm with ${this.plan.length} scripts`)

    let port = this.minimumPort
    for(const spawn of this.plan) {
      const runOptions: RunOptions = {
        preventDuplicates: false,
        temporary: true,
        threads: spawn.threads,
        ramOverride: spawn.ram
      }

      setTimeout(this.runSingle.bind(this), 0, spawn, runOptions, port)
      promiseArray.push(this.ns.getPortHandle(port).nextWrite())
      port++
    }

    return Promise.all(promiseArray)
  }
}
