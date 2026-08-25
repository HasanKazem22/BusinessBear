import { apiFetch } from "@/lib/api";
import {
  SystemUserItem,
  CustomerUserItem,
  RoleItem,
  AdminUserForm,
  CustomerUserForm,
  CreateRoleForm,
  RolePermissionItem,
} from "@/types/userRole";

export const userRoleService = {
  // --- System Users ---
  getSystemUsers: async (): Promise<SystemUserItem[]> => {
    const res = await apiFetch("/admin/users");
    const list = Array.isArray(res) ? res : res?.content || [];
    return list.filter((u: SystemUserItem) =>
      u.roles?.some((r) => r.name !== "ROLE_CUSTOMER") || u.roles?.length === 0
    );
  },

  createSystemUser: async (form: AdminUserForm): Promise<SystemUserItem> => {
    return apiFetch("/admin/users", {
      method: "POST",
      body: JSON.stringify(form),
    });
  },

  updateSystemUser: async (id: number, form: AdminUserForm): Promise<SystemUserItem> => {
    return apiFetch(`/admin/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(form),
    });
  },

  toggleUserStatus: async (id: number, isActive: boolean): Promise<SystemUserItem> => {
    return apiFetch(`/admin/users/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ isActive }),
    });
  },

  deleteSystemUser: async (id: number): Promise<void> => {
    return apiFetch(`/admin/users/${id}`, {
      method: "DELETE",
    });
  },

  // --- Customers ---
  getCustomers: async (): Promise<CustomerUserItem[]> => {
    const res = await apiFetch("/admin/customers");
    return Array.isArray(res) ? res : res?.content || [];
  },

  updateCustomer: async (id: number, form: CustomerUserForm): Promise<CustomerUserItem> => {
    return apiFetch(`/admin/customers/${id}`, {
      method: "PUT",
      body: JSON.stringify(form),
    });
  },

  toggleCustomerStatus: async (id: number, isActive: boolean): Promise<CustomerUserItem> => {
    return apiFetch(`/admin/customers/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ isActive }),
    });
  },

  deleteCustomer: async (id: number): Promise<void> => {
    return apiFetch(`/admin/customers/${id}`, {
      method: "DELETE",
    });
  },

  // --- Roles ---
  getRoles: async (): Promise<RoleItem[]> => {
    const res = await apiFetch("/admin/roles");
    return Array.isArray(res) ? res : res?.content || [];
  },

  createRole: async (form: CreateRoleForm): Promise<RoleItem> => {
    return apiFetch("/admin/roles", {
      method: "POST",
      body: JSON.stringify(form),
    });
  },

  updateRole: async (id: number, form: CreateRoleForm): Promise<RoleItem> => {
    return apiFetch(`/admin/roles/${id}`, {
      method: "PUT",
      body: JSON.stringify(form),
    });
  },

  deleteRole: async (id: number): Promise<void> => {
    return apiFetch(`/admin/roles/${id}`, {
      method: "DELETE",
    });
  },

  // --- Role Permission Tree ---
  getRolePermission: async (roleName: string): Promise<RolePermissionItem> => {
    return apiFetch(`/admin/role-permissions/${roleName}`);
  },

  updateRolePermission: async (roleName: string, permissionTree: Record<string, any>): Promise<RolePermissionItem> => {
    return apiFetch(`/admin/role-permissions/${roleName}`, {
      method: "PUT",
      body: JSON.stringify(permissionTree),
    });
  },
};
