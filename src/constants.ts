export const home = "home"
export const noodles = "n00dles"
export const defaultServerFortifyAmount = 0.002 // Mined from code
export const defaultServerWeakenAmount = 0.05 // Mined from code
export const thisScript = "timeburn.js"
export const baseRamCost = 1.6 // Mined from code, better to hardcode this than the spit a empty file and get the RAM cost of it...
export const milisecondsInASecond = 1000

// Mined from: https://github.com/bitburner-official/bitburner-src/blob/dev/src/Programs/Enums.ts
// Not available under netscript definitions for some reason...
export enum CompletedProgramName {
  nuke = "NUKE.exe",
  bruteSsh = "BruteSSH.exe",
  ftpCrack = "FTPCrack.exe",
  relaySmtp = "relaySMTP.exe",
  httpWorm = "HTTPWorm.exe",
  sqlInject = "SQLInject.exe",
  deepScan1 = "DeepscanV1.exe",
  deepScan2 = "DeepscanV2.exe",
  serverProfiler = "ServerProfiler.exe",
  autoLink = "AutoLink.exe",
  formulas = "Formulas.exe",
  bitFlume = "b1t_flum3.exe",
  flight = "fl1ght.exe",
}
