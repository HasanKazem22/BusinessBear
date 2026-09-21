"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Loader } from "@/components/ui/loader";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { TableLayout } from "@/components/ui/table-layout";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  LuCircleCheck, LuCircleX, LuPencil, LuTrash2, LuUserCheck, LuMapPin
} from "react-icons/lu";
import { useAuth } from "@/context/AuthContext";
import { ServerErrorCard } from "@/components/ui/ServerErrorCard";
import { userRoleService } from "@/services/userRoleService";
import { CustomerUserItem } from "@/types/userRole";

export function CustomerUsersTab() {
  const { can, hasRole } = useAuth();
  const canUpdate = hasRole("ADMIN") || can("userRoleSetup.subModules.customerUser.actions.isUpdate");
  const canDelete = hasRole("ADMIN") || can("userRoleSetup.subModules.customerUser.actions.isDelete");

  const [customers, setCustomers] = useState<CustomerUserItem[]>([]);
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
    address: "",
    city: "",
    postalCode: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete Customer Modal State
  const [deletingCustomer, setDeletingCustomer] = useState<CustomerUserItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [error, setError] = useState<any>(null);

  const fetchCustomers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await userRoleService.getCustomers();
      setCustomers(data);
    } catch (err: any) {
      setError(err);
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
      address: customer.address || "",
      city: customer.city || "",
      postalCode: customer.postalCode || "",
      password: "",
    });
  };

  const handleToggleStatus = async (user: CustomerUserItem) => {
    try {
      const nextStatus = !user.isActive;
      await userRoleService.toggleCustomerStatus(user.id, nextStatus);
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
      await userRoleService.updateCustomer(editingCustomer.id, customerForm);
      toast.success(`Customer account '${customerForm.username}' updated!`);
      setEditingCustomer(null);
      fetchCustomers();
    } catch (err: any) {
      toast.error(err?.message || "Failed to update customer account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCustomer = async () => {
    if (!deletingCustomer) return;
    setIsDeleting(true);
    try {
      await userRoleService.deleteCustomer(deletingCustomer.id);
      toast.success(`Customer account '@${deletingCustomer.username}' deleted successfully!`);
      setDeletingCustomer(null);
      fetchCustomers();
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete customer account.");
    } finally {
      setIsDeleting(false);
    }
  };

  const safeCustomers = Array.isArray(customers) ? customers : [];
  const filteredCustomers = safeCustomers.filter((c) =>
    (c.fullName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.username || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.mobile || "").includes(searchQuery) ||
    (c.city || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  if (error) return <div className="py-8"><ServerErrorCard error={error} onRetry={fetchCustomers} variant="inline" title="Failed to Load Customer Accounts" /></div>;

  return (
    <TableLayout
      searchPlaceholder="Search customers by name, username, city..."
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
      isEmpty={!isLoading && filteredCustomers.length === 0}
      emptyTitle="No customer accounts found"
      emptyDescription={searchQuery ? `No customers match "${searchQuery}".` : "No registered customer accounts exist."}
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
              <TableHead className="w-1/4">Customer Profile</TableHead>
              <TableHead className="w-1/4">Contact</TableHead>
              <TableHead className="w-1/4">Location</TableHead>
              <TableHead className="w-28">Status</TableHead>
              <TableHead className="text-right pr-5 w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-xs">
            {paginatedCustomers.map((customer) => (
              <TableRow key={customer.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                <TableCell className="font-semibold text-zinc-900 dark:text-white">
                  <div className="font-bold">{customer.fullName || customer.username}</div>
                  <div className="text-[11px] font-mono text-zinc-400">@{customer.username}</div>
                </TableCell>
                <TableCell className="text-zinc-600 dark:text-zinc-300">
                  <div>{customer.email || "N/A"}</div>
                  <div className="text-[11px] text-zinc-400">{customer.mobile || "N/A"}</div>
                </TableCell>
                <TableCell className="text-zinc-600 dark:text-zinc-300">
                  <div className="flex items-center gap-1">
                    <LuMapPin className="w-3 h-3 text-zinc-400" />
                    <span>{customer.city ? `${customer.city}, ${customer.postalCode || ""}` : "N/A"}</span>
                  </div>
                  {customer.address && <div className="text-[10px] text-zinc-400 truncate max-w-xs">{customer.address}</div>}
                </TableCell>
                <TableCell>
                  <button
                    onClick={() => canUpdate && handleToggleStatus(customer)}
                    disabled={!canUpdate}
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase transition-all ${
                      customer.isActive
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                        : "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"
                    } ${canUpdate ? "cursor-pointer" : "opacity-75 cursor-not-allowed"}`}
                  >
                    {customer.isActive ? <LuCircleCheck className="w-3 h-3" /> : <LuCircleX className="w-3 h-3" />}
                    {customer.isActive ? "Active" : "Blocked"}
                  </button>
                </TableCell>
                <TableCell className="text-right pr-5">
                  <div className="flex items-center justify-end gap-1.5">
                    {canUpdate && (
                      <button
                        onClick={() => handleOpenEdit(customer)}
                        className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 flex items-center justify-center transition-colors"
                        title="Edit Customer Profile"
                      >
                        <LuPencil className="h-3.5 w-3.5" />
                      </button>
                    )}
                    {canDelete && (
                      <button
                        onClick={() => setDeletingCustomer(customer)}
                        className="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center transition-colors"
                        title="Delete Customer Account"
                      >
                        <LuTrash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
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
        title={`Edit Customer Profile: @${editingCustomer?.username}`}
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase text-zinc-500 mb-1">City / Region</label>
              <Input
                type="text"
                placeholder="e.g. Dhaka"
                value={customerForm.city}
                onChange={(e) => setCustomerForm({ ...customerForm, city: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-zinc-500 mb-1">Postal Code</label>
              <Input
                type="text"
                placeholder="1205"
                value={customerForm.postalCode}
                onChange={(e) => setCustomerForm({ ...customerForm, postalCode: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase text-zinc-500 mb-1">Shipping Address</label>
            <Input
              type="text"
              placeholder="House #, Street, Area..."
              value={customerForm.address}
              onChange={(e) => setCustomerForm({ ...customerForm, address: e.target.value })}
            />
          </div>
        </div>
      </Modal>

      {/* DELETE CUSTOMER MODAL */}
      <Modal
        isOpen={!!deletingCustomer}
        onOpenChange={(open) => !open && setDeletingCustomer(null)}
        title="Confirm Delete Customer Account"
        onSave={handleDeleteCustomer}
        saveText="Delete Customer"
        isLoading={isDeleting}
      >
        <p className="text-xs text-zinc-600 dark:text-zinc-300">
          Are you sure you want to permanently delete customer account{" "}
          <strong className="text-zinc-900 dark:text-white font-mono">@{deletingCustomer?.username}</strong>?
          This action cannot be undone.
        </p>
      </Modal>
    </TableLayout>
  );
}
