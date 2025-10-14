"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Loader2, User, Mail, Calendar, LogOut, Package, ShoppingBag, Lock, Eye, EyeOff, MapPin, Trash2, AlertTriangle, Shield, Settings } from "lucide-react";
import { Order } from "@/types/product";

type MenuSection = "account" | "shipping" | "orders" | "security" | "privacy";

export default function AccountPage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [isServerAdmin, setIsServerAdmin] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Shipping address state
  const [shippingAddress, setShippingAddress] = useState({
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    postalCode: '',
    country: 'GB',
    phone: ''
  });
  const [shippingLoading, setShippingLoading] = useState(false);
  const [shippingMessage, setShippingMessage] = useState('');
  const [isEditingShipping, setIsEditingShipping] = useState(false);
  
  // Privacy state
  const [deleteDataLoading, setDeleteDataLoading] = useState(false);
  const [deleteAccountLoading, setDeleteAccountLoading] = useState(false);
  
  // Menu state
  const [activeSection, setActiveSection] = useState<MenuSection>("account");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchOrders();
      fetchShippingAddress();
    }
    // Also verify admin status with server in case auth context is missing role
    const verifyAdmin = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const headers: Record<string, string> = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch('/api/auth/me', {
          headers,
          credentials: 'include',
        });
        if (!res.ok) return;
        const data = await res.json();
        const u = data.user ? data.user : data;
        if (u && (u.role === 'admin' || u.isAdmin)) {
          setIsServerAdmin(true);
        }
      } catch (err) {
        // ignore
      }
    };

    verifyAdmin();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) return;

      const response = await fetch("/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const fetchShippingAddress = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) return;

      const response = await fetch("/api/user/shipping-address", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.shippingAddress) {
          setShippingAddress(data.shippingAddress);
        }
      }
    } catch (error) {
      console.error("Error fetching shipping address:", error);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordMessage('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage('New passwords do not match');
      setPasswordLoading(false);
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordMessage('New password must be at least 6 characters long');
      setPasswordLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setPasswordMessage('Authentication required');
        return;
      }

      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setPasswordMessage('Password changed successfully!');
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setShowPasswordForm(false);
      } else {
        setPasswordMessage(data.error || 'Failed to change password');
      }
    } catch (error) {
      console.error('Password change error:', error);
      setPasswordMessage('An error occurred. Please try again.');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleSaveShippingAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setShippingLoading(true);
    setShippingMessage('');

    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setShippingMessage('Authentication required');
        return;
      }

      const response = await fetch('/api/user/shipping-address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(shippingAddress),
      });

      const data = await response.json();

      if (response.ok) {
        setShippingMessage('Shipping address saved successfully!');
        setIsEditingShipping(false);
      } else {
        setShippingMessage(data.error || 'Failed to save shipping address');
      }
    } catch (error) {
      console.error('Save shipping address error:', error);
      setShippingMessage('An error occurred. Please try again.');
    } finally {
      setShippingLoading(false);
    }
  };

  const handleDeleteData = async () => {
    setDeleteDataLoading(true);
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) return;

      const response = await fetch('/api/user/delete-data', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Refresh the page data
        setOrders([]);
        setShippingAddress({
          firstName: '',
          lastName: '',
          address: '',
          apartment: '',
          city: '',
          postalCode: '',
          country: 'GB',
          phone: ''
        });
        alert('Your data has been deleted successfully');
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete data');
      }
    } catch (error) {
      console.error('Delete data error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setDeleteDataLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteAccountLoading(true);
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) return;

      const response = await fetch('/api/user/delete-account', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Log out and redirect
        logout();
        router.push('/');
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete account');
      }
    } catch (error) {
      console.error('Delete account error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setDeleteAccountLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-16">
        <div className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  const menuItems = [
    { id: "account" as MenuSection, label: "Account Info", icon: User },
    { id: "shipping" as MenuSection, label: "Shipping Address", icon: MapPin },
    { id: "orders" as MenuSection, label: "My Orders", icon: Package },
    { id: "security" as MenuSection, label: "Security", icon: Lock },
    { id: "privacy" as MenuSection, label: "Data & Privacy", icon: Shield },
  ];

  return (
    <div className="container py-8 md:py-16">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">My Account</h1>
        <p className="text-muted-foreground mt-1">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[250px,1fr] gap-6">
        {/* Sidebar Menu */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <Card>
            <CardContent className="p-2">
              <nav className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all ${
                        activeSection === item.id
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "hover:bg-accent text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
                <div className="pt-2 mt-2 border-t">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-all"
                  >
                    <LogOut className="h-4 w-4 flex-shrink-0" />
                    <span>Logout</span>
                  </button>
                </div>
              </nav>
            </CardContent>
          </Card>
        </aside>

        {/* Main Content */}
        <main className="space-y-6">
          {/* Account Info Section */}
          {activeSection === "account" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Account Information
                </CardTitle>
                <CardDescription>
                  Your personal account details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-4 border rounded-lg">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Full Name</p>
                    <p className="text-sm text-muted-foreground">{user.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 border rounded-lg">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 border rounded-lg">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Member Since</p>
                    <p className="text-sm text-muted-foreground">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Admin Entry */}
                {((user.role === 'admin' || user.isAdmin) || isServerAdmin) && (
                  <div className="pt-4">
                    <Button
                      variant="default"
                      className="w-full"
                      onClick={() => router.push('/admin')}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Enter Admin Panel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Security Section */}
          {activeSection === "security" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Manage your password and security preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Password Change Section */}
                <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Password</p>
                    <p className="text-sm text-muted-foreground">Change your account password</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPasswordForm(!showPasswordForm)}
                >
                  {showPasswordForm ? 'Cancel' : 'Change Password'}
                </Button>
              </div>

              {showPasswordForm && (
                <Card className="mt-4">
                  <CardContent className="pt-6">
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <div className="relative">
                          <Input
                            id="currentPassword"
                            type={showCurrentPassword ? "text" : "password"}
                            value={passwordForm.currentPassword}
                            onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          >
                            {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <div className="relative">
                          <Input
                            id="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            value={passwordForm.newPassword}
                            onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                            required
                            minLength={6}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={passwordForm.confirmPassword}
                            onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            required
                            minLength={6}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>

                      {passwordMessage && (
                        <p className={`text-sm ${passwordMessage.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
                          {passwordMessage}
                        </p>
                      )}

                      <div className="flex gap-2">
                        <Button type="submit" disabled={passwordLoading}>
                          {passwordLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Change Password
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setShowPasswordForm(false);
                            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                            setPasswordMessage('');
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Shipping Address Section */}
          {activeSection === "shipping" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Shipping Address
                  </CardTitle>
                  <CardDescription>
                    Save your default shipping address for faster checkout
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!isEditingShipping && (shippingAddress.firstName || shippingAddress.address) ? (
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <p className="font-medium">{shippingAddress.firstName} {shippingAddress.lastName}</p>
                        <p className="text-sm text-muted-foreground">{shippingAddress.address}</p>
                        {shippingAddress.apartment && (
                          <p className="text-sm text-muted-foreground">{shippingAddress.apartment}</p>
                        )}
                        <p className="text-sm text-muted-foreground">
                          {shippingAddress.city}, {shippingAddress.postalCode}
                        </p>
                        <p className="text-sm text-muted-foreground">{shippingAddress.country}</p>
                        <p className="text-sm text-muted-foreground">{shippingAddress.phone}</p>
                      </div>
                      <Button onClick={() => setIsEditingShipping(true)} variant="outline">
                        Edit Address
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSaveShippingAddress} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            value={shippingAddress.firstName}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, firstName: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            value={shippingAddress.lastName}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, lastName: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="country">Country</Label>
                        <Select
                          value={shippingAddress.country}
                          onValueChange={(value) => setShippingAddress({ ...shippingAddress, country: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="GB">🇬🇧 United Kingdom</SelectItem>
                            <SelectItem value="US">🇺🇸 United States</SelectItem>
                            <SelectItem value="CA">🇨🇦 Canada</SelectItem>
                            <SelectItem value="AU">🇦🇺 Australia</SelectItem>
                            <SelectItem value="DE">🇩🇪 Germany</SelectItem>
                            <SelectItem value="FR">🇫🇷 France</SelectItem>
                            <SelectItem value="ES">🇪🇸 Spain</SelectItem>
                            <SelectItem value="IT">🇮🇹 Italy</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          value={shippingAddress.address}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="apartment">Apartment, suite, etc. (optional)</Label>
                        <Input
                          id="apartment"
                          value={shippingAddress.apartment}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, apartment: e.target.value })}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            value={shippingAddress.city}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="postalCode">Postal Code</Label>
                          <Input
                            id="postalCode"
                            value={shippingAddress.postalCode}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={shippingAddress.phone}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                          required
                        />
                      </div>

                      {shippingMessage && (
                        <p className={`text-sm ${shippingMessage.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
                          {shippingMessage}
                        </p>
                      )}

                      <div className="flex gap-2">
                        <Button type="submit" disabled={shippingLoading}>
                          {shippingLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Save Address
                        </Button>
                        {isEditingShipping && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setIsEditingShipping(false);
                              setShippingMessage('');
                              fetchShippingAddress();
                            }}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </form>
                  )}
                </CardContent>
              </Card>
          )}

          {/* Orders Section */}
          {activeSection === "orders" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    My Orders
                  </CardTitle>
                  <CardDescription>
                    View your order history and track current orders
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {ordersLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-8">
                      <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No orders yet</p>
                      <p className="text-sm text-muted-foreground">Your order history will appear here</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-medium">Order #{order.id}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge variant={
                              order.status === 'delivered' ? 'default' :
                              order.status === 'shipped' ? 'secondary' :
                              order.status === 'processing' ? 'outline' :
                              order.status === 'cancelled' ? 'destructive' :
                              'outline'
                            }>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="text-sm text-muted-foreground">
                              {order.items.length} item{order.items.length !== 1 ? 's' : ''} • £{order.total.toFixed(2)}
                            </div>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
          )}

          {/* Data & Privacy Section */}
          {activeSection === "privacy" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Data & Privacy
                  </CardTitle>
                  <CardDescription>
                    Manage your personal data and account settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Delete Data Section */}
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-start gap-3 mb-3">
                      <Trash2 className="h-5 w-5 text-orange-600 mt-0.5" />
                      <div className="flex-1">
                        <h3 className="font-medium">Delete My Data</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          This will permanently delete your order history and saved shipping address, but keep your account active.
                        </p>
                      </div>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-50">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete My Data
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-orange-600" />
                            Delete Your Data?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action will permanently delete:
                            <ul className="list-disc list-inside mt-2 space-y-1">
                              <li>All your order history</li>
                              <li>Your saved shipping address</li>
                            </ul>
                            <p className="mt-2 font-medium">Your account will remain active and you can continue to use the service.</p>
                            <p className="mt-2 text-red-600">This action cannot be undone.</p>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDeleteData}
                            disabled={deleteDataLoading}
                            className="bg-orange-600 hover:bg-orange-700"
                          >
                            {deleteDataLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Yes, Delete My Data
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>

                  {/* Delete Account Section */}
                  <div className="p-4 border border-red-200 rounded-lg">
                    <div className="flex items-start gap-3 mb-3">
                      <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                      <div className="flex-1">
                        <h3 className="font-medium text-red-600">Delete My Account</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          This will permanently delete your account and all associated data. You will be logged out immediately.
                        </p>
                      </div>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete My Account
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                            Permanently Delete Your Account?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            <p className="font-medium text-red-600 mb-2">This is a permanent action!</p>
                            This will immediately and permanently delete:
                            <ul className="list-disc list-inside mt-2 space-y-1">
                              <li>Your account and login credentials</li>
                              <li>All your order history</li>
                              <li>Your saved shipping address</li>
                              <li>All personal information</li>
                            </ul>
                            <p className="mt-3 font-medium">You will be logged out and will not be able to access this account again.</p>
                            <p className="mt-2 text-red-600 font-bold">This action cannot be undone.</p>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDeleteAccount}
                            disabled={deleteAccountLoading}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            {deleteAccountLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Yes, Delete My Account Forever
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
          )}
        </main>
      </div>
    </div>
  );
}
