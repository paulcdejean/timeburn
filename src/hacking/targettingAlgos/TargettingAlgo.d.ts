import { NS } from "@ns";
import { Network } from "../network";

export type TargettingAlgo = (ns: NS, network: Network) => string
