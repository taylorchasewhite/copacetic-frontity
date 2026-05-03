#!/bin/bash
set -e
cd ~/public_html

ADMINS="admin taylorchasewhite tcw"

echo "=== 1. Destroying all sessions for admin users ==="
for u in $ADMINS; do
  echo "--- $u ---"
  wp user session destroy "$u" --all 2>&1 || true
done

echo
echo "=== 2. Generating + setting fresh 32-char passwords ==="
echo "!! COPY THESE NOW INTO YOUR PASSWORD MANAGER !!"
echo "------------------------------------------------"
for u in $ADMINS; do
  # 32-char URL-safe random string from /dev/urandom
  PW=$(LC_ALL=C tr -dc 'A-Za-z0-9!@#%^*_=+-' </dev/urandom | head -c 32)
  wp user update "$u" --user_pass="$PW" --skip-email >/dev/null
  printf "  %-22s  %s\n" "$u" "$PW"
done
echo "------------------------------------------------"

echo
echo "=== 3. Rotating WP salts (invalidates all existing auth cookies) ==="
wp config shuffle-salts
echo "Salts rotated."

echo
echo "=== 4. Verify admin list ==="
wp user list --role=administrator --fields=ID,user_login,user_email,user_registered --format=table

echo
echo "=== Done ==="
