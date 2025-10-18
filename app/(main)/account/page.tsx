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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container py-6 md:py-12">
        {/* Hero Section with User Info */}
        <div className="mb-8 md:mb-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight bg-gradient-to-r from-primary via-primary to-emerald-600 bg-clip-text text-transparent">
                Welcome back, {user.name.split(' ')[0]}
              </h1>
              <p className="text-muted-foreground mt-2">Manage your account, orders, and preferences</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="group hover:border-red-500 hover:text-red-600 transition-all duration-300"
            >
              <LogOut className="h-4 w-4 mr-2 group-hover:translate-x-[-2px] transition-transform" />
              Logout
            </Button>
          </div>

          {/* Mobile Menu - Horizontal Scroll */}
          <div className="lg:hidden">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`flex flex-col items-center gap-2 px-4 py-3 rounded-xl whitespace-nowrap transition-all duration-300 ${
                      activeSection === item.id
                        ? "bg-gradient-to-br from-primary via-primary to-emerald-600 text-white shadow-lg scale-105"
                        : "bg-card hover:bg-accent border border-border"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-xs font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px,1fr] gap-6 md:gap-8">
          {/* Desktop Sidebar Menu */}
          <aside className="hidden lg:block lg:sticky lg:top-24 lg:self-start">
            <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-card via-card to-card/80 backdrop-blur-sm">
              <CardContent className="p-3">
                <nav className="space-y-1.5">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id)}
                        className={`group w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                          activeSection === item.id
                            ? "bg-gradient-to-r from-primary via-primary to-emerald-600 text-white shadow-lg shadow-primary/25 scale-[1.02]"
                            : "hover:bg-accent text-muted-foreground hover:text-foreground hover:translate-x-1"
                        }`}
                      >
                        <div className={`p-2 rounded-lg transition-colors ${
                          activeSection === item.id
                            ? "bg-white/20"
                            : "bg-primary/10 group-hover:bg-primary/20"
                        }`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="flex-1 text-left">{item.label}</span>
                        {activeSection === item.id && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        )}
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>

            {/* Admin Badge (Desktop) */}
            {((user.role === 'admin' || user.isAdmin) || isServerAdmin) && (
              <Card className="mt-4 overflow-hidden border-0 shadow-xl bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-red-500/10">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600">
                      <Settings className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Admin Access</p>
                      <p className="text-xs text-muted-foreground">Manage your store</p>
                    </div>
                  </div>
                  <Button
                    variant="default"
                    size="sm"
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                    onClick={() => router.push('/admin')}
                  >
                    <Settings className="mr-2 h-3.5 w-3.5" />
                    Admin Panel
                  </Button>
                </CardContent>
              </Card>
            )}
          </aside>

          {/* Main Content */}
          <main className="space-y-6">
            {/* Account Info Section */}
            {activeSection === "account" && (
              <div className="space-y-6">
                <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-card via-card to-card/80">
                  <CardHeader className="border-b bg-gradient-to-r from-primary/5 via-emerald-500/5 to-primary/5">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-emerald-600">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle>Account Information</CardTitle>
                        <CardDescription>Your personal details and membership info</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid gap-4">
                      {/* Name */}
                      <div className="group relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-background to-muted/20 p-5 transition-all duration-300 hover:shadow-lg hover:border-primary/50">
                        <div className="flex items-start gap-4">
                          <div className="p-2.5 rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10 group-hover:from-blue-500/20 group-hover:to-cyan-500/20 transition-colors">
                            <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Full Name</p>
                            <p className="text-lg font-semibold">{user.name}</p>
                          </div>
                        </div>
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/5 to-transparent rounded-full blur-2xl" />
                      </div>

                      {/* Email */}
                      <div className="group relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-background to-muted/20 p-5 transition-all duration-300 hover:shadow-lg hover:border-primary/50">
                        <div className="flex items-start gap-4">
                          <div className="p-2.5 rounded-lg bg-gradient-to-br from-emerald-500/10 to-teal-500/10 group-hover:from-emerald-500/20 group-hover:to-teal-500/20 transition-colors">
                            <Mail className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Email Address</p>
                            <p className="text-lg font-semibold break-all">{user.email}</p>
                          </div>
                        </div>
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-full blur-2xl" />
                      </div>

                      {/* Member Since */}
                      <div className="group relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-background to-muted/20 p-5 transition-all duration-300 hover:shadow-lg hover:border-primary/50">
                        <div className="flex items-start gap-4">
                          <div className="p-2.5 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 group-hover:from-purple-500/20 group-hover:to-pink-500/20 transition-colors">
                            <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Member Since</p>
                            <p className="text-lg font-semibold">
                              {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-GB', { 
                                day: 'numeric', 
                                month: 'long', 
                                year: 'numeric' 
                              }) : 'N/A'}
                            </p>
                          </div>
                        </div>
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/5 to-transparent rounded-full blur-2xl" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Admin Badge (Mobile) */}
                {((user.role === 'admin' || user.isAdmin) || isServerAdmin) && (
                  <Card className="lg:hidden overflow-hidden border-0 shadow-xl bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-red-500/10">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600">
                          <Settings className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-lg">Admin Access</p>
                          <p className="text-sm text-muted-foreground">Manage your store settings</p>
                        </div>
                      </div>
                      <Button
                        variant="default"
                        className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-lg"
                        onClick={() => router.push('/admin')}
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Enter Admin Panel
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

          {/* Security Section */}
          {activeSection === "security" && (
            <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-card via-card to-card/80">
              <CardHeader className="border-b bg-gradient-to-r from-red-500/5 via-orange-500/5 to-red-500/5">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-orange-600">
                    <Lock className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>Manage your password and security preferences</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="group rounded-xl border border-border bg-gradient-to-br from-background to-muted/20 p-5 transition-all duration-300 hover:shadow-lg hover:border-primary/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2.5 rounded-lg bg-gradient-to-br from-red-500/10 to-orange-500/10">
                          <Lock className="h-5 w-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                          <p className="font-semibold">Password</p>
                          <p className="text-sm text-muted-foreground">Change your account password</p>
                        </div>
                      </div>
                      <Button
                        variant={showPasswordForm ? "outline" : "default"}
                        size="sm"
                        onClick={() => setShowPasswordForm(!showPasswordForm)}
                        className="transition-all duration-300"
                      >
                        {showPasswordForm ? 'Cancel' : 'Change'}
                      </Button>
                    </div>

                    {showPasswordForm && (
                      <div className="mt-6 pt-6 border-t">
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
                                className="pr-10"
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
                                className="pr-10"
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
                                className="pr-10"
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
                            <div className={`p-3 rounded-lg ${passwordMessage.includes('successfully') ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-red-500/10 text-red-600 dark:text-red-400'}`}>
                              <p className="text-sm font-medium">{passwordMessage}</p>
                            </div>
                          )}

                          <div className="flex gap-2 pt-2">
                            <Button type="submit" disabled={passwordLoading} className="flex-1">
                              {passwordLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                              Update Password
                            </Button>
                          </div>
                        </form>
                      </div>
                    )}
                  </div>
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
    </div>
  );
}
