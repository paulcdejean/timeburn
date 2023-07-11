import { NS } from "@ns";
import { Network } from "../network";
import { Farm } from "../Farm";

export type TargettingAlgo = (ns: NS, network: Network) => Farm
