import { randomScrambleForEvent } from "cubing/scramble";

export async function newWcaScramble(): Promise<string> {
  return (await randomScrambleForEvent("333")).toString();
}
