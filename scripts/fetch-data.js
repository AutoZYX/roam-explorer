#!/usr/bin/env node
/**
 * Fetch latest incident data from ROAM repository at build time.
 * Used by Vercel during `pnpm build`.
 */
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const ROAM_REPO = "https://github.com/AutoZYX/ROAM.git";
const TEMP_DIR = "/tmp/roam-data";
const DATA_DIR = path.join(__dirname, "..", "data", "incidents");

console.log("Fetching latest ROAM incident data...");

// Shallow clone just the incidents directory
try {
  if (fs.existsSync(TEMP_DIR)) {
    fs.rmSync(TEMP_DIR, { recursive: true });
  }
  execSync(
    `git clone --depth 1 --filter=blob:none --sparse ${ROAM_REPO} ${TEMP_DIR}`,
    { stdio: "pipe" }
  );
  execSync("git sparse-checkout set incidents", {
    cwd: TEMP_DIR,
    stdio: "pipe",
  });

  // Clean existing data
  if (fs.existsSync(DATA_DIR)) {
    fs.rmSync(DATA_DIR, { recursive: true });
  }
  fs.mkdirSync(DATA_DIR, { recursive: true });

  // Copy incident directories and schema
  const incidentsDir = path.join(TEMP_DIR, "incidents");
  const entries = fs.readdirSync(incidentsDir);
  for (const entry of entries) {
    const src = path.join(incidentsDir, entry);
    const dest = path.join(DATA_DIR, entry);
    if (fs.statSync(src).isDirectory()) {
      fs.cpSync(src, dest, { recursive: true });
    } else {
      fs.copyFileSync(src, dest);
    }
  }

  const yamlCount = execSync(
    `find ${DATA_DIR} -name "*.yaml" | wc -l`
  ).toString().trim();
  console.log(`Synced ${yamlCount} YAML incident files from ROAM.`);

  // Cleanup
  fs.rmSync(TEMP_DIR, { recursive: true });
} catch (err) {
  // If fetch fails, check if local data exists as fallback
  if (fs.existsSync(DATA_DIR) && fs.readdirSync(DATA_DIR).length > 0) {
    console.warn("WARN: Failed to fetch latest data, using existing local data.");
    console.warn(err.message);
  } else {
    console.error("ERROR: No incident data available!");
    process.exit(1);
  }
}
