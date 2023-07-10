// A list of all functions we want to add to the static RAM of the script.
// These names also need to be added to the reservedNames section of obfuscator.config.json
// Having a static RAM of around 8GB is ideal. Small enough to launch on a new save, but still having basic functionality.

export const exec = 0; // Essential.

export const scp = 0; // Essential.
export const scan = 0; // Essential.
export const nuke = 0; // Essential.
export const fileExists = 0; // Essential.

export const getServerMaxRam = 0; // Upgrading capabilities.

export const getGrowTime = 0; // Essential for earning money.
export const getHackTime = 0; // Essential for earning money.
export const getWeakenTime = 0; // Essential for earning money.

export const brutessh = 0; // Cracks.
export const ftpcrack = 0;  // Cracks.
export const relaysmtp = 0;  // Cracks.
export const httpworm = 0;  // Cracks.
export const sqlinject = 0; // Cracks.

export const getServer = 0; // Luxury, simplifies network code.
export const getPlayer = 0; // Helpful for the tutorial.

export const getMoneySources = 0; // Luxury for tutorial.
export const hasTorRouter = 0; // Luxury for tutorial.
