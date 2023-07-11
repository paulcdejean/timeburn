/**
 * @file This is the "sticky" component that wraps the actual terminal UI.
 * We only allow one of these to be rendered at a time.
 */

import type { TerminalUIState } from "@/TerminalUI/TerminalUIState"
import Terminal from "./Terminal"


interface TerminalWrapperProps {
  resolveCallback: Function,
  dispatchCallback: {
    func: Function | boolean
  }
  uiState: TerminalUIState,
}

// HUGE react anti pattern, but this is bitburner yo.
function TerminalWrapperReducer(state: number, action: number) {
  return state + action
}

function TerminalWrapper(props: TerminalWrapperProps) {
  let reallyRendered = false

  const [, dispatch] = React.useReducer(TerminalWrapperReducer, 0)
  
  React.useLayoutEffect(() => {
    return () => {
      if(reallyRendered && props.dispatchCallback.func !== false) {
        props.dispatchCallback.func = true
      }
      props.resolveCallback()
    }
  }, [])

  if (props.dispatchCallback.func === dispatch || props.dispatchCallback.func === true) {
    props.dispatchCallback.func = dispatch
    reallyRendered = true
    return (<Terminal UIState={props.uiState} />)
  } else {
    reallyRendered = false
    return (<></>)
  }
}

export default TerminalWrapper
