import { Farm } from "@/hacking/Farm";
import { Batch } from "../types";
import { Capabilities } from "@/capabilities/Capabilities";

export function onlyHack(farm: Farm) : Farm {
  const hackBatch : Batch = [{
    capability: Capabilities.Hack,
    threads: Infinity,
    allowSpread: true,
    affectStocks: false,
    minimumCores: 1,
  }]

  farm.schedule(hackBatch)

  return farm
}
