import { useState, useEffect, useCallback } from 'react';
import { Search, Users, Shield, Filter } from 'lucide-react';
import type { User, UserRole } from '@/types';
import { authService } from '@/services/authService';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Spinner } from '@/components/ui/Spinner';
import { Pagination } from '@/components/ui/Pagination';
import { RoleAssignment } from './RoleAssignment';
import { formatDate } from '@/utils/formatters';
import toast from 'react-hot-toast';

const ITEMS_PER_PAGE = 15;

const ROLE_BADGE: Record<UserRole, { variant: 'default' | 'warning' | 'success' | 'danger' }> = {
  reader: { variant: 'default' },
  journalist: { variant: 'warning' },
  editor: { variant: 'success' },
  admin: { variant: 'danger' },
};

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data, count } = await authService.getUsers({
        page,
        limit: ITEMS_PER_PAGE,
        role: roleFilter === 'all' ? undefined : roleFilter,
        search: search.trim() || undefined,
      });
      setUsers(data);
      setTotalCount(count ?? 0);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [page, roleFilter, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleUpdated = () => {
    setEditingUser(null);
    fetchUsers();
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const roleCounts = {
    total: totalCount,
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-navy-100 p-4 flex items-center gap-3">
          <div className="p-2 bg-navy-100 rounded-lg">
            <Users className="h-5 w-5 text-navy-700" />
          </div>
          <div>
            <p className="text-2xl font-bold text-navy-900">{roleCounts.total}</p>
            <p className="text-xs text-navy-500">Total Users</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-navy-100 p-4 flex items-center gap-3">
          <div className="p-2 bg-amber-100 rounded-lg">
            <Shield className="h-5 w-5 text-amber-700" />
          </div>
          <div>
            <p className="text-2xl font-bold text-navy-900">
              {users.filter((u) => u.role === 'journalist').length}
            </p>
            <p className="text-xs text-navy-500">Journalists</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-navy-100 p-4 flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Shield className="h-5 w-5 text-green-700" />
          </div>
          <div>
            <p className="text-2xl font-bold text-navy-900">
              {users.filter((u) => u.role === 'editor').length}
            </p>
            <p className="text-xs text-navy-500">Editors</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-navy-100 p-4 flex items-center gap-3">
          <div className="p-2 bg-red-100 rounded-lg">
            <Shield className="h-5 w-5 text-red-700" />
          </div>
          <div>
            <p className="text-2xl font-bold text-navy-900">
              {users.filter((u) => u.role === 'admin').length}
            </p>
            <p className="text-xs text-navy-500">Admins</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400" />
          <Input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-10"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400" />
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value as UserRole | 'all');
              setPage(1);
            }}
            className="pl-10 pr-4 py-2 border border-navy-200 rounded-lg bg-white text-navy-700 text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
          >
            <option value="all">All Roles</option>
            <option value="reader">Reader</option>
            <option value="journalist">Journalist</option>
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-12 text-navy-500">
          <Users className="h-12 w-12 mx-auto mb-3 text-navy-300" />
          <p>No users found</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl shadow-sm border border-navy-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-navy-50 border-b border-navy-100">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-navy-600 uppercase tracking-wider">
                      User
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-navy-600 uppercase tracking-wider hidden sm:table-cell">
                      Email
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-navy-600 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-navy-600 uppercase tracking-wider hidden md:table-cell">
                      Joined
                    </th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-navy-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-100">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-navy-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar
                            src={u.avatar_url}
                            name={u.full_name}
                            size="sm"
                          />
                          <span className="text-sm font-medium text-navy-900">
                            {u.full_name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <span className="text-sm text-navy-600">{u.email}</span>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={ROLE_BADGE[u.role].variant}>
                          {u.role}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <span className="text-sm text-navy-500">
                          {formatDate(u.created_at)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setEditingUser(u)}
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                        >
                          Edit Role
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      )}

      {/* Role Assignment Modal */}
      {editingUser && (
        <RoleAssignment
          user={editingUser}
          onUpdate={handleRoleUpdated}
          onClose={() => setEditingUser(null)}
        />
      )}
    </div>
  );
}
