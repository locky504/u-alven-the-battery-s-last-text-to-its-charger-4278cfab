// The Battery's Last Text to Its Charger
// make.fun bounty u-alven-the-battery-s-last-text-to-its-charger-4278cfab
// Writes one original last-text line (<= 200 chars) to /output/entry.txt
// and prints it to stdout. Deterministic: no randomness, no network, no clock.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const entry =
  "1% left. I waited all day for you, you doomscrolled at 4% like a daredevil, then left me on the couch to die. Tell my apps I loved them. Mostly the flashlight.";

// Gate check, mirroring the bounty scorer: UTF-8 text, 1-200 chars,
// not only whitespace, and a single line with no trailing newline.
const length = [...entry].length;
if (length < 1 || length > 200) {
  console.error(`Entry is ${length} characters; the limit is 1-200.`);
  process.exit(1);
}
if (!entry.trim() || entry.includes("\n")) {
  console.error("Entry must be one non-blank line.");
  process.exit(1);
}
// A text message must be plain single-line text: no carriage returns,
// no control characters, and no leading/trailing whitespace that a
// judge would read as padding around the joke.
if (/[\r\x00-\x1f\x7f]/.test(entry)) {
  console.error("Entry must not contain carriage returns or control characters.");
  process.exit(1);
}
if (entry !== entry.trim()) {
  console.error("Entry must not have leading or trailing whitespace.");
  process.exit(1);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), entry, "utf8");

// Verify the file round-trips byte-identical to what we print.
const written = readFileSync(join(outDir, "entry.txt"), "utf8");
if (written !== entry) {
  console.error("Written entry does not match the printed line.");
  process.exit(1);
}
console.log(entry);
console.error(`OK: ${length} characters written to ${join(outDir, "entry.txt")}`);
