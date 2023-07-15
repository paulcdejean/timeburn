import { Capabilities } from "@/capabilities/Capabilities"
import type { NS, Server } from "@ns"

export interface TerminalUIState {
  capability: Capabilities
  currentHackingTarget: Server 
  ns: NS
}
