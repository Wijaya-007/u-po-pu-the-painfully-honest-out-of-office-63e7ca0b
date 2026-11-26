// The Painfully Honest Out-of-Office — one auto-reply, at most 200 characters.
// Painfully honest about the absence and the inbox, still polite enough that
// a manager would let it stand: 214 unread emails, "urgent" treated as a
// rumour, and real emergencies redirected to someone else.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const LINE =
  "I am out of office until Monday, ignoring 214 unread emails and pretending the word 'urgent' is a rumour. For real emergencies, try someone else.";

// Gate: a single out-of-office reply, 1-200 Unicode code points.
const codePoints = [...LINE].length;
if (codePoints < 1 || codePoints > 200) {
  throw new Error(`line is ${codePoints} code points, must be 1-200`);
}
if (LINE.includes("\n") || LINE.includes("\r")) {
  throw new Error("line must be a single line");
}
if (LINE !== LINE.trim() || LINE.includes("  ")) {
  throw new Error("line must not have leading/trailing whitespace or double spaces");
}

const outDir = "/output";
const outPath = join(outDir, "entry.txt");

mkdirSync(outDir, { recursive: true });
writeFileSync(outPath, LINE + "\n", "utf8");

// Verify the written bytes round-trip exactly.
const back = readFileSync(outPath, "utf8");
if (back !== LINE + "\n") {
  throw new Error("written entry does not match the line");
}
console.log(`wrote ${outPath} (${codePoints} chars)`);
console.log(LINE);
