# 📧 Email Verification Setup Guide for MuscleSports

This guide will help you set up the complete email verification system on your VPS.

## 🎯 What's Included

- ✅ Email verification on user registration
- ✅ Beautiful HTML emails with MuscleSports branding
- ✅ Welcome email with 10% discount code (`WELCOME10`)
- ✅ 24-hour verification token expiry
- ✅ Auto-login after email verification
- ✅ Email sent from `noreply@musclesports.co.uk`

---

## 📋 Prerequisites

- VPS with SSH access
- MySQL/MariaDB database
- Node.js application running on port 4000
- Domain: `musclesports.co.uk`

---

## 🔧 Step 1: Run Database Migration

You have **3 options** to run the database migration:

### Option A: Using MySQL Command (Recommended)

```bash
cd /var/www/MuscleSports
mysql -u YOUR_DB_USER -p YOUR_DB_NAME < scripts/email-verification-migration.sql
```

### Option B: Using Node.js Script

```bash
cd /var/www/MuscleSports
npm run build
node dist/scripts/add-email-verification.js
```

### Option C: Manual SQL (If above don't work)

Connect to your MySQL database and run:

```sql
USE ordify_db;

ALTER TABLE users 
ADD COLUMN email_verified BOOLEAN DEFAULT FALSE;

ALTER TABLE users 
ADD COLUMN verification_token VARCHAR(255) NULL;

ALTER TABLE users 
ADD COLUMN verification_token_expires DATETIME NULL;

CREATE INDEX idx_verification_token 
ON users (verification_token);
```

### Verify the Migration

```sql
DESCRIBE users;
```

You should see the new columns:
- `email_verified`
- `verification_token`
- `verification_token_expires`

---

## 📮 Step 2: Install & Configure Postfix (Mail Server)

### Install Postfix

```bash
sudo apt update
sudo apt install postfix mailutils -y
```

When prompted, select:
- **General type**: `Internet Site`
- **System mail name**: `musclesports.co.uk`

### Configure Postfix

Edit the Postfix configuration:

```bash
sudo nano /etc/postfix/main.cf
```

Add/update these lines:

```
myhostname = musclesports.co.uk
mydomain = musclesports.co.uk
myorigin = $mydomain
inet_interfaces = loopback-only
inet_protocols = ipv4
```

### Restart Postfix

```bash
sudo systemctl restart postfix
sudo systemctl enable postfix
sudo systemctl status postfix
```

### Test Email Sending

```bash
echo "Test email from MuscleSports" | mail -s "Test Subject" your-email@example.com
```

Check your email inbox (including spam folder).

---

## 🌐 Step 3: Configure DNS Records

Go to your domain registrar (Cloudflare, Namecheap, etc.) and add these records:

### SPF Record (TXT)

```
Type: TXT
Name: @
Value: v=spf1 ip4:YOUR_VPS_IP_ADDRESS ~all
TTL: Auto or 3600
```

Replace `YOUR_VPS_IP_ADDRESS` with your actual VPS IP.

### DMARC Record (TXT)

```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:postmaster@musclesports.co.uk
TTL: Auto or 3600
```

### MX Record (if not already set)

```
Type: MX
Name: @
Value: musclesports.co.uk
Priority: 10
TTL: Auto or 3600
```

### Verify DNS Propagation

Wait 5-30 minutes, then test:

```bash
dig TXT musclesports.co.uk
dig TXT _dmarc.musclesports.co.uk
dig MX musclesports.co.uk
```

---

## 🔐 Step 4: Environment Variables (Optional)

Add to your `.env.local` or `.env` file:

```bash
# Email Configuration
SMTP_HOST=localhost
SMTP_PORT=25
SMTP_USER=noreply@musclesports.co.uk
# SMTP_PASSWORD not needed for localhost

# Site URL
NEXT_PUBLIC_SITE_URL=https://musclesports.co.uk

# JWT Secret (should already exist)
JWT_SECRET=your-secret-key-here
```

---

## 🚀 Step 5: Deploy & Test

### 1. Pull Latest Code

```bash
cd /var/www/MuscleSports
git pull origin main
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Build Application

```bash
npm run build
```

### 4. Restart Application

```bash
# If using PM2
pm2 restart musclesports

# If using systemd
sudo systemctl restart musclesports

# If running in screen
# Stop current process and restart
screen -r musclesports
# Ctrl+C to stop
npm run start
```

### 5. Test the Full Flow

1. Go to https://musclesports.co.uk/register
2. Register a new account
3. Check your email for verification link
4. Click the verification link
5. You should be auto-logged in and see the welcome bonus!

---

## 🧪 Testing Email Locally

To test if Postfix is working:

```bash
# Test 1: Send test email
echo "Test from MuscleSports VPS" | mail -s "Test Subject" your-email@gmail.com

# Test 2: Check mail logs
sudo tail -f /var/log/mail.log

# Test 3: Check mail queue
mailq

# Test 4: Clear mail queue (if stuck)
sudo postsuper -d ALL
```

---

## 🔍 Troubleshooting

### Issue: Emails not being received

**Solution:**
1. Check if Postfix is running:
   ```bash
   sudo systemctl status postfix
   ```

2. Check mail logs for errors:
   ```bash
   sudo tail -50 /var/log/mail.log
   ```

3. Check if port 25 is blocked:
   ```bash
   sudo ss -tulnp | grep :25
   ```

4. Some VPS providers block port 25. Contact your provider to unblock it.

### Issue: Emails go to spam

**Solution:**
1. Ensure SPF, DMARC records are set correctly
2. Consider adding DKIM (optional but helps)
3. Build sender reputation by sending legitimate emails

### Issue: Verification token expired

**Solution:**
- Tokens expire after 24 hours
- User needs to register again to get a new verification email

### Issue: Database connection error

**Solution:**
```bash
# Check if MySQL is running
sudo systemctl status mysql

# Test database connection
mysql -u YOUR_USER -p YOUR_DATABASE -e "SELECT 1"
```

---

## 📧 Email Templates

The system sends two types of emails:

### 1. Verification Email
- Sent immediately after registration
- Contains verification link (valid 24 hours)
- Beautiful HTML design with MuscleSports branding

### 2. Welcome Email
- Sent after email verification
- Includes 10% discount code: `WELCOME10`
- Auto-login link to account

---

## 🎉 Success!

If everything is working, users will:
1. Register → Receive verification email
2. Click link → Email verified
3. Auto-login → See welcome message with discount code
4. Cannot login until email is verified

---

## 📞 Support

If you encounter issues:
1. Check the logs: `sudo tail -f /var/log/mail.log`
2. Check application logs: `pm2 logs musclesports`
3. Verify DNS records are propagated
4. Ensure Postfix is running

---

## 🔄 Future Enhancements

Consider adding:
- Resend verification email feature
- DKIM signing for better deliverability
- Email templates customization in admin panel
- Bulk email campaigns

---

**Created for MuscleSports** 💪
Premium Sports Nutrition Platform

