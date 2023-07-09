import { NS } from "@ns";

import TerminalWrapper from "./ui/TerminalWrapper";
import type { TerminalUIState } from "@/TerminalUI/TerminalUIState"

export class TerminalUI {
  private dispatchHandle: {
    func: Function | null
  }
  
  public state : TerminalUIState

  public update() {
      if (this.dispatchHandle.func !== null) {
        this.dispatchHandle.func(1)
      }
  }

  public constructor(ns: NS) {
    this.dispatchHandle = {
      func: null
    }
    this.state = {
      testCount: 0
    }

    this.render(ns)
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
