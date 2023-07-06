import { NS } from "@ns";
import * as basicList from "@/staticRam"
import Test from "@/quests/ui/Test"

export const basicFunctions = Object.keys(basicList)

export async function mainBasic(ns: NS): Promise<void> {
  
  await new Promise(resolve => {
    ns.tprintRaw(React.createElement(Test, {resolveCallback: resolve}))
  })

  ns.tprint("Component is unmounted")
  

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, no-constant-condition
}
