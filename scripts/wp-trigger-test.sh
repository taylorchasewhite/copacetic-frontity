#!/bin/bash
cd "$HOME/public_html" || exit 1

URL='https://old.taylorchasewhite.com/wp-json/wp/v2/posts?page=1&per_page=1&_embed=1&categories=14'

echo "=== UA matrix (server-side curl) ==="
for ua in \
  "Vercel" \
  "node" \
  "node-fetch" \
  "axios/1.6.0" \
  "" \
  "Mozilla/5.0" \
  "vercel-edge-runtime" \
  "Next.js Middleware" \
  "Mozilla/5.0 (compatible; Vercelbot/1.0)" ; do
  out=$(curl -s -o /tmp/ua -w '%{http_code} %{content_type}' -A "$ua" "$URL")
  echo "UA='$ua'  ->  $out"
  if echo "$out" | grep -qi html; then
    head -c 250 /tmp/ua; echo
  fi
done

echo
echo "=== Object cache / advanced-cache drop-ins ==="
ls -la wp-content/object-cache.php wp-content/advanced-cache.php wp-content/db.php 2>/dev/null
for f in wp-content/object-cache.php wp-content/advanced-cache.php wp-content/db.php; do
  if [ -f "$f" ]; then
    echo "--- $f (head) ---"
    head -20 "$f"
    grep -nE 'base64_decode|eval\s*\(|gzinflate|str_rot13|pages\.dev|hihatbar|petal-plain|_pwsa|xorEncrypt|preg_replace.*\/e' "$f" 2>/dev/null
  fi
done

echo
echo "=== Transients with suspicious values ==="
wp db query "SELECT option_name, LENGTH(option_value) FROM wp_options WHERE (option_name LIKE '_transient_%' OR option_name LIKE '_site_transient_%') AND (option_value LIKE '%pages.dev%' OR option_value LIKE '%petal-plain%' OR option_value LIKE '%meta http-equiv%refresh%' OR option_value LIKE '%hihatbar%') LIMIT 20;"

echo
echo "=== Latest error_log files anywhere ==="
find . -name 'error_log' -mtime -7 -type f 2>/dev/null | head -10 | while read f; do
  echo "--- $f ---"
  tail -30 "$f"
done

echo
echo "=== W3 Total Cache / WP Super Cache leftovers? ==="
ls -la wp-content/w3tc-config 2>/dev/null
ls -la wp-content/cache 2>/dev/null | head -10
find wp-content/cache -name '*.html' 2>/dev/null | head -5 | while read f; do
  if grep -qE 'pages\.dev|petal-plain|hihatbar' "$f" 2>/dev/null; then
    echo "INFECTED CACHE FILE: $f"
  fi
done

echo
echo "=== Check published wpcode-style posts in CPTs ==="
wp db query "SELECT DISTINCT post_type FROM wp_posts WHERE post_type NOT IN ('post','page','attachment','revision','nav_menu_item','wp_block','wp_navigation','wp_global_styles','wp_template','wp_template_part','customize_changeset','oembed_cache','user_request','shop_order','shop_coupon','product','product_variation');"
