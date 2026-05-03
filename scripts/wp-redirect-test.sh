#!/bin/bash
echo "=== DNS A records ==="
dig +short old.taylorchasewhite.com
dig +short www.old.taylorchasewhite.com
dig +short taylorchasewhite.com

echo
echo "=== This server's outbound IP ==="
curl -sS https://api.ipify.org
echo

echo
echo "=== 10 anonymous fetches via DNS ==="
for i in $(seq 1 10); do
  out=$(curl -s -o /tmp/r$i -w '%{http_code} %{content_type}' \
    -A 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' \
    'https://old.taylorchasewhite.com/wp-json/wp/v2/posts?page=1&per_page=1&_embed=1&categories=14')
  echo "try $i: $out"
  if echo "$out" | grep -qi 'html'; then
    echo "  >>> HTML body preview:"
    head -c 300 /tmp/r$i
    echo
  fi
done

echo
echo "=== Same fetch, looped, against ORIGIN IP (bypass any CDN) ==="
ORIGIN=$(dig +short www.old.taylorchasewhite.com | head -1)
[ -z "$ORIGIN" ] && ORIGIN=$(dig +short old.taylorchasewhite.com | head -1)
echo "Origin IP: $ORIGIN"
for i in $(seq 1 5); do
  out=$(curl -s -o /tmp/o$i -w '%{http_code} %{content_type}' \
    -A 'Mozilla/5.0' \
    --resolve "old.taylorchasewhite.com:443:$ORIGIN" \
    'https://old.taylorchasewhite.com/wp-json/wp/v2/posts?page=1&per_page=1&categories=14')
  echo "origin try $i: $out"
done
