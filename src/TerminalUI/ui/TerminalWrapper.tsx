/**
 * @file This is the "sticky" component that wraps the actual terminal UI.
 * We only allow one of these to be rendered at a time.
 */

import { ReferenceCount } from "@/utils/ReferenceCount"

export interface TerminalWrapperProps {
  wrapperCount: ReferenceCount,
  resolveCallback: Function,
}

function TerminalWrapper(props: TerminalWrapperProps) {
  // It works better here than in the first part of useEffect... Sorry...
  
  
  React.useEffect(() => {
    props.wrapperCount.count++
    return () => {
      props.resolveCallback()
      props.wrapperCount.count--
    }
  }, [])

  return props.wrapperCount.count <= 1 ? (<p>Highlander</p>) : (<></>)
}

export default TerminalWrapper
