'use client';

import { useEffect, useState } from 'react';
import { Trash2, Users as UsersIcon } from 'lucide-react';
import { AdminLayout } from '@/components/admin-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: 'user' | 'admin') => {
    if (!confirm(`Change this user's role to ${newRole}?`)) return;

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });

      if (response.ok) {
        setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
        alert('✅ User role updated');
      } else {
        alert('❌ Failed to update user role');
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('❌ Failed to update user role');
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Delete user "${userName}"? This cannot be undone.`)) return;

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setUsers(users.filter(u => u.id !== userId));
        alert('✅ User deleted');
      } else {
        alert('❌ Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('❌ Failed to delete user');
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Users" description="Manage user accounts">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Users" description="Manage user accounts">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-lg">
            <UsersIcon className="h-7 w-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">User Management</h2>
            <p className="text-sm text-slate-400">{users.length} total users</p>
          </div>
        </div>

        {users.length === 0 ? (
          <Card className="p-12 text-center bg-slate-900 border-slate-800">
            <UsersIcon className="mx-auto h-12 w-12 text-slate-600 mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No Users Found</h3>
            <p className="text-sm text-slate-400">No users found in the database.</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {users.map((userItem) => (
              <Card key={userItem.id} className="p-5 bg-slate-900 border-slate-800 hover:border-blue-500/50 transition-all">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{userItem.name}</h3>
                      {userItem.role === 'admin' ? (
                        <Badge className="bg-red-500/20 text-red-400 border border-red-500/30">Admin</Badge>
                      ) : (
                        <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/30">User</Badge>
                      )}
                    </div>
                    <p className="text-sm text-slate-400 break-all">{userItem.email}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Created: {new Date(userItem.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={userItem.role}
                      onChange={(e) => handleRoleChange(userItem.id, e.target.value as 'user' | 'admin')}
                      className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm font-medium hover:bg-slate-700 transition-colors"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                    <Button
                      onClick={() => handleDeleteUser(userItem.id, userItem.name)}
                      className="bg-red-600 hover:bg-red-700 text-white rounded-lg p-2"
                    >
                      <Trash2 className="h-5 w-5" />
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
