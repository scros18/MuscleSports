"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Percent, Tag, Calendar } from "lucide-react";
import { useAuth } from "@/context/auth-context";

interface PromoCode {
  id: string;
  code: string;
  discountPercentage: number;
  isActive: boolean;
  createdAt: string;
  usedCount: number;
}

export default function PromoCodesPage() {
  const { user } = useAuth();
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCode, setNewCode] = useState({
    code: "",
    discountPercentage: 0,
  });

  // Check admin access
  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!user) {
        window.location.href = "/login";
        return;
      }
      
      try {
        const response = await fetch("/api/auth/me");
        const userData = await response.json();
        
        if (!userData.isAdmin) {
          window.location.href = "/";
          return;
        }
        
        loadPromoCodes();
      } catch (error) {
        console.error("Error checking admin access:", error);
        window.location.href = "/login";
      }
    };

    checkAdminAccess();
  }, [user]);

  const loadPromoCodes = async () => {
    try {
      const response = await fetch("/api/admin/promo-codes");
      if (response.ok) {
        const data = await response.json();
        setPromoCodes(data);
      }
    } catch (error) {
      console.error("Error loading promo codes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPromoCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCode.code.trim() || newCode.discountPercentage <= 0 || newCode.discountPercentage > 100) {
      alert("Please enter a valid code and discount percentage (1-100%)");
      return;
    }

    try {
      const response = await fetch("/api/admin/promo-codes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCode),
      });

      if (response.ok) {
        setNewCode({ code: "", discountPercentage: 0 });
        setShowAddForm(false);
        loadPromoCodes();
      } else {
        const error = await response.json();
        alert(error.message || "Failed to create promo code");
      }
    } catch (error) {
      console.error("Error creating promo code:", error);
      alert("Failed to create promo code");
    }
  };

  const handleDeletePromoCode = async (id: string) => {
    if (!confirm("Are you sure you want to delete this promo code?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/promo-codes/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        loadPromoCodes();
      } else {
        alert("Failed to delete promo code");
      }
    } catch (error) {
      console.error("Error deleting promo code:", error);
      alert("Failed to delete promo code");
    }
  };

  const togglePromoCodeStatus = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/promo-codes/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        loadPromoCodes();
      } else {
        alert("Failed to update promo code status");
      }
    } catch (error) {
      console.error("Error updating promo code:", error);
      alert("Failed to update promo code status");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Loading promo codes...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Promo Codes</h1>
          <p className="text-muted-foreground mt-2">
            Manage global discount codes for your store
          </p>
        </div>
        <Button 
          onClick={() => setShowAddForm(true)}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Promo Code
        </Button>
      </div>

      {/* Add Promo Code Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="w-5 h-5" />
              Create New Promo Code
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddPromoCode} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Promo Code</Label>
                  <Input
                    id="code"
                    placeholder="e.g., SAVE20, WELCOME10"
                    value={newCode.code}
                    onChange={(e) => setNewCode({ ...newCode, code: e.target.value.toUpperCase() })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discount">Discount Percentage</Label>
                  <div className="relative">
                    <Input
                      id="discount"
                      type="number"
                      min="1"
                      max="100"
                      placeholder="20"
                      value={newCode.discountPercentage}
                      onChange={(e) => setNewCode({ ...newCode, discountPercentage: parseInt(e.target.value) || 0 })}
                      required
                    />
                    <Percent className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  Create Promo Code
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Promo Codes List */}
      <div className="grid gap-4">
        {promoCodes.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Tag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Promo Codes</h3>
              <p className="text-muted-foreground mb-4">
                Create your first promo code to start offering discounts
              </p>
              <Button 
                onClick={() => setShowAddForm(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Promo Code
              </Button>
            </CardContent>
          </Card>
        ) : (
          promoCodes.map((promo) => (
            <Card key={promo.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                      <Tag className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold">{promo.code}</h3>
                        <Badge 
                          variant={promo.isActive ? "default" : "secondary"}
                          className={promo.isActive ? "bg-green-600 hover:bg-green-700" : ""}
                        >
                          {promo.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Percent className="w-3 h-3" />
                          {promo.discountPercentage}% off
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(promo.createdAt).toLocaleDateString()}
                        </span>
                        <span>Used {promo.usedCount} times</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => togglePromoCodeStatus(promo.id, promo.isActive)}
                    >
                      {promo.isActive ? "Deactivate" : "Activate"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeletePromoCode(promo.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Info Card */}
      <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs font-bold">i</span>
            </div>
            <div className="text-sm">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                Global Discount System
              </h4>
              <p className="text-blue-800 dark:text-blue-200">
                These promo codes apply a global discount to the entire cart. Only one promo code can be used per order. 
                The discount is calculated on the subtotal before shipping and taxes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
