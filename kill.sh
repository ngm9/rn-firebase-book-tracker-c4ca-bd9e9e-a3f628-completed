#!/bin/bash
set -e

echo "[kill.sh] Stopping and removing Docker containers..."
cd /root/task || true
docker-compose down --remove-orphans --volumes || true

echo "[kill.sh] Force removing task-related Docker images..."
docker rmi andreysenov/firebase-tools --force || true

echo "[kill.sh] Running full Docker system prune..."
docker system prune -a --volumes -f || true

echo "[kill.sh] Deleting /root/task directory..."
rm -rf /root/task || true

echo "[kill.sh] Cleanup complete."