#!/bin/bash
set -e

AUTH_URL="http://localhost:9099"
FIRESTORE_URL="http://localhost:8080"
PROJECT_ID="demo-project"

echo "[seed] Creating test user in Auth emulator..."
USER_RESPONSE=$(curl -s -X POST \
  "${AUTH_URL}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=demo-key" \
  -H "Content-Type: application/json" \
  -d '{"email":"reader@demo.com","password":"password123","returnSecureToken":true}')

echo "[seed] Auth response: $USER_RESPONSE"

USER_ID=$(echo "$USER_RESPONSE" | grep -o '"localId":"[^"]*"' | sed 's/"localId":"//;s/"//')

if [ -z "$USER_ID" ]; then
  echo "[seed] Could not extract user ID. User may already exist. Attempting sign-in..."
  SIGNIN_RESPONSE=$(curl -s -X POST \
    "${AUTH_URL}/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=demo-key" \
    -H "Content-Type: application/json" \
    -d '{"email":"reader@demo.com","password":"password123","returnSecureToken":true}')
  USER_ID=$(echo "$SIGNIN_RESPONSE" | grep -o '"localId":"[^"]*"' | sed 's/"localId":"//;s/"//')
  echo "[seed] Signed-in user ID: $USER_ID"
fi

echo "[seed] User ID resolved: $USER_ID"

if [ -z "$USER_ID" ]; then
  echo "[seed] ERROR: Could not create or sign in test user. Exiting."
  exit 1
fi

echo "[seed] Seeding books for user $USER_ID..."

BOOKS=(
  '{"title":{"stringValue":"The Pragmatic Programmer"},"author":{"stringValue":"David Thomas"},"genre":{"stringValue":"Technology"},"pageCount":{"integerValue":352},"rating":{"integerValue":5},"status":{"stringValue":"finished"}}'
  '{"title":{"stringValue":"Atomic Habits"},"author":{"stringValue":"James Clear"},"genre":{"stringValue":"Non-Fiction"},"pageCount":{"integerValue":320},"rating":{"integerValue":4},"status":{"stringValue":"finished"}}'
  '{"title":{"stringValue":"Dune"},"author":{"stringValue":"Frank Herbert"},"genre":{"stringValue":"Fiction"},"pageCount":{"integerValue":688},"rating":{"integerValue":5},"status":{"stringValue":"reading"}}'
  '{"title":{"stringValue":"Sapiens"},"author":{"stringValue":"Yuval Noah Harari"},"genre":{"stringValue":"History"},"pageCount":{"integerValue":443},"rating":{"integerValue":4},"status":{"stringValue":"want_to_read"}}'
  '{"title":{"stringValue":"Deep Work"},"author":{"stringValue":"Cal Newport"},"genre":{"stringValue":"Non-Fiction"},"pageCount":{"integerValue":296},"rating":{"integerValue":3},"status":{"stringValue":"want_to_read"}}'
)

for BOOK_FIELDS in "${BOOKS[@]}"; do
  FULL_DOC=$(echo "$BOOK_FIELDS" | sed "s/}$/,\"ownerId\":{\"stringValue\":\"${USER_ID}\"}}/")
  curl -s -X POST \
    "${FIRESTORE_URL}/v1/projects/${PROJECT_ID}/databases/(default)/documents/books" \
    -H "Content-Type: application/json" \
    -d "{\"fields\": ${FULL_DOC}}" > /dev/null
  echo "[seed] Seeded book: $(echo $BOOK_FIELDS | grep -o '\"stringValue\":\"[^\"]*\"' | head -1)"
done

echo "[seed] Seeding complete. 5 books created for user $USER_ID."