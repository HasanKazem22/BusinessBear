"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Check, X, Shield, ShieldAlert, Loader2, UserCog, User, RefreshCw } from "lucide-react";

interface Role {
  id: number;
  name: string;
}

interface UserData {
  id: number;
  fullName: string;
  username: string;
  email: string | null;
  mobile: string;
  isActive: boolean;
  roles: Role[];
}

export default function UserManagementPage() {
  const { hasPermission } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/admin/users");
      setUsers(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleStatus = async (userId: number, currentStatus: boolean) => {
    try {
      await apiFetch(`/admin/users/${userId}/status`, {
        method: "PUT",
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      // Optimistic update
      setUsers(users.map(u => u.id === userId ? { ...u, isActive: !currentStatus } : u));
    } catch (err: any) {
      alert("Failed to update status: " + err.message);
    }
  };

  if (!hasPermission("VIEW_USER_MANAGEMENT")) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-zinc-500">
        <ShieldAlert className="w-12 h-12 mb-4 text-red-500/50" />
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Access Denied</h2>
        <p>You do not have permission to view the User Management module.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full h-full p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/50 dark:bg-zinc-900/50 p-6 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 backdrop-blur-xl">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white flex items-center gap-3">
            <UserCog className="w-8 h-8 text-indigo-500" />
            User Management
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1 text-sm">
            Manage system users, assign roles, and control access.
          </p>
        </div>
        <button
          onClick={fetchUsers}
          className="flex items-center justify-center gap-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white px-4 py-2 rounded-xl transition-colors font-medium text-sm"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Data
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-3xl shadow-xl shadow-zinc-200/20 dark:shadow-black/40 overflow-hidden flex flex-col">

        {loading && users.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 py-20">
            <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
            <p className="mt-4 text-sm text-zinc-500">Loading users...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center flex-1 py-20 text-red-500">
            <ShieldAlert className="w-8 h-8 mb-2" />
            <p>{error}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-zinc-50 dark:bg-zinc-950 text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800">
                <tr>
                  <th className="px-6 py-4 font-bold tracking-wider">User</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Contact</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Roles</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Status</th>
                  <th className="px-6 py-4 font-bold tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 font-bold">
                          {user.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-zinc-900 dark:text-white">
                            {user.fullName}
                          </div>
                          <div className="text-xs text-zinc-500 mt-0.5">
                            @{user.username}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-zinc-900 dark:text-zinc-300">{user.email || '—'}</div>
                      <div className="text-xs text-zinc-500 mt-0.5">{user.mobile}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {user.roles.map(role => (
                          <span
                            key={role.id}
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide uppercase flex items-center gap-1 ${role.name === 'ROLE_ADMIN'
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200/50 dark:border-amber-800/50'
                              : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border border-zinc-200/50 dark:border-zinc-700/50'
                              }`}
                          >
                            {role.name === 'ROLE_ADMIN' && <Shield className="w-3 h-3" />}
                            {role.name.replace('ROLE_', '')}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-emerald-500' : 'bg-red-500'} shadow-[0_0_8px_currentColor] opacity-80`} />
                        <span className={`text-xs font-medium ${user.isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                          {user.isActive ? 'Active' : 'Disabled'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => toggleStatus(user.id, user.isActive)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${user.isActive
                          ? 'bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/30 dark:hover:bg-red-900/40 dark:text-red-400 border border-red-200 dark:border-red-900/50'
                          : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600 dark:bg-emerald-950/30 dark:hover:bg-emerald-900/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50'
                          }`}
                      >
                        {user.isActive ? 'Disable' : 'Enable'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
