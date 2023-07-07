import cssInline from "./css/Test.module.css?inline"
import css from "./css/Test.module.css"

export interface TestProps {
  resolveCallback: Function,
  referenceCount: {
    count: number
  }
}

function Test(props: TestProps) {
  React.useEffect(() => {
    props.referenceCount.count = props.referenceCount.count + 1
    return () => {
      props.resolveCallback()
    }
  }, [])

  return (
    <>
      <style>{cssInline}</style>
      <p className={css.todotext}>
        Highlander
      </p>
    </>
  )
}

export default Test
