#!/bin/bash

# MuscleSports Quick Setup Script
# This script helps set up the MuscleSports instance

set -e

echo "========================================="
echo "MuscleSports Setup Script"
echo "========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running from correct directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: Please run this script from /var/www/html-musclesports${NC}"
    exit 1
fi

echo -e "${GREEN}Step 1: Installing dependencies...${NC}"
npm install

echo ""
echo -e "${GREEN}Step 2: Checking for .env.local file...${NC}"
if [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}Warning: .env.local not found!${NC}"
    echo "Please create .env.local with your configuration before proceeding."
    echo ""
    echo "Would you like to create a template .env.local? (y/n)"
    read -r create_env
    if [ "$create_env" = "y" ]; then
        cat > .env.local << 'EOF'
# Database Configuration
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=musclesports_db

# JWT Secret (generate a secure random string)
JWT_SECRET=your_jwt_secret_here

# Email Configuration
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASSWORD=your_email_password
FROM_EMAIL=noreply@musclesports.co.uk

# Site URL
NEXT_PUBLIC_SITE_URL=https://musclesports.co.uk

# Add other configuration as needed
EOF
        echo -e "${GREEN}.env.local template created. Please edit it with your actual values.${NC}"
        echo "Press Enter when ready to continue..."
        read
    fi
else
    echo -e "${GREEN}.env.local found!${NC}"
fi

echo ""
echo -e "${GREEN}Step 3: Setting up Nginx configuration...${NC}"
if [ -f "nginx-musclesports.conf" ]; then
    echo "Would you like to install the nginx configuration? (requires sudo) (y/n)"
    read -r install_nginx
    if [ "$install_nginx" = "y" ]; then
        sudo cp nginx-musclesports.conf /etc/nginx/sites-available/musclesports
        
        if [ ! -L "/etc/nginx/sites-enabled/musclesports" ]; then
            sudo ln -s /etc/nginx/sites-available/musclesports /etc/nginx/sites-enabled/musclesports
            echo -e "${GREEN}Nginx config installed and enabled${NC}"
        else
            echo -e "${YELLOW}Nginx config symlink already exists${NC}"
        fi
        
        echo "Testing nginx configuration..."
        if sudo nginx -t; then
            echo -e "${GREEN}Nginx configuration is valid${NC}"
            echo "Reloading nginx..."
            sudo systemctl reload nginx
            echo -e "${GREEN}Nginx reloaded successfully${NC}"
        else
            echo -e "${RED}Nginx configuration test failed. Please check the configuration.${NC}"
        fi
    fi
fi

echo ""
echo -e "${GREEN}Step 4: Database setup${NC}"
echo "Would you like to initialize the database? (y/n)"
read -r init_db
if [ "$init_db" = "y" ]; then
    echo "Running database initialization..."
    npm run db:init || echo -e "${YELLOW}Database init failed or already exists${NC}"
    
    echo "Running migrations..."
    npm run db:migrate:all || echo -e "${YELLOW}Migrations failed or already applied${NC}"
fi

echo ""
echo -e "${GREEN}Step 5: Build application${NC}"
echo "Would you like to build the application now? (y/n)"
read -r build_app
if [ "$build_app" = "y" ]; then
    npm run build
fi

echo ""
echo "========================================="
echo -e "${GREEN}Setup Complete!${NC}"
echo "========================================="
echo ""
echo "Next steps:"
echo "1. Ensure your .env.local is properly configured"
echo "2. Configure your domain DNS to point to this server"
echo "3. Run SSL certificate setup: sudo certbot --nginx -d musclesports.co.uk -d www.musclesports.co.uk"
echo "4. Start the application:"
echo "   - Development: npm run dev"
echo "   - Production: npm start"
echo "   - With PM2: pm2 start npm --name musclesports -- start"
echo ""
echo "The application will run on port 4000"
echo "Nginx will proxy requests from your domain to localhost:4000"
echo ""
