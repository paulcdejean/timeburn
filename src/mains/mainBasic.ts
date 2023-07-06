import { NS } from "@ns";
import * as basicList from "@/staticRam"
import Test from "@/quests/ui/Test"

export const basicFunctions = Object.keys(basicList)

export async function mainBasic(ns: NS): Promise<void> {
  

  ns.tprintRaw(React.createElement(Test))
}
