'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Percent, Tag, ToggleLeft, ToggleRight } from 'lucide-react';

interface PromoCode {
  id: string;
  code: string;
  discountPercentage: number;
  isActive: boolean;
  createdAt: string;
  usedCount: number;
}

export default function PromoCodesPage() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCode, setNewCode] = useState({
    code: '',
    discountPercentage: 0
  });

  useEffect(() => {
    loadPromoCodes();
  }, []);

  const loadPromoCodes = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/admin/promo-codes', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setPromoCodes(data);
      }
    } catch (error) {
      console.error('Error loading promo codes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPromoCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCode.code.trim() || newCode.discountPercentage <= 0 || newCode.discountPercentage > 100) {
      alert('Please enter a valid code and discount percentage (1-100%)');
      return;
    }

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/admin/promo-codes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newCode)
      });

      if (response.ok) {
        setNewCode({ code: '', discountPercentage: 0 });
        setShowAddForm(false);
        loadPromoCodes();
        alert('✅ Promo code created successfully!');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to create promo code');
      }
    } catch (error) {
      console.error('Error creating promo code:', error);
      alert('Failed to create promo code');
    }
  };

  const handleDeletePromoCode = async (id: string) => {
    if (!confirm('Delete this promo code?')) return;

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/admin/promo-codes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        loadPromoCodes();
        alert('✅ Promo code deleted');
      } else {
        alert('❌ Failed to delete promo code');
      }
    } catch (error) {
      console.error('Error deleting promo code:', error);
      alert('❌ Failed to delete promo code');
    }
  };

  const togglePromoCodeStatus = async (id: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/admin/promo-codes/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });

      if (response.ok) {
        loadPromoCodes();
      } else {
        alert('❌ Failed to update status');
      }
    } catch (error) {
      console.error('Error updating promo code:', error);
      alert('❌ Failed to update status');
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Promo Codes" description="Manage discount codes">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Promo Codes" description="Manage discount codes">
      <div className="p-3 md:p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-4 mb-6">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="p-2 md:p-3 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl shadow-lg">
              <Tag className="h-5 md:h-7 w-5 md:w-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white">Promo Codes</h2>
              <p className="text-xs md:text-sm text-slate-400">{promoCodes.length} total codes</p>
            </div>
          </div>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            className="w-full md:w-auto bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all text-sm md:text-base"
          >
            <Plus className="h-4 md:h-5 w-4 md:w-5 mr-1 md:mr-2" />
            Add Code
          </Button>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <Card className="p-4 md:p-6 mb-6 bg-slate-900 border-slate-800">
            <form onSubmit={handleAddPromoCode} className="space-y-3 md:space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <Label className="text-white mb-2 block text-sm md:text-base">Promo Code</Label>
                  <Input
                    type="text"
                    value={newCode.code}
                    onChange={(e) => setNewCode({ ...newCode, code: e.target.value.toUpperCase() })}
                    placeholder="SUMMER25"
                    className="bg-slate-800 border-slate-700 text-white text-sm"
                    required
                  />
                </div>
                <div>
                  <Label className="text-white mb-2 block text-sm md:text-base">Discount %</Label>
                  <Input
                    type="number"
                    min="1"
                    max="100"
                    value={newCode.discountPercentage}
                    onChange={(e) => setNewCode({ ...newCode, discountPercentage: parseInt(e.target.value) || 0 })}
                    placeholder="25"
                    className="bg-slate-800 border-slate-700 text-white text-sm"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-2 md:gap-3">
                <Button
                  type="submit"
                  className="flex-1 md:flex-none bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-full font-semibold text-sm md:text-base"
                >
                  Create Code
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 md:flex-none bg-slate-800 hover:bg-slate-700 text-white rounded-full border border-slate-700 text-sm md:text-base"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Promo Codes List */}
        {promoCodes.length === 0 ? (
          <Card className="p-6 md:p-12 text-center bg-slate-900 border-slate-800">
            <Tag className="mx-auto h-10 md:h-12 w-10 md:w-12 text-slate-600 mb-4" />
            <h3 className="text-base md:text-lg font-medium text-white mb-2">No Promo Codes</h3>
            <p className="text-xs md:text-sm text-slate-400">Create your first promo code to get started.</p>
          </Card>
        ) : (
          <div className="space-y-2 md:space-y-4">
            {promoCodes.map((promo) => (
              <Card key={promo.id} className="p-3 md:p-5 bg-slate-900 border-slate-800 hover:border-yellow-500/50 transition-all">
                <div className="flex flex-col gap-2.5">
                  {/* Top row - Code and Badge */}
                  <div className="flex items-center gap-2.5 justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="p-1.5 md:p-2 bg-yellow-500/20 rounded-lg flex-shrink-0">
                        <Percent className="h-3.5 md:h-5 w-3.5 md:w-5 text-yellow-400" />
                      </div>
                      <h3 className="text-sm md:text-lg font-bold text-white font-mono truncate">{promo.code}</h3>
                    </div>
                    {promo.isActive ? (
                      <Badge className="bg-green-500/20 text-green-400 border border-green-500/30 text-xs flex-shrink-0">Active</Badge>
                    ) : (
                      <Badge className="bg-slate-700 text-slate-400 border border-slate-600 text-xs flex-shrink-0">Inactive</Badge>
                    )}
                  </div>

                  {/* Middle row - Info */}
                  <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-slate-400 px-1">
                    <span className="font-semibold text-yellow-400">{promo.discountPercentage}%</span>
                    <span>off</span>
                    <span className="text-slate-600">•</span>
                    <span>Used {promo.usedCount}x</span>
                    <span className="text-slate-600">•</span>
                    <span>{new Date(promo.createdAt).toLocaleDateString()}</span>
                  </div>

                  {/* Bottom row - Actions */}
                  <div className="flex gap-2 pt-1">
                    <Button
                      onClick={() => togglePromoCodeStatus(promo.id, promo.isActive)}
                      className={`flex-1 px-2 py-1.5 rounded-full font-semibold text-xs md:text-sm transition-all ${
                        promo.isActive
                          ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {promo.isActive ? '✓ Active' : '○ Inactive'}
                    </Button>
                    <Button
                      onClick={() => handleDeletePromoCode(promo.id)}
                      className="bg-red-600 hover:bg-red-700 text-white rounded-lg p-1.5 flex-shrink-0"
                    >
                      <Trash2 className="h-3.5 md:h-4 w-3.5 md:w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
