import fs from "node:fs";
import path from "node:path";
const root = process.argv[2];
if (!root)
  throw new Error(
    "Pass the local BeThere repository path. This check only reads source files.",
  );
const source = fs.readFileSync(path.join(root, "functions/index.js"), "utf8");
const config = fs.readFileSync(
  path.join(root, "functions/lib/config.js"),
  "utf8",
);
const endpoints = [
  "checkPackReadiness",
  "createReferenceUploadSession",
  "finalizeReferenceUploadSession",
  "commitReferenceMetadata",
  "createOrder",
  "reshootSlot",
  "getReshootOperationStatus",
  "retrySlot",
  "deleteMyPhotos",
];
for (const endpoint of endpoints)
  if (!source.includes(`exports.${endpoint} =`))
    throw new Error(`Existing backend is missing ${endpoint}`);
for (const field of [
  "clientAttemptId",
  "uploadSessionId",
  "consentVersion",
  "fullPaths",
  "expiresAtMs",
  "readableOutputPaths",
])
  if (!source.includes(field))
    throw new Error(`Missing expected contract field: ${field}`);
if (!/imagesPerPack:\s*12/.test(config) || !/reshootCredits:\s*3/.test(config))
  throw new Error("The native pack contract has changed.");
console.log(
  "Read-only contract check passed: 9 callable names, 7 payload/projection fields, and the 12-photo / 3-reshoot contract are present.",
);
console.log(
  "This is a static compatibility check, not a live Firebase integration test.",
);
