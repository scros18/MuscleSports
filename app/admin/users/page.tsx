'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { AdminLayout } from '@/components/admin-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [bulkAction, setBulkAction] = useState<'change-role' | 'delete' | null>(null);
  const [lastClickedIndex, setLastClickedIndex] = useState<number | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/admin/users', {
        headers,
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
    if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('auth_token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      } else {
        alert('Failed to update user role');
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Failed to update user role');
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to delete the user "${userName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const token = localStorage.getItem('auth_token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers,
      });

      if (response.ok) {
        setUsers(users.filter(u => u.id !== userId));
      } else {
        alert('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  const handleSelectUser = (userId: string, checked: boolean, index?: number) => {
    const newSelected = new Set(selectedUsers);
    if (checked) {
      newSelected.add(userId);
    } else {
      newSelected.delete(userId);
    }
    setSelectedUsers(newSelected);
    if (index !== undefined) {
      setLastClickedIndex(index);
    }
  };

  const handleRowClick = (userId: string, event: React.MouseEvent, index: number) => {
    // Don't trigger row selection if clicking on interactive elements
    const target = event.target as HTMLElement;
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'BUTTON' ||
      target.tagName === 'SELECT' ||
      target.tagName === 'OPTION' ||
      target.closest('button') ||
      target.closest('select') ||
      target.closest('input')
    ) {
      return;
    }

    if (event.shiftKey && lastClickedIndex !== null) {
      // Range selection with shift+click
      const startIndex = Math.min(lastClickedIndex, index);
      const endIndex = Math.max(lastClickedIndex, index);
      const rangeUserIds = users.slice(startIndex, endIndex + 1).map(u => u.id);

      const newSelected = new Set(selectedUsers);
      rangeUserIds.forEach(id => newSelected.add(id));
      setSelectedUsers(newSelected);
    } else {
      // Regular click - toggle selection
      const isSelected = selectedUsers.has(userId);
      handleSelectUser(userId, !isSelected);
      setLastClickedIndex(index);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(new Set(users.map(u => u.id)));
    } else {
      setSelectedUsers(new Set());
    }
  };

  const handleBulkRoleChange = async (newRole: 'user' | 'admin') => {
    if (selectedUsers.size === 0) return;

    if (!confirm(`Are you sure you want to change the role of ${selectedUsers.size} user(s) to ${newRole}?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('auth_token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/admin/users/bulk', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          action: 'change-role',
          userIds: Array.from(selectedUsers),
          role: newRole
        }),
      });

      if (response.ok) {
        setUsers(users.map(u => selectedUsers.has(u.id) ? { ...u, role: newRole } : u));
        setSelectedUsers(new Set());
        setBulkAction(null);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update user roles');
      }
    } catch (error) {
      console.error('Error updating user roles:', error);
      alert('Failed to update user roles');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedUsers.size === 0) return;

    if (!confirm(`Are you sure you want to delete ${selectedUsers.size} user(s)? This action cannot be undone.`)) {
      return;
    }

    try {
      const token = localStorage.getItem('auth_token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/admin/users/bulk', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          action: 'delete',
          userIds: Array.from(selectedUsers)
        }),
      });

      if (response.ok) {
        setUsers(users.filter(u => !selectedUsers.has(u.id)));
        setSelectedUsers(new Set());
        setBulkAction(null);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete users');
      }
    } catch (error) {
      console.error('Error deleting users:', error);
      alert('Failed to delete users');
    }
  };

  if (loading) {
    return (
      <AdminLayout title="User Management" description="Manage user accounts and permissions">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="User Management" description="Manage user accounts and permissions">
      <div className="p-4 sm:p-6">{users.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No users</h3>
                <p className="mt-1 text-sm text-gray-500">No users found in the database.</p>
              </div>
            ) : (
              <div className="bg-white shadow overflow-hidden rounded-lg">
                {/* Bulk Actions Header */}
                {selectedUsers.size > 0 && (
                  <div className="bg-blue-50 px-3 sm:px-4 py-3 border-b border-blue-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <span className="text-xs sm:text-sm font-medium text-blue-800">
                        {selectedUsers.size} user{selectedUsers.size !== 1 ? 's' : ''} selected
                      </span>
                      <div className="flex flex-wrap items-center gap-2">
                        <select
                          value={bulkAction || ''}
                          onChange={(e) => setBulkAction(e.target.value as 'change-role' | 'delete' | null)}
                          className="text-xs sm:text-sm px-2 sm:px-3 py-1 border border-blue-300 rounded-md text-blue-700 bg-white"
                        >
                          <option value="">Choose action...</option>
                          <option value="change-role">Change role</option>
                          <option value="delete">Delete users</option>
                        </select>
                        {bulkAction === 'change-role' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleBulkRoleChange('user')}
                              className="text-xs"
                            >
                              Set as User
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleBulkRoleChange('admin')}
                              className="text-xs"
                            >
                              Set as Admin
                            </Button>
                          </>
                        )}
                        {bulkAction === 'delete' && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={handleBulkDelete}
                            className="text-xs"
                          >
                            <Trash2 className="mr-1 h-3 w-3" />
                            Delete
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedUsers(new Set());
                            setBulkAction(null);
                          }}
                          className="text-xs"
                        >
                          Clear
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Users Table Header - Desktop only */}
                <div className="hidden sm:block bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedUsers.size === users.length && users.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-3 text-sm font-medium text-gray-900">Select All</span>
                  </div>
                </div>

                {/* Users List */}
                <ul className="divide-y divide-gray-200">
                  {users.map((userItem, index) => (
                    <li
                      key={userItem.id}
                      className={`cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedUsers.has(userItem.id) ? 'bg-blue-50' : ''
                      }`}
                      onClick={(e) => handleRowClick(userItem.id, e, index)}
                    >
                      <div className="px-3 sm:px-6 py-3 sm:py-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div className="flex items-start sm:items-center gap-3">
                            <input
                              type="checkbox"
                              checked={selectedUsers.has(userItem.id)}
                              onChange={(e) => handleSelectUser(userItem.id, e.target.checked, index)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1 sm:mt-0"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-medium text-gray-900 break-words">{userItem.name}</div>
                              <div className="text-xs sm:text-sm text-gray-500 break-all">{userItem.email}</div>
                              <div className="text-xs text-gray-400 mt-1">
                                Created: {new Date(userItem.created_at).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 ml-7 sm:ml-0">
                            {userItem.role === 'admin' ? (
                              <Badge variant="destructive" className="text-xs">Admin</Badge>
                            ) : (
                              <Badge variant="default" className="text-xs">User</Badge>
                            )}
                            <select
                              value={userItem.role}
                              onChange={(e) => handleRoleChange(userItem.id, e.target.value as 'user' | 'admin')}
                              className="text-xs px-2 py-1 border border-gray-300 rounded-md text-gray-700 bg-white"
                            >
                              <option value="user">User</option>
                              <option value="admin">Admin</option>
                            </select>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteUser(userItem.id, userItem.name)}
                              className="p-1 h-auto"
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </AdminLayout>
      );
    }
  