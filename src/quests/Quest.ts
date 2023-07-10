import { NS } from "@ns";

type QuestTest = (ns: NS) => boolean

export interface Quest {
  description: string,
  test: QuestTest,
  unlocks: Quest[],
  completed: boolean,
}

export type QuestChain = Quest[]

/**
 * @function checkQuests checks the status of the quest chain every interval ms, terminates once the chain is completed
 */
export function checkQuests(ns: NS, chain: QuestChain, interval: number) {
  let allCompleted = true
  for (const quest of chain) {
    if (!quest.completed) {
      allCompleted = false
      if (quest.test(ns)) {
        quest.completed = true
        ns.tprint(`DEBUG: Quest complete! ${quest.description}`)
        chain.push(...quest.unlocks)
      }
    }
  }
  if (!allCompleted) {
    setTimeout(checkQuests, interval, ns, chain, interval)
  }
}
