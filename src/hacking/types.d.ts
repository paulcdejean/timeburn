import { Capabilities } from "@/capabilities/Capabilities"

export type Batch = BatchOperation[]

export interface BatchOperation {
  capability : Capabilities
  threads : number
  allowSpread : boolean
  affectStocks: boolean
}

export interface FarmStats {
  prepTime: number // in milliseconds
  partiallyPreppedCycleEarnings: number
  fullyPreppedCycleTime: number // in milliseconds
  fullyPreppedEarningsPerCycle: number
}
