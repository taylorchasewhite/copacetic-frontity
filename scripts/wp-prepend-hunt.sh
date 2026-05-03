#!/bin/bash
cd "$HOME/public_html" || exit 1

echo "=== wordfence remnants ==="
ls -la wordfence-waf.php .user.ini 2>/dev/null
find . -maxdepth 2 -name 'wordfence*' 2>/dev/null
ls -la wp-content/plugins/wordfence/ 2>/dev/null | head -20
ls -la wp-content/wflogs 2>/dev/null

echo
echo "=== ALL .user.ini files (anywhere) ==="
find . -name '.user.ini' 2>/dev/null | while read f; do
  echo "--- $f ---"
  cat "$f"
done

echo
echo "=== ALL php.ini files ==="
find . -name 'php.ini' 2>/dev/null | while read f; do
  echo "--- $f ---"
  cat "$f"
done

echo
echo "=== auto_prepend_file anywhere ==="
grep -rnE 'auto_prepend_file' . --include='*.ini' --include='.htaccess' --include='*.conf' 2>/dev/null

echo
echo "=== active plugin option ==="
wp option get active_plugins
echo
wp option get active_sitewide_plugins 2>/dev/null

echo
echo "=== wp-settings.php loading chain (line 560 area) ==="
sed -n '550,575p' wp-settings.php

echo
echo "=== root .htaccess (full, raw) ==="
cat -A .htaccess 2>/dev/null

echo
echo "=== mwp_update_public_keys / ManageWP traces ==="
wp db query "SELECT option_name FROM wp_options WHERE option_name LIKE '%mwp%' OR option_name LIKE '%manage%wp%' OR option_name LIKE '%worker%';"
find . -maxdepth 4 -iname '*mwp*' -o -iname '*managewp*' -o -iname 'wp-worker*' 2>/dev/null | head -20
