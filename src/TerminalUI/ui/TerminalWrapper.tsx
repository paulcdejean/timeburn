/**
 * @file This is the "sticky" component that wraps the actual terminal UI.
 * We only allow one of these to be rendered at a time.
 */

import { FunctionBox } from "@/utils/FunctionBox"
import { ReferenceCount } from "@/utils/ReferenceCount"

export interface TerminalWrapperProps {
  wrapperCount: ReferenceCount,
  resolveCallback: Function,
  dispatchCallback: FunctionBox,
  uiState: TerminalUIState,
}

// HUGE react anti pattern, but this is bitburner yo.
function TerminalWrapperReducer(state: number, action: number) {
  return state + action
}

function TerminalWrapper(props: TerminalWrapperProps) {
  // It works better here than in the first part of useEffect. Don't ask why.
  props.wrapperCount.count++

  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [state, dispatch] = React.useReducer(TerminalWrapperReducer, 0)
  
  React.useEffect(() => {
    return () => {
      props.resolveCallback()
      props.wrapperCount.count--
    }
  })

  if (props.wrapperCount.count <= 1) {
    props.dispatchCallback = {func: dispatch}
    return (<p>Highlander: {props.uiState.testCount}</p>)
  } else {
    return (<></>)
  }
}

export default TerminalWrapper
