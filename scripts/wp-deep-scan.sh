#!/bin/bash
cd "$HOME/public_html" || exit 1

echo "=========================================="
echo "1. Suspect options"
echo "=========================================="
for k in l d exp _red rd redir; do
  v=$(wp option get "$k" 2>/dev/null)
  if [ -n "$v" ]; then echo "[FOUND] option $k = $v"; fi
done

echo ""
echo "=========================================="
echo "2. Options whose VALUE contains malware fingerprints"
echo "=========================================="
wp db query "SELECT option_name, LENGTH(option_value) AS len, autoload FROM wp_options WHERE option_value LIKE '%pages.dev%' OR option_value LIKE '%petal-plain%' OR option_value LIKE '%summer-wave%' OR option_value LIKE '%hihatbar%' OR option_value LIKE '%xorEncrypt%' OR option_value LIKE '%_pwsa%' OR option_value LIKE '%meta http-equiv%refresh%' LIMIT 100;"

echo ""
echo "=========================================="
echo "3. Large autoloaded options (top 25)"
echo "=========================================="
wp db query "SELECT option_name, LENGTH(option_value) AS len, autoload FROM wp_options WHERE autoload='yes' ORDER BY len DESC LIMIT 25;"

echo ""
echo "=========================================="
echo "4. Posts/postmeta with fingerprints"
echo "=========================================="
wp db query "SELECT ID, post_type, post_status, LEFT(post_title,60) FROM wp_posts WHERE post_content LIKE '%pages.dev%' OR post_content LIKE '%petal-plain%' OR post_content LIKE '%hihatbar%' OR post_content LIKE '%xorEncrypt%' OR post_content LIKE '%_pwsa%' OR post_content LIKE '%base64_decode%';"
wp db query "SELECT post_id, meta_key, LENGTH(meta_value) AS len FROM wp_postmeta WHERE meta_value LIKE '%pages.dev%' OR meta_value LIKE '%petal-plain%' OR meta_value LIKE '%hihatbar%' OR meta_value LIKE '%xorEncrypt%' OR meta_value LIKE '%_pwsa%';"

echo ""
echo "=========================================="
echo "5. usermeta with fingerprints"
echo "=========================================="
wp db query "SELECT user_id, meta_key FROM wp_usermeta WHERE meta_value LIKE '%pages.dev%' OR meta_value LIKE '%petal-plain%' OR meta_value LIKE '%xorEncrypt%' OR meta_value LIKE '%_pwsa%';"

echo ""
echo "=========================================="
echo "6. Cron events"
echo "=========================================="
wp cron event list 2>&1 | head -50

echo ""
echo "=========================================="
echo "7. Active plugins + must-use + drop-ins"
echo "=========================================="
wp plugin list 2>&1
echo "--- mu-plugins ---"
ls -la wp-content/mu-plugins/ 2>/dev/null
echo "--- drop-ins ---"
ls -la wp-content/*.php 2>/dev/null | grep -E 'object-cache|advanced-cache|db|maintenance|sunrise|fatal-error'
echo "--- root-level non-core PHP ---"
ls -la *.php 2>/dev/null

echo ""
echo "=========================================="
echo "8. Files containing fingerprints"
echo "=========================================="
grep -rlE 'petal-plain|summer-wave|hihatbar|xorEncrypt|_pwsa|pages\.dev/help' \
  wp-content/ wp-includes/ wp-admin/ . --include='*.php' --include='*.html' --include='*.htaccess' \
  --max-count=1 2>/dev/null | head -40

echo ""
echo "=========================================="
echo "9. .htaccess at root + wp-content"
echo "=========================================="
echo "--- root .htaccess ---"
cat .htaccess 2>/dev/null
echo "--- wp-content/.htaccess ---"
cat wp-content/.htaccess 2>/dev/null
echo "--- wp-content/uploads/.htaccess ---"
cat wp-content/uploads/.htaccess 2>/dev/null

echo ""
echo "=========================================="
echo "10. Recently modified files (last 3 days, excluding noisy paths)"
echo "=========================================="
find . -mtime -3 -type f \
  -not -path './wp-content/cache/*' \
  -not -path './wp-content/upgrade/*' \
  -not -path './wp-content/uploads/jetpack-waf/*' \
  -not -path './wp-content/jetpack-waf/*' \
  -not -path './wp-content/plugins/jetpack/*' \
  -not -path './wp/*' \
  -not -name 'error_log' \
  -not -name 'malware-canary.log' \
  2>/dev/null | head -50

echo ""
echo "=========================================="
echo "11. Live anonymous fetch â€” what do anon visitors see?"
echo "=========================================="
curl -sS -i -A 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' \
  -H 'Accept: application/json' \
  'https://old.taylorchasewhite.com/wp-json/wp/v2/posts?page=1&per_page=1&_embed=1&categories=14' \
  | head -8

echo ""
echo "=========================================="
echo "12. Check wp-config.php for tampering markers"
echo "=========================================="
grep -nE 'auto_prepend|base64_decode|eval\s*\(|gzinflate|str_rot13|hihatbar|pages\.dev|petal-plain|_red|xorEncrypt' wp-config.php 2>/dev/null

echo ""
echo "=========================================="
echo "13. PHP ini overrides (auto_prepend_file etc.)"
echo "=========================================="
find . -maxdepth 4 -name '.user.ini' -o -name 'php.ini' 2>/dev/null | xargs -I{} sh -c 'echo "--- {} ---"; cat {}'

echo ""
echo "DONE."
