#!/usr/bin/env bash
# Capture Mobile Safari screenshots on a fresh iOS Simulator using ONLY Xcode's
# `simctl` — no Appium, no Node. Provisions a clean simulator per run and deletes
# it afterward (so every run starts factory-clean).
#
# Env:
#   LAB_DEVICE   simulator device (default "iPhone 15")
#   LAB_VERSION  iOS version to match, e.g. "18.3" (default: newest installed)
#   LAB_OUT      output directory (default ./out)
#   LAB_URLS     JSON array (from site-urls) OR comma/space/newline list of URLs
#   LAB_SETTLE   seconds to wait after opening each URL (default 6)
#
# Prints progress and a final `RESULT {json}` line; exits non-zero on any failure.
set -uo pipefail

DEVICE="${LAB_DEVICE:-iPhone 15}"
VERSION="${LAB_VERSION:-}"
OUT="${LAB_OUT:-./out}"
SETTLE="${LAB_SETTLE:-6}"
mkdir -p "$OUT"

# Accept a JSON array (from site-urls.sh/.mjs) or a plain comma/space/newline list.
raw="${LAB_URLS:-https://www.adobe.com}"
if [[ "$raw" == \[* ]]; then
  urls=$(printf '%s' "$raw" | grep -oE 'https?://[^"]+')
else
  urls=$(printf '%s' "$raw" | tr ',\n' '  ')
fi

# Resolve a runtime id for the requested iOS version, else the newest iOS runtime.
RUNTIME=""
[ -n "$VERSION" ] && RUNTIME=$(xcrun simctl list runtimes | grep -i "iOS ${VERSION}" | grep -o "com.apple[^ ]*" | head -1)
[ -z "$RUNTIME" ] && RUNTIME=$(xcrun simctl list runtimes | grep -i "iOS" | grep -o "com.apple[^ ]*" | tail -1)
[ -z "$RUNTIME" ] && { echo "ERROR: no iOS runtime installed (run: xcodebuild -downloadPlatform iOS)"; exit 1; }
echo "[ios] device=$DEVICE runtime=$RUNTIME"

# Fresh, clean device — deleted on exit no matter what.
UDID=$(xcrun simctl create "nala-$(date +%s)-$$" "$DEVICE" "$RUNTIME")
cleanup() { xcrun simctl shutdown "$UDID" >/dev/null 2>&1; xcrun simctl delete "$UDID" >/dev/null 2>&1; }
trap cleanup EXIT
echo "[ios] created $UDID"

xcrun simctl boot "$UDID"
xcrun simctl bootstatus "$UDID" >/dev/null 2>&1 || true

status=passed
for url in $urls; do
  [ -z "$url" ] && continue
  name=$(printf '%s' "$url" | sed 's|^https\{0,1\}://||; s|[^A-Za-z0-9._-]|_|g' | cut -c1-80)
  echo "[ios] open $url"
  xcrun simctl openurl "$UDID" "$url" || status=failed
  sleep "$SETTLE"
  if xcrun simctl io "$UDID" screenshot "$OUT/$name.png" >/dev/null 2>&1; then
    echo "[ios] shot $OUT/$name.png"
  else
    echo "[ios] screenshot FAILED: $url"; status=failed
  fi
done

echo "RESULT {\"status\":\"$status\",\"device\":\"$DEVICE\",\"runtime\":\"$RUNTIME\",\"out\":\"$OUT\"}"
[ "$status" = passed ]
