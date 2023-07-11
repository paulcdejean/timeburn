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
        <p>
          <button type="button" onClick={() => props.UIState.ns.exit()}>Exit</button>
        </p>
        <p>
          Capability = {props.UIState.capability}
        </p>
        <p>
          <button type="button" onClick={() => roulette(props.UIState.ns)}>Roulette</button>
        </p>
      </div>
    </>
  )
}

export default Terminal
