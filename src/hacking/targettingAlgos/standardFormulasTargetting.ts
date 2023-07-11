/* eslint-disable @typescript-eslint/no-unused-vars */
import { quickHack } from "../farmingAlgos/quickHack"
import type { TargettingAlgo } from "./TargettingAlgo"


export const standardFormulasTargetting : TargettingAlgo = function(ns, network) {
  // TODO!!!
  // Get the cost of performing the next pserver upgrade
  // Simulate for all potential targets how long it will take to get there
  // Pick the target with the fastest actual time

  return quickHack(ns, network, "sigma-cosmetics")
}
