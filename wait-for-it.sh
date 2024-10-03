#!/bin/bash

# wait-for-it.sh: Wait for a service to become available

# Usage: wait-for-it.sh host:port -- command args...
# Example: wait-for-it.sh postgres:5432 -- npx prisma migrate dev && npm run start:dev

TIMEOUT=15
WAITFORIT_ARGS=()

while [[ $# -gt 0 ]]
do
  case "$1" in
    *:* )
      HOST="${1%:*}"
      PORT="${1#*:}"
      shift
      ;;
    * )
      WAITFORIT_ARGS+=("$1")
      shift
      ;;
  esac
done

# Wait for the service to be available
until nc -z "$HOST" "$PORT"; do
  echo "Waiting for $HOST:$PORT to be available..."
  sleep 1
done

echo "$HOST:$PORT is now available."

# Execute the command passed to the script
exec "${WAITFORIT_ARGS[@]}"
