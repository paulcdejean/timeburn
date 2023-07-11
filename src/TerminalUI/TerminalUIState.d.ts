import { Capabilities } from "@/capabilities/Capabilities"
import type { NS } from "@ns"

export interface TerminalUIState {
  capability: Capabilities
  currentHackingTarget: string
  ns: NS
}
