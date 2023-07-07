import { ReferenceCount } from "@/utils/ReferenceCount"

export interface TerminalWrapperProps {
  wrapperCount: ReferenceCount,
  resolveCallback: Function,
}

function TerminalWrapper(props: TerminalWrapperProps) {
  // It works better here than in the first part of useEffect... Sorry...
  // props.wrapperCount.count++
  
  React.useEffect(() => {
    return () => {
      props.resolveCallback()
      props.wrapperCount.count--
    }
  }, [])

  return props.wrapperCount.count <= 1 ? (<p>Highlander</p>) : (<></>)
}

export default TerminalWrapper
