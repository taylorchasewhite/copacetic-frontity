#!/bin/bash
cd "$HOME/public_html/wp-content/themes" || exit 1
echo "=== fingerprint scan in all non-surfarama themes ==="
grep -rlE 'pages\.dev|petal-plain|hihatbar|xorEncrypt|_pwsa|base64_decode|eval\s*\(|gzinflate|str_rot13|preg_replace.*\/e' --include='*.php' . 2>/dev/null | grep -v surfarama

echo
echo "=== twentyeleven recent PHP files: head + stat ==="
for f in twentyeleven/functions.php twentyeleven/header.php twentyeleven/single.php twentyeleven/page.php twentyeleven/404.php twentyeleven/search.php twentyeleven/image.php; do
  echo "--- $f ---"
  stat -c '%y  size=%s' "$f" 2>/dev/null
  head -5 "$f" 2>/dev/null
  echo "(grep for suspicious tokens)"
  grep -nE 'base64_decode|eval\s*\(|gzinflate|str_rot13|pages\.dev|hihatbar|petal-plain|_pwsa|xorEncrypt|preg_replace.*\/e' "$f" 2>/dev/null | head
done
