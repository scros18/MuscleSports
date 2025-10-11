#!/bin/bash

echo "🚀 Deploying Ordify Admin Panel to Production..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "app/admin" ]; then
    print_error "Not in the correct directory. Please run from /var/www/html/"
    exit 1
fi

print_warning "Step 1: Running database migrations..."
if npx tsx scripts/add-role-column.ts; then
    print_status "Role column added to users table"
else
    print_error "Failed to add role column"
    exit 1
fi

if npx tsx scripts/migrate-products.ts; then
    print_status "Products migrated to database"
else
    print_error "Failed to migrate products"
    exit 1
fi

print_warning "Step 2: Building application..."
if npm run build; then
    print_status "Application built successfully"
else
    print_error "Build failed"
    exit 1
fi

print_warning "Step 3: Restarting services..."
if sudo systemctl restart ordify-next.service; then
    print_status "Next.js service restarted"
else
    print_error "Failed to restart Next.js service"
    exit 1
fi

if sudo systemctl restart ordify.service; then
    print_status "Ordify service restarted"
else
    print_error "Failed to restart Ordify service"
    exit 1
fi

print_warning "Step 4: Verifying deployment..."
sleep 5

if curl -s -o /dev/null -w "%{http_code}" https://ordifydirect.com/admin | grep -q "200"; then
    print_status "Admin panel is live at https://ordifydirect.com/admin"
    print_status "Login with: leon@ordifydirect.com (admin access granted)"
else
    print_error "Admin panel verification failed. Check logs:"
    echo "sudo journalctl -u ordify-next.service -f"
fi

echo ""
echo "🎉 Deployment complete!"
echo "Admin panel should now be available at: https://ordifydirect.com/admin"