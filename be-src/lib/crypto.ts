import * as crypto from "crypto";

function getSHA256(input: string): string {
  return crypto
    .createHash("sha256")
    .update(input)
    .digest("hex");
}

export { getSHA256 }