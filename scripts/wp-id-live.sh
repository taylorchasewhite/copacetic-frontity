#!/bin/bash
# Identify the live install + scan orphan installs/managewp/wordfence remnants.

echo "=== 1. Apache vhost docroot for old.taylorchasewhite.com ==="
grep -RnE 'ServerName|ServerAlias|DocumentRoot' /etc/apache2/conf.d/userdata 2>/dev/null \
  | grep -iE 'taylorchasewhite|taylosj9' | head -40
# Also check the main userdata.conf summary
ls -la /etc/apache2/conf/httpd.conf 2>/dev/null
grep -nE 'old\.taylorchasewhite|www\.old\.taylorchasewhite|DocumentRoot.*public_html' /etc/apache2/conf/httpd.conf 2>/dev/null | head -20

echo
echo "=== 2. cPanel userdata file (authoritative) ==="
for f in /var/cpanel/userdata/taylosj9/*.cache /var/cpanel/userdata/taylosj9/*; do
  [ -f "$f" ] || continue
  if grep -qE 'old\.taylorchasewhite|documentroot' "$f" 2>/dev/null; then
    echo "--- $f ---"
    grep -E 'documentroot|servername|serveralias' "$f" 2>/dev/null | head
  fi
done

echo
echo "=== 3. Compare site URLs ==="
echo "live install (public_html):"
cd "$HOME/public_html" && wp option get siteurl 2>&1 && wp option get home 2>&1
echo "old/ install:"
[ -f "$HOME/public_html/old/wp-config.php" ] && (cd "$HOME/public_html/old" && wp option get siteurl 2>&1; wp option get home 2>&1) || echo "  (no wp-config.php in old/)"
echo "wp/ install:"
[ -f "$HOME/public_html/wp/wp-config.php" ] && (cd "$HOME/public_html/wp" && wp option get siteurl 2>&1; wp option get home 2>&1) || echo "  (no wp-config.php in wp/)"

echo
echo "=== 4. Live latest post sanity-check (matches the WP-CLI install) ==="
cd "$HOME/public_html" && wp post list --post_type=post --posts_per_page=3 --fields=ID,post_title,post_date

echo
echo "=== 5. Orphan install file counts + recent activity ==="
cd "$HOME/public_html"
for d in old wp; do
  [ -d "$d" ] || continue
  echo "--- $d/ ---"
  echo "  total files: $(find $d -type f 2>/dev/null | wc -l)"
  echo "  PHP files modified in last 30 days:"
  find "$d" -name '*.php' -mtime -30 -type f 2>/dev/null | head -10
done

echo
echo "=== 6. Wordfence remnants under wp/ and old/ ==="
find old wp -iname '*wordfence*' -o -iname 'wfwaf*' -o -iname 'wflogs*' 2>/dev/null | head -30
ls -la old/wordfence-waf.php wp/wordfence-waf.php 2>/dev/null

echo
echo "=== 7. Fingerprint scan inside orphan installs (slow; capped) ==="
timeout 90 grep -rlE 'pages\.dev/help|petal-plain|hihatbar|xorEncrypt|_pwsa' old wp --include='*.php' 2>/dev/null | head -20

echo
echo "=== 8. ManageWP file remnants under main install ==="
find wp-content/managewp -type f 2>/dev/null
ls -la wp-content/plugins/worker 2>/dev/null
ls -la wp-content/plugins/ | grep -iE 'manage|worker' 2>/dev/null

echo
echo "=== 9. Recent (24h) changes to orphan/main wp-content area ==="
find . -mtime -1 -type f \( -name '*.php' -o -name '.htaccess' -o -name '*.ini' \) \
  -not -path './wp-content/cache/*' \
  -not -path './wp-content/jetpack-waf/*' \
  -not -path './wp-content/uploads/jetpack-waf/*' \
  -not -path './wp-content/plugins/jetpack/*' \
  2>/dev/null | head -40
