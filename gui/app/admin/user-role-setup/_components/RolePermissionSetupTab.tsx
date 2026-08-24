"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import { toast } from "react-hot-toast";
import { Loader } from "@/components/ui/loader";
import { Button } from "@/components/ui/button";
import { Dropdown } from "@/components/ui/dropdown";
import {
  LuSave, LuChevronDown, LuChevronRight, LuHouse, LuPackage, LuBuilding2, LuMail, LuShieldCheck, LuLayers
} from "react-icons/lu";

interface RoleItem {
  id: number;
  name: string;
  description?: string;
}

export function RolePermissionSetupTab() {
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>("ROLE_ADMIN");
  const [permissionTree, setPermissionTree] = useState<Record<string, any>>({});
  const [isLoadingRoles, setIsLoadingRoles] = useState(true);
  const [isLoadingTree, setIsLoadingTree] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Single Accordion State (default "home" is open, opening another collapses previous)
  const [activeAccordion, setActiveAccordion] = useState<string>("home");

  const fetchRoles = async () => {
    setIsLoadingRoles(true);
    try {
      const res = await apiFetch("/admin/roles");
      const list = res || [];
      setRoles(list);
      if (list.length > 0 && !list.some((r: RoleItem) => r.name === selectedRole)) {
        setSelectedRole(list[0].name);
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to fetch roles.");
    } finally {
      setIsLoadingRoles(false);
    }
  };

  const fetchRolePermission = async (roleName: string) => {
    setIsLoadingTree(true);
    try {
      const data = await apiFetch(`/admin/role-permissions/${roleName}`);
      setPermissionTree(data.permissionTree || {});
    } catch (err: any) {
      toast.error(err?.message || `Failed to load permissions for ${roleName}`);
      setPermissionTree({});
    } finally {
      setIsLoadingTree(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    if (selectedRole) {
      fetchRolePermission(selectedRole);
    }
  }, [selectedRole]);

  const handleToggle = (path: string[]) => {
    setPermissionTree((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      let curr = next;
      for (let i = 0; i < path.length - 1; i++) {
        if (!curr[path[i]]) curr[path[i]] = {};
        curr = curr[path[i]];
      }
      const lastKey = path[path.length - 1];
      curr[lastKey] = !curr[lastKey];
      return next;
    });
  };

  const toggleAccordion = (key: string) => {
    setActiveAccordion((prev) => (prev === key ? "" : key));
  };

  const handleSavePermissions = async () => {
    setIsSaving(true);
    try {
      await apiFetch(`/admin/role-permissions/${selectedRole}`, {
        method: "PUT",
        body: JSON.stringify(permissionTree),
      });
      toast.success(`Permission tree saved for '${selectedRole}'!`);
    } catch (err: any) {
      toast.error(err?.message || "Failed to save role permissions.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* TARGET ROLE CONTROL BAR */}
      <div className="p-3 px-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/50 dark:bg-zinc-900/40 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <PermissionBox title="Hero Section">
                <ToggleSwitch label="Show Hero Section" checked={!!permissionTree.home?.sections?.hero?.isHeroSection} onChange={() => handleToggle(["home", "sections", "hero", "isHeroSection"])} />
                <ToggleSwitch label="Create Hero Banner" checked={!!permissionTree.home?.sections?.hero?.isCreate} onChange={() => handleToggle(["home", "sections", "hero", "isCreate"])} />
                <ToggleSwitch label="Update Hero Content" checked={!!permissionTree.home?.sections?.hero?.isUpdate} onChange={() => handleToggle(["home", "sections", "hero", "isUpdate"])} />
                <ToggleSwitch label="Delete Hero Banner" checked={!!permissionTree.home?.sections?.hero?.isDelete} onChange={() => handleToggle(["home", "sections", "hero", "isDelete"])} />
              </PermissionBox>

              <PermissionBox title="Services Section">
                <ToggleSwitch label="Show Services Section" checked={!!permissionTree.home?.sections?.services?.isServiceSection} onChange={() => handleToggle(["home", "sections", "services", "isServiceSection"])} />
                <ToggleSwitch label="Create Service Card" checked={!!permissionTree.home?.sections?.services?.isCreate} onChange={() => handleToggle(["home", "sections", "services", "isCreate"])} />
                <ToggleSwitch label="Update Service Card" checked={!!permissionTree.home?.sections?.services?.isUpdate} onChange={() => handleToggle(["home", "sections", "services", "isUpdate"])} />
                <ToggleSwitch label="Delete Service Card" checked={!!permissionTree.home?.sections?.services?.isDelete} onChange={() => handleToggle(["home", "sections", "services", "isDelete"])} />
              </PermissionBox>

              <PermissionBox title="About Us Section">
                <ToggleSwitch label="Show About Us Section" checked={!!permissionTree.home?.sections?.aboutUs?.isAboutUsSection} onChange={() => handleToggle(["home", "sections", "aboutUs", "isAboutUsSection"])} />
                <ToggleSwitch label="Update Profile & Bio" checked={!!permissionTree.home?.sections?.aboutUs?.isUpdate} onChange={() => handleToggle(["home", "sections", "aboutUs", "isUpdate"])} />
              </PermissionBox>

              <PermissionBox title="Admin Setup Cards">
                <ToggleSwitch label="Show Setup Cards Section" checked={!!permissionTree.home?.sections?.adminSetupCards?.isCardsSection} onChange={() => handleToggle(["home", "sections", "adminSetupCards", "isCardsSection"])} />
                <ToggleSwitch label="Update Setup Cards Info" checked={!!permissionTree.home?.sections?.adminSetupCards?.isUpdateCardInfo} onChange={() => handleToggle(["home", "sections", "adminSetupCards", "isUpdateCardInfo"])} />
                <ToggleSwitch label="Create Admin Card" checked={!!permissionTree.home?.sections?.adminSetupCards?.isCreateCard} onChange={() => handleToggle(["home", "sections", "adminSetupCards", "isCreateCard"])} />
              </PermissionBox>
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
            <PermissionBox title="Product Management & Sales Actions">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                <ToggleSwitch label="Create New Product" checked={!!permissionTree.product?.actions?.isCreateProduct} onChange={() => handleToggle(["product", "actions", "isCreateProduct"])} />
                <ToggleSwitch label="Update Product Info" checked={!!permissionTree.product?.actions?.isUpdateProduct} onChange={() => handleToggle(["product", "actions", "isUpdateProduct"])} />
                <ToggleSwitch label="Delete Product" checked={!!permissionTree.product?.actions?.isDeleteProduct} onChange={() => handleToggle(["product", "actions", "isDeleteProduct"])} />
                <ToggleSwitch label="Manage Stock Quantity" checked={!!permissionTree.product?.actions?.isManageStock} onChange={() => handleToggle(["product", "actions", "isManageStock"])} />
                <ToggleSwitch label="Record Direct Sale (POS)" checked={!!permissionTree.product?.actions?.isRecordSale} onChange={() => handleToggle(["product", "actions", "isRecordSale"])} />
              </div>
            </PermissionBox>
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
            <PermissionBox title="Property Listing & Booking Management">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                <ToggleSwitch label="Create Real Estate Asset" checked={!!permissionTree.realAsset?.actions?.isCreateAsset} onChange={() => handleToggle(["realAsset", "actions", "isCreateAsset"])} />
                <ToggleSwitch label="Update Property Details" checked={!!permissionTree.realAsset?.actions?.isUpdateAsset} onChange={() => handleToggle(["realAsset", "actions", "isUpdateAsset"])} />
                <ToggleSwitch label="Delete Property Asset" checked={!!permissionTree.realAsset?.actions?.isDeleteAsset} onChange={() => handleToggle(["realAsset", "actions", "isDeleteAsset"])} />
                <ToggleSwitch label="Manage Asset Bookings" checked={!!permissionTree.realAsset?.actions?.isManageBookings} onChange={() => handleToggle(["realAsset", "actions", "isManageBookings"])} />
                <ToggleSwitch label="Toggle Featured Status" checked={!!permissionTree.realAsset?.actions?.isToggleFeatured} onChange={() => handleToggle(["realAsset", "actions", "isToggleFeatured"])} />
              </div>
            </PermissionBox>
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
            <PermissionBox title="Client Inquiries & Responses">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                <ToggleSwitch label="View Contact Messages" checked={!!permissionTree.contactMessage?.actions?.isViewMessages} onChange={() => handleToggle(["contactMessage", "actions", "isViewMessages"])} />
                <ToggleSwitch label="Reply to Message" checked={!!permissionTree.contactMessage?.actions?.isReplyMessage} onChange={() => handleToggle(["contactMessage", "actions", "isReplyMessage"])} />
                <ToggleSwitch label="Delete Message" checked={!!permissionTree.contactMessage?.actions?.isDeleteMessage} onChange={() => handleToggle(["contactMessage", "actions", "isDeleteMessage"])} />
              </div>
            </PermissionBox>
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
            <PermissionBox title="Administrative Delegation Rights">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                <ToggleSwitch label="Create New Roles" checked={!!permissionTree.userRoleSetup?.actions?.canCreateRole} onChange={() => handleToggle(["userRoleSetup", "actions", "canCreateRole"])} />
                <ToggleSwitch label="Create New Users" checked={!!permissionTree.userRoleSetup?.actions?.canCreateUser} onChange={() => handleToggle(["userRoleSetup", "actions", "canCreateUser"])} />
                <ToggleSwitch label="Grant Admin Permission Trees" checked={!!permissionTree.userRoleSetup?.actions?.canGiveAdminPermission} onChange={() => handleToggle(["userRoleSetup", "actions", "canGiveAdminPermission"])} />
              </div>
            </PermissionBox>
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
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-900 shadow-sm transition-all">
      <div className="p-3.5 bg-zinc-50 dark:bg-zinc-800/40 flex items-center justify-between cursor-pointer select-none" onClick={onToggle}>
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

      {isOpen && <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 space-y-4 bg-white dark:bg-zinc-900">{children}</div>}
    </div>
  );
}

function PermissionBox({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-900/40 space-y-2">
      <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 border-b border-zinc-200 dark:border-zinc-800 pb-1">
        {title}
      </h4>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function ToggleSwitch({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center justify-between p-2 rounded-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all cursor-pointer select-none">
      <span className="text-xs text-zinc-800 dark:text-zinc-200 font-medium">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={(e) => {
          e.preventDefault();
          onChange();
        }}
        className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ${
          checked ? "bg-emerald-500" : "bg-zinc-200 dark:bg-zinc-700"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-3 w-3 rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ${
            checked ? "translate-x-3" : "translate-x-0"
          }`}
        />
      </button>
    </label>
  );
}
