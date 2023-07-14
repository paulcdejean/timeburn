/**
 * @file The concept of the "network" which is all the servers the player can connect to, and some functions concerning it.
 */

import type { Server, NS } from "@ns"
import { CompletedProgramName, home, thisScript } from "@/constants"

type Servers = Map<string, Server>

export type Crack = CompletedProgramName.bruteSsh
  | CompletedProgramName.ftpCrack
  | CompletedProgramName.relaySmtp
  | CompletedProgramName.httpWorm
  | CompletedProgramName.sqlInject

export class Network {
  public upToDate = false
  public servers : Servers = new Map()
  public cracks  = new Map<Crack, boolean>([
    [CompletedProgramName.bruteSsh, false],
    [CompletedProgramName.ftpCrack, false],
    [CompletedProgramName.relaySmtp, false],
    [CompletedProgramName.httpWorm, false],
    [CompletedProgramName.sqlInject, false],
  ])
  private ns: NS

  constructor(ns: NS) {
    this.ns = ns
    this.refresh()
  }

  public refresh() {
    this.crackNetwork()

    // TODO detect change in home RAM or Cores

    if (!this.upToDate) {
      this.servers = new Map()
      this.populateNetwork()
      this.upToDate = true
    }
  }

  private crack(server: Server) : boolean {
    let sucessfulCracks = 0
    for (const [crack, exist] of this.cracks) {
      if (exist) {
        sucessfulCracks++
        switch(crack) {
          case CompletedProgramName.bruteSsh: {
            if(!server.sshPortOpen) {
              this.ns.brutessh(server.hostname)
            }
            break
          }
          case CompletedProgramName.ftpCrack: {
            if(!server.ftpPortOpen) {
              this.ns.ftpcrack(server.hostname)
            }
            break
          }
          case CompletedProgramName.relaySmtp: {
            if(!server.smtpPortOpen) {
              this.ns.relaysmtp(server.hostname)
            }
            break
          }
          case CompletedProgramName.httpWorm: {
            if(!server.httpPortOpen) {
              this.ns.httpworm(server.hostname)
            }
            break
          }
          case CompletedProgramName.sqlInject: {
            if(!server.sqlPortOpen) {
              this.ns.sqlinject(server.hostname)
            }
            break
          }
        }
      }
    }
    if (sucessfulCracks >= (server.numOpenPortsRequired ?? Infinity)) {
      this.ns.nuke(server.hostname)
      return true
    } else {
      return false
    }
  }

  private crackNetwork() {
    if (this.updateCracks()) {
      for (const [, server] of this.servers) {
        if (!server.hasAdminRights) {
          if(this.crack(server)) {
            this.upToDate = false
          }
        }
      }
    }
  }

  private updateCracks() {
    let cracksUpdated = false

    for (const [crack, exist] of this.cracks) {
      if(!exist && this.ns.fileExists(crack, home)) {
        this.cracks.set(crack, true)
        cracksUpdated = true
      }
    }
    return cracksUpdated
  }

  private populateNetwork() {
    this.servers.set(home, this.ns.getServer(home))

    this.servers.forEach( (_, server) => {
      this.ns.scan(server).forEach(scannedServer => {
        if (!this.servers.has(scannedServer)) {
          this.servers.set(scannedServer, this.ns.getServer(scannedServer))
        }
      })
      this.ns.scp(thisScript, server, home)
    })
  }
}
