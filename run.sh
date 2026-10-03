#!/bin/bash
set -e

echo "[run.sh] Starting Firebase Emulator Suite..."

cd /root/task

mkdir -p /root/task/seed

docker-compose down --remove-orphans || true

docker-compose up -d

echo "[run.sh] Waiting for Firebase Emulator UI to be ready..."
for i in $(seq 1 30); do
  if curl -s http://localhost:4000 > /dev/null 2>&1; then
    echo "[run.sh] Emulator UI is up."
    break
  fi
  echo "[run.sh] Waiting... attempt $i/30"
  sleep 3
done

echo "[run.sh] Waiting for Firestore emulator to be ready..."
for i in $(seq 1 30); do
  if curl -s http://localhost:8080 > /dev/null 2>&1; then
    echo "[run.sh] Firestore emulator is up."
    break
  fi
  echo "[run.sh] Waiting... attempt $i/30"
  sleep 3
done

echo "[run.sh] Waiting for Auth emulator to be ready..."
for i in $(seq 1 30); do
  if curl -s http://localhost:9099 > /dev/null 2>&1; then
    echo "[run.sh] Auth emulator is up."
    break
  fi
  echo "[run.sh] Waiting... attempt $i/30"
  sleep 3
done

echo "[run.sh] Seeding Auth and Firestore emulators..."
bash /root/task/seed_data.sh

echo "[run.sh] Deployment complete. Firebase Emulators are running."
echo "[run.sh]   Emulator UI : http://localhost:4000"
echo "[run.sh]   Firestore   : http://localhost:8080"
echo "[run.sh]   Auth        : http://localhost:9099"