import { Farm } from "@/hacking/Farm";
import { weakenToMinSecurity } from "./weakenToMinSecurity";

export function HWGW(farm: Farm) : Farm {
  weakenToMinSecurity(farm)
  // growToMaxMoney(farm)

  // TODO, draw the rest of the owl

  // onlyWeaken(farm)

  return farm
}
