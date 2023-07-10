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

  constructor(ns: NS) {
    this.refresh(ns)
  }

  public refresh(ns: NS) {
    this.servers = {}
    this.addToNetwork(ns, home)
    this.upToDate = true
  }

  private addToNetwork(ns: NS, server: string) {
    if (!(server in this.servers)) {
      this.servers[server] = ns.getServer(server)
      ns.scp(thisScript, server, home)
      const nearbyServers = ns.scan(server)
      nearbyServers.forEach((nearbyServer) => {
        this.addToNetwork(ns, nearbyServer)
      })
    }
  }
}
