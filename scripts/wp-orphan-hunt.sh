#!/bin/bash
cd "$HOME/public_html" || exit 1

echo "=== ManageWP file inventory ==="
ls -la wp-content/managewp 2>/dev/null
find wp-content/managewp -type f 2>/dev/null | head -40
echo "--- root mwp_db ---"
ls -la mwp_db 2>/dev/null
ls -la wp/mwp_db 2>/dev/null

echo
echo "=== Wordfence file remnants ==="
find . -maxdepth 6 -iname '*wordfence*' -o -iname 'wfwaf*' -o -iname 'wflogs*' 2>/dev/null | head -40
ls -la wp-content/wflogs 2>/dev/null
ls -la wp-content/plugins/wordfence 2>/dev/null

echo
echo "=== /old/ directory ==="
ls -la old/ 2>/dev/null | head
echo "fingerprint scan in old/"
grep -rlE 'pages\.dev|petal-plain|hihatbar|xorEncrypt|_pwsa' old/ --include='*.php' 2>/dev/null | head

echo
echo "=== /wp/ directory (separate WP?) ==="
ls -la wp/ 2>/dev/null | head
echo "fingerprint scan in /wp/"
grep -rlE 'pages\.dev|petal-plain|hihatbar|xorEncrypt|_pwsa' wp/ --include='*.php' 2>/dev/null | head

echo
echo "=== Subdir installs ==="
ls -la alpha ourgov ourgov-alpha ourgov-beta ourgovcommunity 2>/dev/null | head -30
for d in alpha ourgov ourgov-alpha ourgov-beta ourgovcommunity; do
  if [ -f "$d/.htaccess" ]; then
    echo "--- $d/.htaccess ---"
    cat "$d/.htaccess"
  fi
done

echo
echo "=== Show full file count to know scope ==="
echo "old/  : $(find old -type f 2>/dev/null | wc -l) files"
echo "wp/   : $(find wp -type f 2>/dev/null | wc -l) files"
echo "wp-content/managewp/ : $(find wp-content/managewp -type f 2>/dev/null | wc -l) files"

echo
echo "=== full grep for pages.dev/petal-plain across home (slow) ==="
timeout 60 grep -rlE 'petal-plain|hihatbar|pages\.dev/help' . 2>/dev/null | head -30
