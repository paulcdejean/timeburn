import { TerminalUIState } from "../TerminalUIState"

import cssInline from "./css/Terminal.module.css?inline"
import css from "./css/Terminal.module.css"
import { roulette } from "@/gambling/roulette/roulette"

interface TerminalProps {
  UIState: TerminalUIState,
}


// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Terminal(props: TerminalProps) {
  return (
    <>
      <style>{cssInline}</style>
      <div className={css.terminalbox}>
        <button type="button" onClick={() => {
          try {
            // This throws a ScriptDeath error, but React can't handle this
            props.UIState.ns.exit()
          } catch { /* empty */ }
        }}>Exit</button>
        <hr />
        Target = {props.UIState.currentHackingTarget}
        <hr />
        Capability = {props.UIState.capability}
        <hr />
        <button type="button" onClick={() => roulette(props.UIState.ns)}>Roulette</button>
      </div>
    </>
  )
}

export default Terminal
