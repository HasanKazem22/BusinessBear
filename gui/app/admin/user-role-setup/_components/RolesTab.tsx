"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Loader } from "@/components/ui/loader";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Modal } from "@/components/ui/modal";
import { TableLayout } from "@/components/ui/table-layout";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  LuPencil, LuTrash2, LuShield
} from "react-icons/lu";
import { ServerErrorCard } from "@/components/ui/ServerErrorCard";
import { userRoleService } from "@/services/userRoleService";
import { RoleItem } from "@/types/userRole";

export function RolesTab() {
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);

  // Create / Edit Role Modal
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleItem | null>(null);
  const [roleForm, setRoleForm] = useState({ name: "", description: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete Role Modal
  const [deletingRole, setDeletingRole] = useState<RoleItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [error, setError] = useState<any>(null);

  const fetchRoles = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await userRoleService.getRoles();
      setRoles(data);
    } catch (err: any) {
      setError(err);
      toast.error(err?.message || "Failed to load roles.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleOpenCreateModal = () => {
    setEditingRole(null);
    setRoleForm({ name: "", description: "" });
    setShowRoleModal(true);
  };

  const handleOpenEditModal = (role: RoleItem) => {
    setEditingRole(role);
    setRoleForm({ name: role.name, description: role.description || "" });
    setShowRoleModal(true);
  };

  const handleSubmitRole = async () => {
    setIsSubmitting(true);
    try {
      if (editingRole) {
        await userRoleService.updateRole(editingRole.id, roleForm);
        toast.success(`Role '${editingRole.name}' updated!`);
      } else {
        await userRoleService.createRole(roleForm);
        toast.success(`Role '${roleForm.name}' created!`);
      }
      setShowRoleModal(false);
      fetchRoles();
    } catch (err: any) {
      toast.error(err?.message || "Failed to save role.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRole = async () => {
    if (!deletingRole) return;
    setIsDeleting(true);
    try {
      await userRoleService.deleteRole(deletingRole.id);
      toast.success(`Role '${deletingRole.name}' deleted!`);
      setDeletingRole(null);
      fetchRoles();
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete role.");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredRoles = roles.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.description || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedRoles = filteredRoles.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  if (error) return <div className="py-8"><ServerErrorCard error={error} onRetry={fetchRoles} variant="inline" title="Failed to Load Roles" /></div>;

  return (
    <TableLayout
      searchPlaceholder="Search defined roles by name or description..."
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
      createButtonText="Create New Role"
      onCreateClick={handleOpenCreateModal}
      isEmpty={!isLoading && filteredRoles.length === 0}
      emptyTitle="No roles found"
      emptyDescription={searchQuery ? `No roles match "${searchQuery}".` : "No role definitions have been created yet."}
      emptyIcon={LuShield}
      totalItems={filteredRoles.length}
      currentPage={currentPage}
      pageSize={pageSize}
      onPageChange={setCurrentPage}
      onPageSizeChange={setPageSize}
    >
      {/* Roles Table Grid */}
      {isLoading ? (
        <div className="py-12"><Loader text="Loading roles..." variant="inline" /></div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800 text-[11px] uppercase tracking-wider font-bold text-zinc-500">
              <TableHead className="w-1/4">Role Identifier</TableHead>
              <TableHead className="w-1/2">Description</TableHead>
              <TableHead className="w-1/6">Type</TableHead>
              <TableHead className="text-right pr-5 w-20">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-xs">
            {paginatedRoles.map((role) => {
              const isSystemRole = role.name === "ROLE_ADMIN" || role.name === "MANAGER" || role.name === "ROLE_CUSTOMER";
              return (
                <TableRow key={role.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                  <TableCell className="font-mono font-bold text-zinc-900 dark:text-white">
                    <span className="px-2.5 py-1 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200">
                      {role.name}
                    </span>
                  </TableCell>
                  <TableCell className="text-zinc-600 dark:text-zinc-300 max-w-md">
                    {role.description || "No description provided."}
                  </TableCell>
                  <TableCell>
                    {isSystemRole ? (
                      <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        System Default
                      </span>
                    ) : (
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                        Custom Role
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right pr-5">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleOpenEditModal(role)}
                        className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 flex items-center justify-center transition-colors"
                        title="Edit Role"
                      >
                        <LuPencil className="h-3.5 w-3.5" />
                      </button>
                      {!isSystemRole && (
                        <button
                          onClick={() => setDeletingRole(role)}
                          className="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 flex items-center justify-center transition-colors"
                          title="Delete Role"
                        >
                          <LuTrash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      {/* CREATE / EDIT ROLE MODAL */}
      <Modal
        isOpen={showRoleModal}
        onOpenChange={(open) => !open && setShowRoleModal(false)}
        title={editingRole ? `Edit Role: ${editingRole.name}` : "Create New Role"}
        onSave={handleSubmitRole}
        saveText={editingRole ? "Update Role" : "Create Role"}
        isLoading={isSubmitting}
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-[11px] font-bold uppercase text-zinc-500 mb-1">Role Name</label>
            <Input
              type="text"
              required
              placeholder="ROLE_SUPERVISOR"
              value={roleForm.name}
              onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })}
              className="font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase text-zinc-500 mb-1">Description</label>
            <Textarea
              rows={3}
              placeholder="Privileges and responsibilities..."
              value={roleForm.description}
              onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
            />
          </div>
        </div>
      </Modal>

      {/* DELETE CONFIRMATION MODAL */}
      <Modal
        isOpen={!!deletingRole}
        onOpenChange={(open) => !open && setDeletingRole(null)}
        title={`Delete Role: ${deletingRole?.name}`}
        onSave={handleDeleteRole}
        saveText="Confirm Delete"
        isLoading={isDeleting}
      >
        <div className="space-y-4 text-xs">
          <p className="text-zinc-600 dark:text-zinc-300">
            Are you sure you want to delete role <strong className="font-mono">{deletingRole?.name}</strong>? Users assigned to this role will lose associated permissions.
          </p>
        </div>
      </Modal>
    </TableLayout>
  );
}
