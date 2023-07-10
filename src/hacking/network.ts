/**
 * @file The concept of the "network" which is all the servers the player can connect to, and some functions concerning it.
 */

import type { Server, NS } from "@ns"
import { home, thisScript } from "@/constants"
import { Cracks } from "./crack";

type Servers = Record<string, Server>

export class Network {
  public upToDate = false
  public servers : Servers = {}
  public cracks : Record<Cracks, boolean> = {
    [Cracks.NUKE]: false,
    [Cracks.BruteSSH]: false,
    [Cracks.FTPCrack]: false,
    [Cracks.RelaySMTP]: false,
    [Cracks.HTTPWorm]: false,
    [Cracks.SQLInject]: false,
  }
  private ns: NS

  constructor(ns: NS) {
    this.ns = ns
    this.refresh()
  }

  public refresh() {
    this.servers = {}
    this.addToNetwork(home)
    this.upToDate = true
  }

  private addToNetwork(server: string) {
    if (!(server in this.servers)) {
      this.servers[server] = this.ns.getServer(server)
      this.ns.scp(thisScript, server, home)
      this.ns.scan(server).forEach((nearbyServer) => {
        this.addToNetwork(nearbyServer)
      })
    }
  }
}
