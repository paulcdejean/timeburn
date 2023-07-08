import { NS } from "@ns";

import TerminalWrapper from "./ui/TerminalWrapper";
import { TerminalUIState } from "@/TerminalUI/TerminalUIState"

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

  public constructor() {
    this.dispatchHandle = {
      func: null
    }
    this.state = {
      testCount: 0
    }
  }

  public async render(ns: NS) : Promise<void> {
    new Promise(resolve => {
      ns.tprintRaw(React.createElement(TerminalWrapper, {
        resolveCallback: resolve,
        dispatchCallback: this.dispatchHandle,
        uiState: this.state,
        randomID: Math.random(),
      }))
    }).then(() => this.render(ns)).catch(() => {})
  }
}
