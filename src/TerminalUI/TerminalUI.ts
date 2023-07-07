import { NS } from "@ns";

import TerminalWrapper from "./ui/TerminalWrapper";
import { ReferenceCount } from "@/utils/ReferenceCount";

export class TerminalUI {
  public wrapperRefCount : ReferenceCount = {
    count: 0
  }

  public async render(ns: NS) {
    new Promise(resolve => {
      ns.tprintRaw(React.createElement(TerminalWrapper, {
        wrapperCount: this.wrapperRefCount,
        resolveCallback: resolve,
      }))
    }).then(() => this.render(ns)).catch(() => {})
    return
  }
}
