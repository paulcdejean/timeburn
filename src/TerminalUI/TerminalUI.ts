import { NS } from "@ns";

import TerminalWrapper from "./ui/TerminalWrapper";
import { ReferenceCount } from "@/utils/ReferenceCount";
import { FunctionBox } from "@/utils/FunctionBox";

export class TerminalUI {
  private wrapperRefCount : ReferenceCount = {
    count: 0
  }

  private dispatchHandle : FunctionBox = {
    func: () => {}
  }

  public state : TerminalUIState

  public update() {
    this.dispatchHandle.func(1)
  }

  public constructor() {
    this.state = {
      testCount: 0
    }
  }

  public async render(ns: NS) : Promise<void> {
    new Promise(resolve => {
      ns.tprintRaw(React.createElement(TerminalWrapper, {
        wrapperCount: this.wrapperRefCount,
        resolveCallback: resolve,
        dispatchCallback: this.dispatchHandle,
        uiState: this.state
      }))
    }).then(() => this.render(ns)).catch(() => {})
  }
}
