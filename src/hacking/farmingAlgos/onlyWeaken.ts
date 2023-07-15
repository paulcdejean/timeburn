import { Farm } from "@/hacking/Farm";
import { Batch } from "../types";
import { Capabilities } from "@/capabilities/Capabilities";

export function onlyWeaken(farm: Farm) : Farm {
  const batch : Batch = [{
    capability: Capabilities.Weaken,
    threads: Infinity,
    allowSpread: true,
    affectStocks: false,
    minimumCores: 1,
  }]

  farm.schedule(batch)

  return farm
}
