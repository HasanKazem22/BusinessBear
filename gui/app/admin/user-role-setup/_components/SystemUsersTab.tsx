"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import { toast } from "react-hot-toast";
import { Loader } from "@/components/ui/loader";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { TableLayout } from "@/components/ui/table-layout";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  LuPencil, LuCircleCheck, LuCircleX, LuUsers
} from "react-icons/lu";

interface UserItem {
  id: number;
  fullName?: string;
  username: string;
  email?: string;
  mobile?: string;
  isActive: boolean;
  roles: { id: number; name: string; description?: string }[];
}

interface RoleItem {
  id: number;
  name: string;
  description?: string;
}

export function SystemUsersTab() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [rolesList, setRolesList] = useState<RoleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);

  // Create / Edit User Modal
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [userForm, setUserForm] = useState({
    fullName: "",
    username: "",
    email: "",
    mobile: "",
    password: "",
    roleIds: [] as number[],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [uRes, rRes] = await Promise.all([
        apiFetch("/admin/users"),
        apiFetch("/admin/roles"),
      ]);
      const systemUsers = (uRes || []).filter((u: UserItem) =>
        u.roles?.some((r) => r.name !== "ROLE_CUSTOMER") || u.roles?.length === 0
      );
      setUsers(systemUsers);
      setRolesList(rRes || []);
    } catch (err: any) {
      toast.error(err?.message || "Failed to load system users.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleOpenCreate = () => {
    setEditingUser(null);
    setUserForm({ fullName: "", username: "", email: "", mobile: "", password: "", roleIds: [] });
    setShowModal(true);
  };

  const handleOpenEdit = (user: UserItem) => {
    setEditingUser(user);
    setUserForm({
      fullName: user.fullName || "",
      username: user.username,
      email: user.email || "",
      mobile: user.mobile || "",
      password: "",
      roleIds: user.roles?.map((r) => r.id) || [],
    });
    setShowModal(true);
  };

  const handleToggleStatus = async (user: UserItem) => {
    try {
      const nextStatus = !user.isActive;
      await apiFetch(`/admin/users/${user.id}/status`, {
        method: "PUT",
        body: JSON.stringify({ isActive: nextStatus }),
      });
      toast.success(`User '${user.username}' is now ${nextStatus ? "Active" : "Inactive"}.`);
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, isActive: nextStatus } : u))
      );
    } catch (err: any) {
      toast.error(err?.message || "Failed to toggle user status.");
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (editingUser) {
        await apiFetch(`/admin/users/${editingUser.id}`, {
          method: "PUT",
          body: JSON.stringify(userForm),
        });
        toast.success(`User account '${userForm.username}' updated!`);
      } else {
        await apiFetch("/admin/users", {
          method: "POST",
          body: JSON.stringify(userForm),
        });
        toast.success(`System user '${userForm.username}' created!`);
      }
      setShowModal(false);
      fetchData();
    } catch (err: any) {
      toast.error(err?.message || "Failed to save user account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredUsers = users.filter((u) =>
    (u.fullName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.email || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <TableLayout
      searchPlaceholder="Search system users by name, username, email..."
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
      createButtonText="Create System User"
      onCreateClick={handleOpenCreate}
      isEmpty={!isLoading && filteredUsers.length === 0}
      emptyTitle="No system users found"
      emptyDescription={searchQuery ? `No system users match "${searchQuery}".` : "No system accounts have been created yet."}
      emptyIcon={LuUsers}
      totalItems={filteredUsers.length}
      currentPage={currentPage}
      pageSize={pageSize}
      onPageChange={setCurrentPage}
      onPageSizeChange={setPageSize}
    >
      {/* Table Grid */}
      {isLoading ? (
        <div className="py-12"><Loader text="Loading system users..." variant="inline" /></div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800 text-[11px] uppercase tracking-wider font-bold text-zinc-500">
              <TableHead className="w-1/4">User Profile</TableHead>
              <TableHead className="w-1/4">Email</TableHead>
              <TableHead className="w-1/6">Mobile</TableHead>
              <TableHead className="w-1/4">Assigned Roles</TableHead>
              <TableHead className="w-28">Status</TableHead>
              <TableHead className="text-right pr-5 w-20">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-xs">
            {paginatedUsers.map((user) => (
              <TableRow key={user.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                <TableCell className="font-semibold text-zinc-900 dark:text-white">
                  <div className="font-bold">{user.fullName || user.username}</div>
                  <div className="text-[11px] font-mono text-zinc-400">@{user.username}</div>
                </TableCell>
                <TableCell className="text-zinc-600 dark:text-zinc-300">{user.email || "N/A"}</TableCell>
                <TableCell className="text-zinc-600 dark:text-zinc-300">{user.mobile || "N/A"}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {user.roles && user.roles.length > 0 ? (
                      user.roles.map((r) => (
                        <span
                          key={r.id}
                          className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700"
                        >
                          {r.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-zinc-400 italic">No Roles</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <button
                    onClick={() => handleToggleStatus(user)}
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase transition-all cursor-pointer ${
                      user.isActive
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                        : "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"
                    }`}
                  >
                    {user.isActive ? <LuCircleCheck className="w-3 h-3" /> : <LuCircleX className="w-3 h-3" />}
                    {user.isActive ? "Active" : "Inactive"}
                  </button>
                </TableCell>
                <TableCell className="text-right pr-5">
                  <div className="flex items-center justify-end">
                    <button
                      onClick={() => handleOpenEdit(user)}
                      className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 flex items-center justify-center transition-colors"
                      title="Edit User"
                    >
                      <LuPencil className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* CREATE / EDIT USER MODAL */}
      <Modal
        isOpen={showModal}
        onOpenChange={(open) => !open && setShowModal(false)}
        title={editingUser ? `Edit System User: @${editingUser.username}` : "Create System User"}
        onSave={handleSubmit}
        saveText={editingUser ? "Update User" : "Create User"}
        isLoading={isSubmitting}
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-[11px] font-bold uppercase text-zinc-500 mb-1">Full Name</label>
            <Input
              type="text"
              required
              placeholder="e.g. Hasibul Hasan"
              value={userForm.fullName}
              onChange={(e) => setUserForm({ ...userForm, fullName: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase text-zinc-500 mb-1">Username</label>
              <Input
                type="text"
                required
                placeholder="admin_hasan"
                value={userForm.username}
                onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-zinc-500 mb-1">
                {editingUser ? "Password (Optional)" : "Password"}
              </label>
              <Input
                type="password"
                required={!editingUser}
                placeholder="••••••••"
                value={userForm.password}
                onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase text-zinc-500 mb-1">Email Address</label>
              <Input
                type="email"
                required
                placeholder="hasan@example.com"
                value={userForm.email}
                onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-zinc-500 mb-1">Mobile Number</label>
              <Input
                type="tel"
                placeholder="+880 1700..."
                value={userForm.mobile}
                onChange={(e) => setUserForm({ ...userForm, mobile: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase text-zinc-500 mb-1.5">Assigned Roles</label>
            <div className="space-y-2 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 max-h-36 overflow-y-auto">
              {rolesList.map((r) => (
                <label key={r.id} className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={userForm.roleIds.includes(r.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setUserForm({ ...userForm, roleIds: [...userForm.roleIds, r.id] });
                      } else {
                        setUserForm({
                          ...userForm,
                          roleIds: userForm.roleIds.filter((id) => id !== r.id),
                        });
                      }
                    }}
                    className="w-4 h-4 accent-zinc-900 dark:accent-white rounded"
                  />
                  <span className="font-bold text-zinc-900 dark:text-white">{r.name}</span>
                  <span className="text-[10px] text-zinc-400">({r.description || "System role"})</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </TableLayout>
  );
}
