import type { NS } from "@ns";

import TerminalWrapper from "./ui/TerminalWrapper";
import type { TerminalUIState } from "@/TerminalUI/TerminalUIState"
import { Capabilities } from "@/capabilities/Capabilities";
import { noodles } from "@/constants";

export class TerminalUI {
  private dispatchHandle: {
    func: Function | boolean
  }
  
  public state : TerminalUIState

  public update() {
      if (this.dispatchHandle.func !== false && this.dispatchHandle.func !== true) {
        this.dispatchHandle.func(1)
      }
  }

  public constructor(ns: NS, capability: Capabilities) {
    this.dispatchHandle = {
      func: true
    }
    this.state = {
      capability: capability,
      ns: ns,
      currentHackingTarget: ns.getServer(noodles),
    }

    this.render(ns)
  }

  public close() {
    if (this.dispatchHandle.func === false || this.dispatchHandle.func === true) {
      this.dispatchHandle.func = false
    } else {
      const realDispatchHandle = this.dispatchHandle.func
      this.dispatchHandle.func = false
      realDispatchHandle(1)
    }
  }

  private render(ns: NS) {
    new Promise(resolve => {
      ns.tprintRaw(React.createElement(TerminalWrapper, {
        resolveCallback: resolve,
        dispatchCallback: this.dispatchHandle,
        uiState: this.state,
      }))
    }).then(() => this.render(ns)).catch(() => {})
  }
}
