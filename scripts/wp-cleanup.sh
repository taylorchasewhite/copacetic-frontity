#!/bin/bash
set -e
cd ~/public_html
echo "--- before: wpcode CPT count ---"
wp db query 'SELECT COUNT(*) FROM wp_posts WHERE post_type="wpcode";'
echo
echo "--- delete wpcode CPT posts ---"
wp db query 'DELETE FROM wp_posts WHERE post_type="wpcode";'
echo
echo "--- delete orphan postmeta ---"
wp db query 'DELETE pm FROM wp_postmeta pm LEFT JOIN wp_posts p ON pm.post_id=p.ID WHERE p.ID IS NULL;'
echo
echo "--- delete any wpcode_* / ihaf_* options ---"
for o in $(wp option list --search='wpcode_*' --field=option_name 2>/dev/null) $(wp option list --search='ihaf_*' --field=option_name 2>/dev/null); do
  echo "deleting option: $o"
  wp option delete "$o"
done
echo
echo "--- delete malware-set options 'l' and 'd' if present ---"
wp option delete l 2>/dev/null && echo "deleted l" || echo "no 'l' option"
wp option delete d 2>/dev/null && echo "deleted d" || echo "no 'd' option"
echo
echo "--- unschedule orphan cron ---"
wp cron event delete wpcode_usage_tracking_cron 2>&1 || true
echo
echo "--- delete uploads/wpcode dir ---"
rm -rf wp-content/uploads/wpcode && echo "deleted wp-content/uploads/wpcode"
echo
echo "--- clear ALL transients (any cached attacker payloads) ---"
wp transient delete --all
echo
echo "--- verify ---"
echo "wpcode posts:"; wp db query 'SELECT COUNT(*) FROM wp_posts WHERE post_type="wpcode";'
echo "wpcode/ihaf options:"; wp option list --search='*wpcode*' --format=csv; wp option list --search='*ihaf*' --format=csv
echo "options 'l'/'d':"; wp option get l 2>&1; wp option get d 2>&1
echo
echo "--- Done ---"
