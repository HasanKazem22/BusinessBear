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
  LuCircleCheck, LuCircleX, LuPencil, LuUserCheck
} from "react-icons/lu";

interface CustomerUserItem {
  id: number;
  fullName?: string;
  username: string;
  email?: string;
  mobile?: string;
  isActive: boolean;
  roles: { id: number; name: string }[];
}

interface RoleItem {
  id: number;
  name: string;
}

export function CustomerUsersTab() {
  const [customers, setCustomers] = useState<CustomerUserItem[]>([]);
  const [rolesList, setRolesList] = useState<RoleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);

  // Edit Modal State
  const [editingCustomer, setEditingCustomer] = useState<CustomerUserItem | null>(null);
  const [customerForm, setCustomerForm] = useState({
    fullName: "",
    username: "",
    email: "",
    mobile: "",
    password: "",
    roleIds: [] as number[],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const [uRes, rRes] = await Promise.all([
        apiFetch("/admin/users"),
        apiFetch("/admin/roles"),
      ]);
      const customerList = (uRes || []).filter((u: CustomerUserItem) =>
        u.roles?.some((r) => r.name === "ROLE_CUSTOMER") || !u.roles?.some((r) => r.name === "ROLE_ADMIN" || r.name === "MANAGER")
      );
      setCustomers(customerList);
      setRolesList(rRes || []);
    } catch (err: any) {
      toast.error(err?.message || "Failed to load customer accounts.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleOpenEdit = (customer: CustomerUserItem) => {
    setEditingCustomer(customer);
    setCustomerForm({
      fullName: customer.fullName || "",
      username: customer.username,
      email: customer.email || "",
      mobile: customer.mobile || "",
      password: "",
      roleIds: customer.roles?.map((r) => r.id) || [],
    });
  };

  const handleToggleStatus = async (user: CustomerUserItem) => {
    try {
      const nextStatus = !user.isActive;
      await apiFetch(`/admin/users/${user.id}/status`, {
        method: "PUT",
        body: JSON.stringify({ isActive: nextStatus }),
      });
      toast.success(`Customer '${user.username}' is now ${nextStatus ? "Active" : "Blocked"}.`);
      setCustomers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, isActive: nextStatus } : u))
      );
    } catch (err: any) {
      toast.error(err?.message || "Failed to update customer status.");
    }
  };

  const handleSubmitEdit = async () => {
    if (!editingCustomer) return;
    setIsSubmitting(true);
    try {
      await apiFetch(`/admin/users/${editingCustomer.id}`, {
        method: "PUT",
        body: JSON.stringify(customerForm),
      });
      toast.success(`Customer account '${customerForm.username}' updated!`);
      setEditingCustomer(null);
      fetchCustomers();
    } catch (err: any) {
      toast.error(err?.message || "Failed to update customer account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCustomers = customers.filter((c) =>
    (c.fullName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.mobile || "").includes(searchQuery)
  );

  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <TableLayout
      searchPlaceholder="Search customer accounts by name, username, email, mobile..."
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
      isEmpty={!isLoading && filteredCustomers.length === 0}
      emptyTitle="No customer accounts found"
      emptyDescription={searchQuery ? `No customer accounts match "${searchQuery}".` : "No customer accounts have registered yet."}
      emptyIcon={LuUserCheck}
      totalItems={filteredCustomers.length}
      currentPage={currentPage}
      pageSize={pageSize}
      onPageChange={setCurrentPage}
      onPageSizeChange={setPageSize}
    >
      {/* Table Grid */}
      {isLoading ? (
        <div className="py-12"><Loader text="Loading customer accounts..." variant="inline" /></div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800 text-[11px] uppercase tracking-wider font-bold text-zinc-500">
              <TableHead className="w-1/3">Customer Profile</TableHead>
              <TableHead className="w-1/3">Email Address</TableHead>
              <TableHead className="w-1/4">Mobile Number</TableHead>
              <TableHead className="w-28">Account Status</TableHead>
              <TableHead className="text-right pr-5 w-20">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-xs">
            {paginatedCustomers.map((customer) => (
              <TableRow key={customer.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                <TableCell className="font-semibold text-zinc-900 dark:text-white">
                  <div className="font-bold">{customer.fullName || customer.username}</div>
                  <div className="text-[11px] font-mono text-zinc-400">@{customer.username}</div>
                </TableCell>
                <TableCell className="text-zinc-600 dark:text-zinc-300">{customer.email || "N/A"}</TableCell>
                <TableCell className="text-zinc-600 dark:text-zinc-300">{customer.mobile || "N/A"}</TableCell>
                <TableCell>
                  <button
                    onClick={() => handleToggleStatus(customer)}
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase transition-all cursor-pointer ${
                      customer.isActive
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                        : "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"
                    }`}
                  >
                    {customer.isActive ? <LuCircleCheck className="w-3 h-3" /> : <LuCircleX className="w-3 h-3" />}
                    {customer.isActive ? "Active" : "Blocked"}
                  </button>
                </TableCell>
                <TableCell className="text-right pr-5">
                  <div className="flex items-center justify-end">
                    <button
                      onClick={() => handleOpenEdit(customer)}
                      className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 flex items-center justify-center transition-colors"
                      title="Edit Customer"
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

      {/* EDIT CUSTOMER MODAL */}
      <Modal
        isOpen={!!editingCustomer}
        onOpenChange={(open) => !open && setEditingCustomer(null)}
        title={`Edit Customer: @${editingCustomer?.username}`}
        onSave={handleSubmitEdit}
        saveText="Save Changes"
        isLoading={isSubmitting}
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-[11px] font-bold uppercase text-zinc-500 mb-1">Full Name</label>
            <Input
              type="text"
              required
              value={customerForm.fullName}
              onChange={(e) => setCustomerForm({ ...customerForm, fullName: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase text-zinc-500 mb-1">Username</label>
              <Input
                type="text"
                required
                value={customerForm.username}
                onChange={(e) => setCustomerForm({ ...customerForm, username: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-zinc-500 mb-1">
                New Password (Optional)
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={customerForm.password}
                onChange={(e) => setCustomerForm({ ...customerForm, password: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase text-zinc-500 mb-1">Email Address</label>
              <Input
                type="email"
                required
                value={customerForm.email}
                onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-zinc-500 mb-1">Mobile Number</label>
              <Input
                type="tel"
                value={customerForm.mobile}
                onChange={(e) => setCustomerForm({ ...customerForm, mobile: e.target.value })}
              />
            </div>
          </div>
        </div>
      </Modal>
    </TableLayout>
  );
}
