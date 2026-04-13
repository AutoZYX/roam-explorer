#!/bin/bash
# Sync incident data from ROAM repository
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
ROAM_DIR="$(dirname "$PROJECT_DIR")/ROAM"

if [ ! -d "$ROAM_DIR/incidents" ]; then
  echo "Error: ROAM directory not found at $ROAM_DIR"
  exit 1
fi

mkdir -p "$PROJECT_DIR/data/incidents"
cp -r "$ROAM_DIR/incidents/2023" "$ROAM_DIR/incidents/2024" "$ROAM_DIR/incidents/2025" "$ROAM_DIR/incidents/2026" "$PROJECT_DIR/data/incidents/"
cp "$ROAM_DIR/incidents/schema.json" "$PROJECT_DIR/data/incidents/"

echo "Synced $(find "$PROJECT_DIR/data/incidents" -name '*.yaml' | wc -l | tr -d ' ') YAML files from ROAM"
