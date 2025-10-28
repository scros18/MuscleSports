#!/usr/bin/env bash
set -euo pipefail

# Wrapper to run Fred's Tropicana scraper JAR, import CSV results, and restart app safely.

ROOT_DIR="/var/www/html-musclesports"
JAR_PATH="$ROOT_DIR/tropicana-scraper-1.0-SNAPSHOT.jar"
OUT_DIR="$ROOT_DIR/data/tropicana-out"
LOG_DIR="/var/log"
RUN_LOG="$LOG_DIR/tropicana-jar-run.log"
IMPORT_LOG="$LOG_DIR/tropicana-import.log"
PORT=4000

mkdir -p "$OUT_DIR"

echo "[TROPICANA-JAR] $(date -Is) Starting JAR run..." | tee -a "$RUN_LOG"

# Run JAR with a timeout (8 minutes) in the output directory
pushd "$OUT_DIR" >/dev/null
  timeout 480s java -jar "$JAR_PATH" 2>&1 | tee -a "$RUN_LOG" || true
popd >/dev/null

# Find newest CSV produced in OUT_DIR
CSV_FILE=$(find "$OUT_DIR" -type f -name "*.csv" -printf '%T@ %p\n' 2>/dev/null | sort -nr | head -1 | awk '{ $1=""; sub(/^ /,""); print }')

if [[ -n "${CSV_FILE:-}" && -f "$CSV_FILE" ]]; then
  echo "[TROPICANA-JAR] Found CSV: $CSV_FILE" | tee -a "$RUN_LOG"
  echo "[IMPORT] Importing CSV into DB (see $IMPORT_LOG)..." | tee -a "$RUN_LOG"
  pushd "$ROOT_DIR" >/dev/null
    # Import with Node script (it filters OOS products). Do not exit on failure.
    npm run import:tropicana -- "$CSV_FILE" 2>&1 | tee -a "$IMPORT_LOG" || true
  popd >/dev/null
else
  echo "[TROPICANA-JAR] No CSV produced. Check $RUN_LOG for details." | tee -a "$RUN_LOG"
fi

# Free only port 4000 if occupied (without touching other apps)
PIDS=$(ss -ltnp 2>/dev/null | awk '/:'$PORT' / {print $NF}' | sed -E 's/.*pid=([0-9]+).*/\1/' | sort -u || true)
if [[ -n "${PIDS:-}" ]]; then
  echo "[PORT] Processes using :$PORT -> $PIDS" | tee -a "$RUN_LOG"
  for PID in $PIDS; do
    CMD=$(ps -o comm= -p "$PID" 2>/dev/null || true)
    echo "[PORT] Killing PID $PID ($CMD)" | tee -a "$RUN_LOG"
    kill -9 "$PID" 2>/dev/null || true
  done
else
  echo "[PORT] :$PORT is free" | tee -a "$RUN_LOG"
fi

# Restart only the MuscleSports app
if command -v pm2 >/dev/null 2>&1; then
  if pm2 list | grep -qi musclesports; then
    echo "[PM2] Restarting musclesports" | tee -a "$RUN_LOG"
    pm2 restart musclesports >/dev/null 2>&1 || true
  else
    echo "[PM2] musclesports not in PM2 list; starting with npm" | tee -a "$RUN_LOG"
    pushd "$ROOT_DIR" >/dev/null
      nohup npm run start >/var/log/musclesports-app.log 2>&1 &
    popd >/dev/null
  fi
else
  echo "[PM2] pm2 not installed; starting with npm" | tee -a "$RUN_LOG"
  pushd "$ROOT_DIR" >/dev/null
    nohup npm run start >/var/log/musclesports-app.log 2>&1 &
  popd >/dev/null
fi

echo "[DONE] $(date -Is) Tropicana JAR pipeline complete." | tee -a "$RUN_LOG"
