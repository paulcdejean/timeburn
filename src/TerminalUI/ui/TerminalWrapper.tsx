/**
 * @file This is the "sticky" component that wraps the actual terminal UI.
 * We only allow one of these to be rendered at a time.
 */

import type { TerminalUIState } from "@/TerminalUI/TerminalUIState"


interface TerminalWrapperProps {
  resolveCallback: Function,
  dispatchCallback: {
    func: Function | null
  }
  uiState: TerminalUIState,
}

// HUGE react anti pattern, but this is bitburner yo.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function TerminalWrapperReducer(state: number, action: number) {
  return state + action
}

function TerminalWrapper(props: TerminalWrapperProps) {
  let reallyRendered = false

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [state, dispatch] = React.useReducer(TerminalWrapperReducer, 0)
  
  React.useLayoutEffect(() => {
    return () => {
      if(reallyRendered) {
        props.dispatchCallback.func = null
      }
      props.resolveCallback()
    }
  }, [])

  if (props.dispatchCallback.func === dispatch || props.dispatchCallback.func === null) {
    props.dispatchCallback.func = dispatch
    reallyRendered = true
    return (<p>Sticky: {props.uiState.testCount}</p>)
  } else {
    reallyRendered = false
    return (<></>)
  }
}

export default TerminalWrapper
