#!/bin/bash

# Hono Worker API テストスクリプト
# 使用方法: 
#   1. npm run dev でサーバー起動
#   2. 別ターミナルで ./test-api.sh を実行

API_URL="http://localhost:8787/api/v2"
COOKIE_FILE="cookies.txt"

# 色付き出力
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Hono Worker API Test ===${NC}\n"

# クリーンアップ
rm -f $COOKIE_FILE

# 1. ユーザー登録
echo -e "${GREEN}1. Register${NC}"
REGISTER_RESP=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }' \
  -c $COOKIE_FILE \
  -w "\nHTTP_STATUS:%{http_code}")

HTTP_STATUS=$(echo "$REGISTER_RESP" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$REGISTER_RESP" | sed '/HTTP_STATUS/d')

echo "Status: $HTTP_STATUS"
echo "$BODY" | jq 2>/dev/null || echo "$BODY"
echo ""

# 2. ログイン
echo -e "${GREEN}2. Login${NC}"
LOGIN_RESP=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }' \
  -c $COOKIE_FILE \
  -w "\nHTTP_STATUS:%{http_code}")

HTTP_STATUS=$(echo "$LOGIN_RESP" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$LOGIN_RESP" | sed '/HTTP_STATUS/d')

echo "Status: $HTTP_STATUS"
echo "$BODY" | jq 2>/dev/null || echo "$BODY"
echo ""

# 3. 現在のユーザー情報取得
echo -e "${GREEN}3. Get Me${NC}"
ME_RESP=$(curl -s -X GET "$API_URL/auth/me" \
  -b $COOKIE_FILE \
  -w "\nHTTP_STATUS:%{http_code}")

HTTP_STATUS=$(echo "$ME_RESP" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$ME_RESP" | sed '/HTTP_STATUS/d')

echo "Status: $HTTP_STATUS"
echo "$BODY" | jq 2>/dev/null || echo "$BODY"
echo ""

# 4. イベント一覧取得
echo -e "${GREEN}4. Get Events${NC}"
EVENTS_RESP=$(curl -s -X GET "$API_URL/events" \
  -w "\nHTTP_STATUS:%{http_code}")

HTTP_STATUS=$(echo "$EVENTS_RESP" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$EVENTS_RESP" | sed '/HTTP_STATUS/d')

echo "Status: $HTTP_STATUS"
echo "$BODY" | jq 2>/dev/null || echo "$BODY"
echo ""

# 5. ファイルアップロード
echo -e "${GREEN}5. Upload File${NC}"
# ダミーファイル作成
echo "Hello World" > test.txt

UPLOAD_RESP=$(curl -s -X POST "$API_URL/files" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@test.txt" \
  -F "comment=Test file upload" \
  -F "tags=[\"test\",\"demo\"]" \
  -b $COOKIE_FILE \
  -w "\nHTTP_STATUS:%{http_code}")

HTTP_STATUS=$(echo "$UPLOAD_RESP" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$UPLOAD_RESP" | sed '/HTTP_STATUS/d')
FILE_ID=$(echo "$BODY" | jq -r '.data.file.id')

echo "Status: $HTTP_STATUS"
echo "$BODY" | jq 2>/dev/null || echo "$BODY"
echo ""

# 6. ファイル一覧取得
echo -e "${GREEN}6. Get Files${NC}"
FILES_RESP=$(curl -s -X GET "$API_URL/files?limit=5" \
  -b $COOKIE_FILE \
  -w "\nHTTP_STATUS:%{http_code}")

HTTP_STATUS=$(echo "$FILES_RESP" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$FILES_RESP" | sed '/HTTP_STATUS/d')

echo "Status: $HTTP_STATUS"
echo "$BODY" | jq 2>/dev/null || echo "$BODY"
echo ""

# 7. ファイル削除
if [ "$FILE_ID" != "null" ] && [ ! -z "$FILE_ID" ]; then
  echo -e "${GREEN}7. Delete File (ID: $FILE_ID)${NC}"
  DELETE_RESP=$(curl -s -X DELETE "$API_URL/files/$FILE_ID" \
    -b $COOKIE_FILE \
    -w "\nHTTP_STATUS:%{http_code}")

  HTTP_STATUS=$(echo "$DELETE_RESP" | grep "HTTP_STATUS" | cut -d: -f2)
  BODY=$(echo "$DELETE_RESP" | sed '/HTTP_STATUS/d')

  echo "Status: $HTTP_STATUS"
  echo "$BODY" | jq 2>/dev/null || echo "$BODY"
  echo ""
fi

# 8. ログアウト
echo -e "${GREEN}8. Logout${NC}"
LOGOUT_RESP=$(curl -s -X POST "$API_URL/auth/logout" \
  -b $COOKIE_FILE \
  -w "\nHTTP_STATUS:%{http_code}")

HTTP_STATUS=$(echo "$LOGOUT_RESP" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$LOGOUT_RESP" | sed '/HTTP_STATUS/d')

echo "Status: $HTTP_STATUS"
echo "$BODY" | jq 2>/dev/null || echo "$BODY"
echo ""

# クリーンアップ
rm -f $COOKIE_FILE test.txt

echo -e "${BLUE}=== Test Complete ===${NC}"
