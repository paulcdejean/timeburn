import { Farm } from "@/hacking/Farm";
import { weakenToMinSecurity } from "./weakenToMinSecurity";
import { growToMaxMoney } from "./growToMaxMoney";
import { onlyWeaken } from "./onlyWeaken";

export function HWGW(farm: Farm) : Farm {
  weakenToMinSecurity(farm)
  growToMaxMoney(farm)

  // TODO: Draw the rest of the owl

  //onlyWeaken(farm)
  return farm
}
