import cssInline from "./css/Test.module.css?inline"
import css from "./css/Test.module.css"

export interface TestProps {
  resolveCallback: Function
}

function Test(props: TestProps) {
  React.useEffect(() => {
    return () => {
      props.resolveCallback()
    }
}, [])

  return (
    <>
      <style>{cssInline}</style>
      <p className={css.positiona}>Position A</p>
      <p className={css.positionb}>Position B</p>
      <p className={css.positionc}>Position C</p>
    </>
  )
}

export default Test
