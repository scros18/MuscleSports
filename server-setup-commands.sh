# Commands to run on MuscleSports VPS (137.74.157.17)
# You are logged in as root via MobaXterm

# 1. Create a new user for deployment
adduser deploy
# (It will ask for password - choose a strong one, or skip and we'll use SSH keys only)

# 2. Add user to sudo group
usermod -aG sudo deploy

# 3. Create SSH directory for the new user
mkdir -p /home/deploy/.ssh
chmod 700 /home/deploy/.ssh

# 4. Copy root's authorized keys OR add new key
# Option A: Copy from root
cp /root/.ssh/authorized_keys /home/deploy/.ssh/authorized_keys 2>/dev/null

# Option B: Add your public key manually
# First, show your public key on local machine (run this on your Windows PC):
# Get-Content "$env:USERPROFILE\.ssh\id_rsa.pub"

# Then on server, create authorized_keys:
# nano /home/deploy/.ssh/authorized_keys
# Paste your public key and save

# 5. Set correct permissions
chown -R deploy:deploy /home/deploy/.ssh
chmod 600 /home/deploy/.ssh/authorized_keys

# 6. Test SSH access (from another terminal or after):
# ssh deploy@137.74.157.17

# 7. Explore WordPress installation
echo "=== Finding WordPress Installation ==="
find /var/www -name "wp-config.php" 2>/dev/null
find /home -name "wp-config.php" 2>/dev/null
ls -la /var/www/

# 8. Check web server
systemctl status nginx
systemctl status apache2
ps aux | grep -E "nginx|apache"

# 9. Check MySQL/MariaDB
systemctl status mysql
systemctl status mariadb

echo ""
echo "=== Server Information ==="
cat /etc/os-release | grep PRETTY_NAME
free -h
df -h
