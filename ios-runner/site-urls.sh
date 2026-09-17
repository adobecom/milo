#!/usr/bin/env bash
# Expand a site into the URLs to screenshot on iOS — pure bash, no Node.
# Reads nala/features/visual/sot.<site>.yml when present (scrapes http(s) URLs),
# else falls back to a single demo URL. Prints space-separated URLs.
#
#   site-urls.sh <site> [milo_libs]
set -uo pipefail

site="${1:-bacom}"
milolibs="${2:-}"
f="nala/features/visual/sot.${site}.yml"

if [ -f "$f" ]; then
  urls=$(grep -oE "https?://[^\"' ]+" "$f" | sort -u)
else
  # TODO: replace with your real per-site URL list.
  urls="https://main--${site}--adobecom.aem.page/"
fi

if [ -n "$milolibs" ]; then
  q="${milolibs#\?}"
  out=""
  for u in $urls; do
    case "$u" in
      *\?*) out="$out ${u}&${q}" ;;
      *)    out="$out ${u}?${q}" ;;
    esac
  done
  echo $out
else
  echo $urls
fi
