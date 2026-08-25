"use client";

import { useState, useEffect } from "react";
import {
  LuSave,
  LuLayers,
  LuHouse,
  LuPackage,
  LuBuilding2,
  LuMail,
  LuShieldCheck,
  LuChevronDown,
  LuChevronRight,
  LuLock
} from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { Dropdown } from "@/components/ui/dropdown";
import { Loader } from "@/components/ui/loader";
import { toast } from "react-hot-toast";

import { userRoleService } from "@/services/userRoleService";
import { RoleItem } from "@/types/userRole";

export function RolePermissionSetupTab() {
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>("ROLE_CUSTOMER");

  const [permissionTree, setPermissionTree] = useState<Record<string, any>>({});
  const [isLoadingRoles, setIsLoadingRoles] = useState(true);
  const [isLoadingTree, setIsLoadingTree] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Accordion toggle state: 1 module open at a time
  const [activeAccordion, setActiveAccordion] = useState<
    "home" | "product" | "realAsset" | "contactMessage" | "userRoleSetup" | null
  >("home");

  const toggleAccordion = (
    module: "home" | "product" | "realAsset" | "contactMessage" | "userRoleSetup"
  ) => {
    setActiveAccordion((prev) => (prev === module ? null : module));
  };

  // Fetch initial role list
  useEffect(() => {
    fetchRoles();
  }, []);

  // Fetch permission tree whenever selectedRole changes
  useEffect(() => {
    if (selectedRole) {
      fetchPermissionTree(selectedRole);
    }
  }, [selectedRole]);

  const fetchRoles = async () => {
    setIsLoadingRoles(true);
    try {
      const data = await userRoleService.getRoles();
      if (data && Array.isArray(data)) {
        setRoles(data);
        if (data.length > 0 && !selectedRole) {
          setSelectedRole(data[0].name);
        }
      }
    } catch (err) {
      toast.error("Failed to load user roles");
    } finally {
      setIsLoadingRoles(false);
    }
  };

  const fetchPermissionTree = async (roleName: string) => {
    setIsLoadingTree(true);
    try {
      const res = await userRoleService.getRolePermission(roleName);
      if (res && res.permissionTree) {
        setPermissionTree(res.permissionTree);
      } else if (res && typeof res === "object") {
        setPermissionTree(res);
      }
    } catch (err) {
      toast.error("Failed to load permission tree for " + roleName);
    } finally {
      setIsLoadingTree(false);
    }
  };

  const handleSavePermissions = async () => {
    if (!selectedRole) return;
    setIsSaving(true);
    try {
      await userRoleService.updateRolePermission(selectedRole, permissionTree);
      toast.success(`Permission tree updated for ${selectedRole}`);
    } catch (err) {
      toast.error("Error saving permission tree");
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggle = (path: string[]) => {
    setPermissionTree((prev) => {
      const clone = JSON.parse(JSON.stringify(prev));
      let curr = clone;
      for (let i = 0; i < path.length - 1; i++) {
        if (!curr[path[i]]) curr[path[i]] = {};
        curr = curr[path[i]];
      }
      const lastKey = path[path.length - 1];
      curr[lastKey] = !curr[lastKey];
      return clone;
    });
  };

  return (
    <div className="space-y-4 font-sans">
      {/* TARGET ROLE CONTROL BAR */}
      <div className="relative z-30 p-3 px-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/50 dark:bg-zinc-900/40 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
          <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 text-zinc-900 dark:text-white flex items-center justify-center font-bold shrink-0 shadow-inner">
            <LuLayers className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-2.5 flex-1 w-full sm:w-auto">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 shrink-0">
              Target Role:
            </span>
            {isLoadingRoles ? (
              <span className="text-xs text-zinc-400">Loading roles...</span>
            ) : (
              <Dropdown
                options={roles.map((r) => ({
                  value: r.name,
                  label: r.name,
                  sublabel: r.description,
                }))}
                value={selectedRole}
                onChange={(val) => setSelectedRole(val)}
                className="w-full sm:w-72 font-mono text-xs"
              />
            )}
          </div>
        </div>

        {/* Save Permission Button */}
        <div className="shrink-0 w-full sm:w-auto">
          <Button
            onClick={handleSavePermissions}
            disabled={isSaving || isLoadingTree}
            className="w-full sm:w-auto h-8 text-xs font-bold gap-1.5 px-3.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 shadow-xs transition-all"
          >
            <LuSave className="w-4 h-4" /> Save Permission Tree
          </Button>
        </div>
      </div>

      {/* ACCORDION MODULE SECTIONS (1 OPEN AT A TIME) */}
      {isLoadingTree ? (
        <div className="py-12"><Loader text={`Fetching permission tree for ${selectedRole}...`} variant="inline" /></div>
      ) : (
        <div className="space-y-3">

          {/* 1. HOME MODULE */}
          <AccordionSection
            title="1. Home Module Permissions"
            icon={<LuHouse className="w-4 h-4 text-zinc-500" />}
            isOpen={activeAccordion === "home"}
            onToggle={() => toggleAccordion("home")}
            masterChecked={!!permissionTree.home?.isHomePage}
            onMasterToggle={() => handleToggle(["home", "isHomePage"])}
          >
            <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/80 overflow-hidden divide-y divide-zinc-100 dark:divide-zinc-800/60 shadow-2xs">
              {/* Category: Hero */}
              <CategoryHeader title="Hero Section" />
              <PermissionRow
                label="Show Hero Section"
                keyName="home.sections.hero.isHeroSection"
                checked={!!permissionTree.home?.sections?.hero?.isHeroSection}
                onChange={() => handleToggle(["home", "sections", "hero", "isHeroSection"])}
              />

              {/* Category: Services */}
              <CategoryHeader title="Services Section" />
              <PermissionRow
                label="Show Services Section"
                keyName="home.sections.services.isServiceSection"
                checked={!!permissionTree.home?.sections?.services?.isServiceSection}
                onChange={() => handleToggle(["home", "sections", "services", "isServiceSection"])}
              />
              <PermissionRow
                label="Create Service Card"
                keyName="home.sections.services.isCreate"
                checked={!!permissionTree.home?.sections?.services?.isCreate}
                onChange={() => handleToggle(["home", "sections", "services", "isCreate"])}
              />
              <PermissionRow
                label="Update Service Card"
                keyName="home.sections.services.isUpdate"
                checked={!!permissionTree.home?.sections?.services?.isUpdate}
                onChange={() => handleToggle(["home", "sections", "services", "isUpdate"])}
              />
              <PermissionRow
                label="Delete Service Card"
                keyName="home.sections.services.isDelete"
                checked={!!permissionTree.home?.sections?.services?.isDelete}
                onChange={() => handleToggle(["home", "sections", "services", "isDelete"])}
              />

              {/* Category: About Us */}
              <CategoryHeader title="About Us Section" />
              <PermissionRow
                label="Show About Us Section"
                keyName="home.sections.aboutUs.isAboutUsSection"
                checked={!!permissionTree.home?.sections?.aboutUs?.isAboutUsSection}
                onChange={() => handleToggle(["home", "sections", "aboutUs", "isAboutUsSection"])}
              />

              {/* Category: Contact */}
              <CategoryHeader title="Contact Section" />
              <PermissionRow
                label="Show Contact Section"
                keyName="home.sections.contactSection.isContactSection"
                checked={!!permissionTree.home?.sections?.contactSection?.isContactSection}
                onChange={() => handleToggle(["home", "sections", "contactSection", "isContactSection"])}
              />
            </div>
          </AccordionSection>

          {/* 2. PRODUCT MODULE */}
          <AccordionSection
            title="2. Product Module Permissions"
            icon={<LuPackage className="w-4 h-4 text-zinc-500" />}
            isOpen={activeAccordion === "product"}
            onToggle={() => toggleAccordion("product")}
            masterChecked={!!permissionTree.product?.isProductPage}
            onMasterToggle={() => handleToggle(["product", "isProductPage"])}
          >
            <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/80 overflow-hidden divide-y divide-zinc-100 dark:divide-zinc-800/60 shadow-2xs">
              <CategoryHeader title="Product Management & Sales Actions" />
              <PermissionRow
                label="Create New Product"
                keyName="product.actions.isCreateProduct"
                checked={!!permissionTree.product?.actions?.isCreateProduct}
                onChange={() => handleToggle(["product", "actions", "isCreateProduct"])}
              />
              <PermissionRow
                label="Update Product Information"
                keyName="product.actions.isUpdateProduct"
                checked={!!permissionTree.product?.actions?.isUpdateProduct}
                onChange={() => handleToggle(["product", "actions", "isUpdateProduct"])}
              />
              <PermissionRow
                label="Delete Product"
                keyName="product.actions.isDeleteProduct"
                checked={!!permissionTree.product?.actions?.isDeleteProduct}
                onChange={() => handleToggle(["product", "actions", "isDeleteProduct"])}
              />
              <PermissionRow
                label="Manage Product Stock Quantity"
                keyName="product.actions.isManageStock"
                checked={!!permissionTree.product?.actions?.isManageStock}
                onChange={() => handleToggle(["product", "actions", "isManageStock"])}
              />
              <PermissionRow
                label="Record Direct Sale (POS)"
                keyName="product.actions.isRecordSale"
                checked={!!permissionTree.product?.actions?.isRecordSale}
                onChange={() => handleToggle(["product", "actions", "isRecordSale"])}
              />
            </div>
          </AccordionSection>

          {/* 3. REAL ASSET MODULE */}
          <AccordionSection
            title="3. Real Asset Module Permissions"
            icon={<LuBuilding2 className="w-4 h-4 text-zinc-500" />}
            isOpen={activeAccordion === "realAsset"}
            onToggle={() => toggleAccordion("realAsset")}
            masterChecked={!!permissionTree.realAsset?.isRealAssetPage}
            onMasterToggle={() => handleToggle(["realAsset", "isRealAssetPage"])}
          >
            <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/80 overflow-hidden divide-y divide-zinc-100 dark:divide-zinc-800/60 shadow-2xs">
              <CategoryHeader title="Property Listing & Booking Management" />
              <PermissionRow
                label="Create Real Estate Property"
                keyName="realAsset.actions.isCreateAsset"
                checked={!!permissionTree.realAsset?.actions?.isCreateAsset}
                onChange={() => handleToggle(["realAsset", "actions", "isCreateAsset"])}
              />
              <PermissionRow
                label="Update Property Details"
                keyName="realAsset.actions.isUpdateAsset"
                checked={!!permissionTree.realAsset?.actions?.isUpdateAsset}
                onChange={() => handleToggle(["realAsset", "actions", "isUpdateAsset"])}
              />
              <PermissionRow
                label="Delete Property Asset"
                keyName="realAsset.actions.isDeleteAsset"
                checked={!!permissionTree.realAsset?.actions?.isDeleteAsset}
                onChange={() => handleToggle(["realAsset", "actions", "isDeleteAsset"])}
              />
              <PermissionRow
                label="Manage Asset Bookings & Inquiries"
                keyName="realAsset.actions.isManageBookings"
                checked={!!permissionTree.realAsset?.actions?.isManageBookings}
                onChange={() => handleToggle(["realAsset", "actions", "isManageBookings"])}
              />
              <PermissionRow
                label="Toggle Featured Property Status"
                keyName="realAsset.actions.isToggleFeatured"
                checked={!!permissionTree.realAsset?.actions?.isToggleFeatured}
                onChange={() => handleToggle(["realAsset", "actions", "isToggleFeatured"])}
              />
            </div>
          </AccordionSection>

          {/* 4. CONTACT MESSAGES MODULE */}
          <AccordionSection
            title="4. Contact Messages Module"
            icon={<LuMail className="w-4 h-4 text-zinc-500" />}
            isOpen={activeAccordion === "contactMessage"}
            onToggle={() => toggleAccordion("contactMessage")}
            masterChecked={!!permissionTree.contactMessage?.isMessagePage}
            onMasterToggle={() => handleToggle(["contactMessage", "isMessagePage"])}
          >
            <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/80 overflow-hidden divide-y divide-zinc-100 dark:divide-zinc-800/60 shadow-2xs">
              <CategoryHeader title="Client Inquiries & Messages" />
              <PermissionRow
                label="View Contact Messages"
                keyName="contactMessage.actions.isViewMessages"
                checked={!!permissionTree.contactMessage?.actions?.isViewMessages}
                onChange={() => handleToggle(["contactMessage", "actions", "isViewMessages"])}
              />
              <PermissionRow
                label="Reply to Customer Message"
                keyName="contactMessage.actions.isReplyMessage"
                checked={!!permissionTree.contactMessage?.actions?.isReplyMessage}
                onChange={() => handleToggle(["contactMessage", "actions", "isReplyMessage"])}
              />
              <PermissionRow
                label="Delete Customer Message"
                keyName="contactMessage.actions.isDeleteMessage"
                checked={!!permissionTree.contactMessage?.actions?.isDeleteMessage}
                onChange={() => handleToggle(["contactMessage", "actions", "isDeleteMessage"])}
              />
            </div>
          </AccordionSection>

          {/* 5. USER & ROLE SETUP MODULE */}
          <AccordionSection
            title="5. User & Role Setup Module"
            icon={<LuShieldCheck className="w-4 h-4 text-zinc-500" />}
            isOpen={activeAccordion === "userRoleSetup"}
            onToggle={() => toggleAccordion("userRoleSetup")}
            masterChecked={!!permissionTree.userRoleSetup?.isUserRolePage}
            onMasterToggle={() => handleToggle(["userRoleSetup", "isUserRolePage"])}
          >
            <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/80 overflow-hidden divide-y divide-zinc-100 dark:divide-zinc-800/60 shadow-2xs">
              {/* Category: System Users */}
              <CategoryHeader title="System Users Management" />
              <PermissionRow
                label="Show System Users Tab"
                keyName="userRoleSetup.systemUser.isSystemUser"
                checked={!!permissionTree.userRoleSetup?.systemUser?.isSystemUser}
                onChange={() => handleToggle(["userRoleSetup", "systemUser", "isSystemUser"])}
              />
              <PermissionRow
                label="Create System User Account"
                keyName="userRoleSetup.systemUser.isCreate"
                checked={!!permissionTree.userRoleSetup?.systemUser?.isCreate}
                onChange={() => handleToggle(["userRoleSetup", "systemUser", "isCreate"])}
              />
              <PermissionRow
                label="Update System User Account"
                keyName="userRoleSetup.systemUser.isUpdate"
                checked={!!permissionTree.userRoleSetup?.systemUser?.isUpdate}
                onChange={() => handleToggle(["userRoleSetup", "systemUser", "isUpdate"])}
              />
              <PermissionRow
                label="Delete System User Account"
                keyName="userRoleSetup.systemUser.isDelete"
                checked={!!permissionTree.userRoleSetup?.systemUser?.isDelete}
                onChange={() => handleToggle(["userRoleSetup", "systemUser", "isDelete"])}
              />

              {/* Category: Customer Users */}
              <CategoryHeader title="Customer Users Management" />
              <PermissionRow
                label="Show Customer Users Tab"
                keyName="userRoleSetup.customerUser.isCustomerUser"
                checked={!!permissionTree.userRoleSetup?.customerUser?.isCustomerUser}
                onChange={() => handleToggle(["userRoleSetup", "customerUser", "isCustomerUser"])}
              />
              <PermissionRow
                label="Update Customer Account Details"
                keyName="userRoleSetup.customerUser.isUpdate"
                checked={!!permissionTree.userRoleSetup?.customerUser?.isUpdate}
                onChange={() => handleToggle(["userRoleSetup", "customerUser", "isUpdate"])}
              />
              <PermissionRow
                label="Delete Customer Account"
                keyName="userRoleSetup.customerUser.isDelete"
                checked={!!permissionTree.userRoleSetup?.customerUser?.isDelete}
                onChange={() => handleToggle(["userRoleSetup", "customerUser", "isDelete"])}
              />

              {/* Category: Role Management */}
              <CategoryHeader title="Role Management" />
              <PermissionRow
                label="Show Role Management Tab"
                keyName="userRoleSetup.roleManagement.isRoleManagement"
                checked={!!permissionTree.userRoleSetup?.roleManagement?.isRoleManagement}
                onChange={() => handleToggle(["userRoleSetup", "roleManagement", "isRoleManagement"])}
              />
              <PermissionRow
                label="Create New Role"
                keyName="userRoleSetup.roleManagement.isCreate"
                checked={!!permissionTree.userRoleSetup?.roleManagement?.isCreate}
                onChange={() => handleToggle(["userRoleSetup", "roleManagement", "isCreate"])}
              />
              <PermissionRow
                label="Update Existing Role"
                keyName="userRoleSetup.roleManagement.isUpdate"
                checked={!!permissionTree.userRoleSetup?.roleManagement?.isUpdate}
                onChange={() => handleToggle(["userRoleSetup", "roleManagement", "isUpdate"])}
              />
              <PermissionRow
                label="Delete Role"
                keyName="userRoleSetup.roleManagement.isDelete"
                checked={!!permissionTree.userRoleSetup?.roleManagement?.isDelete}
                onChange={() => handleToggle(["userRoleSetup", "roleManagement", "isDelete"])}
              />

              {/* Category: Role Permission Setup */}
              <CategoryHeader title="Role Permission Setup" />
              <PermissionRow
                label="Show Role Permission Setup Tab"
                keyName="userRoleSetup.rolePermissionSetup.isRolePermissionSetup"
                checked={!!permissionTree.userRoleSetup?.rolePermissionSetup?.isRolePermissionSetup}
                onChange={() => handleToggle(["userRoleSetup", "rolePermissionSetup", "isRolePermissionSetup"])}
              />
              <PermissionRow
                label="Update Role Permissions Tree"
                keyName="userRoleSetup.rolePermissionSetup.isUpdate"
                checked={!!permissionTree.userRoleSetup?.rolePermissionSetup?.isUpdate}
                onChange={() => handleToggle(["userRoleSetup", "rolePermissionSetup", "isUpdate"])}
              />
            </div>
          </AccordionSection>

        </div>
      )}
    </div>
  );
}

function AccordionSection({
  title,
  icon,
  isOpen,
  onToggle,
  masterChecked,
  onMasterToggle,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  masterChecked: boolean;
  onMasterToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/50 dark:bg-zinc-900/40 backdrop-blur-md overflow-hidden shadow-2xs transition-all">
      <div
        onClick={onToggle}
        className="p-3.5 px-4 flex items-center justify-between cursor-pointer select-none bg-zinc-50/50 dark:bg-zinc-950/30 hover:bg-zinc-100/60 dark:hover:bg-zinc-900/60 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="text-zinc-500">{isOpen ? <LuChevronDown className="w-4 h-4" /> : <LuChevronRight className="w-4 h-4" />}</div>
          <div className="flex items-center gap-2 font-bold text-xs text-zinc-900 dark:text-white">
            {icon} {title}
          </div>
        </div>

        <div onClick={(e) => e.stopPropagation()}>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <span className="text-[10px] uppercase font-bold text-zinc-500">Module Access</span>
            <input
              type="checkbox"
              checked={masterChecked}
              onChange={onMasterToggle}
              className="w-4 h-4 accent-zinc-900 dark:accent-white rounded cursor-pointer"
            />
          </label>
        </div>
      </div>

      {isOpen && <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 space-y-4 bg-white dark:bg-zinc-950/40">{children}</div>}
    </div>
  );
}

function CategoryHeader({ title }: { title: string }) {
  return (
    <div className="bg-zinc-100/70 dark:bg-zinc-950/80 px-4 py-2 text-[10px] font-extrabold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 border-y border-zinc-200/60 dark:border-zinc-800/60 first:border-t-0">
      {title}
    </div>
  );
}

function PermissionRow({
  label,
  keyName,
  checked,
  onChange,
}: {
  label: string;
  keyName?: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="px-4 py-2.5 flex items-center justify-between gap-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
      <div className="min-w-0 flex-1">
        <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
          {label}
        </div>
        {keyName && (
          <div className="text-[10px] font-mono text-zinc-400 truncate mt-0.5">
            {keyName}
          </div>
        )}
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ${
          checked ? "bg-emerald-500" : "bg-zinc-200 dark:bg-zinc-700"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-md ring-0 transition-transform duration-200 ${
            checked ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
