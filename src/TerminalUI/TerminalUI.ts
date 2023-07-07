import { NS } from "@ns";

import TerminalWrapper from "./ui/TerminalWrapper";
import { ReferenceCount } from "@/utils/ReferenceCount";

export class TerminalUI {
  public wrapperRefCount : ReferenceCount = {
    count: 0
  }

  public increment(n: number) {
    return n + 1
  }

  public count = 0

  public async render(ns: NS) : Promise<void> {
    new Promise(resolve => {
      ns.tprintRaw(React.createElement(TerminalWrapper, {
        wrapperCount: this.wrapperRefCount,
        resolveCallback: resolve,
        counterCallback: this.increment
      }))
    }).then(() => this.render(ns)).catch(() => {})
  }
}
