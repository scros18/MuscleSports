#!/bin/bash
# Run these commands in MobaXterm as root

echo "=== Setting up SSH key for remote access ==="

# Create .ssh directory if it doesn't exist
mkdir -p /root/.ssh
chmod 700 /root/.ssh

# Add the SSH public key
cat << 'EOF' >> /root/.ssh/authorized_keys
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQCdAAtU/ar8QWIUBwFvLJwFnGNrmPLBeZMJaFiffcCM3qaTlDsO1vx7yV4hAmYSop3AO9BR0yCCFlLwnsOhzaQO75o8ZVv3yn6mJZ3X9pPpCWglejJ7jMiEYUk4tcloz3UEiJuzoWcBBwha965WFthgxWH7eJiKjt4ubYjHvz5ziQa+CtxIZTJOYLs/xMs9S77gZwKvp6Z1N8SfkHNH9OvnHYEOZnGYSnuf4Y2au0TB3hsFYAtaUT//Bw82fTFh3bKWBYRpKGP9DIdjrLRGiB0R/PIWI4fNgRHHCQzjC+BsTbzYKc6GiQYkdMp6BLTyVRCgrTpdPF2BSIBhH0WJhzmNH2/DCXxHOWJbagNmI+rVYTVhHqETswy58DIFvGsf8Tqy6pvid7re8evaxhFZqCM8D2rVpD9lVtrM4dPpjC1ks0HnvLDewj02UInx6L3KoaXPomLW9AqDgRm1cQP+q92NW6rQKBHeEco1qD/v3QpTUITeWkFmJgiyMmzp7NUXNiY0Sc5XN5F1NMIx2BrqLU3Z8LTs6vFxSTD7dp4Oesd/cD+g/aKL/BNeleOkUL7BOQQmD67fbmOo7Y1lejQ/QJUHfeB/5Rs2bxY4KwANMG+t9mKGT/Pryebhepbn+XaXglo5pADtN6SCGgUPptTLeWwoGKk/pXh3wuJl5hdaUQ1/wQ== sam
EOF

# Set correct permissions
chmod 600 /root/.ssh/authorized_keys

echo "✓ SSH key added successfully!"
echo ""
echo "=== Finding WordPress Installation ==="
find /var/www -name "wp-config.php" 2>/dev/null
find /home -name "wp-config.php" 2>/dev/null

echo ""
echo "=== Listing /var/www/ ==="
ls -la /var/www/

echo ""
echo "=== Done! ==="
