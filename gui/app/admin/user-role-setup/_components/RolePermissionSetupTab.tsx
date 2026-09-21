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
  LuLock,
  LuTv,
  LuRocket
} from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { Dropdown } from "@/components/ui/dropdown";
import { Loader } from "@/components/ui/loader";
import { toast } from "react-hot-toast";

import { userRoleService } from "@/services/userRoleService";
import { RoleItem } from "@/types/userRole";

export function RolePermissionSetupTab() {
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>("CUSTOMER");

  const [permissionTree, setPermissionTree] = useState<Record<string, any>>({});
  const [isLoadingRoles, setIsLoadingRoles] = useState(true);
  const [isLoadingTree, setIsLoadingTree] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [activeAccordion, setActiveAccordion] = useState<
    "home" | "product" | "realAsset" | "contactMessage" | "userRoleSetup" | "content" | "uddokta" | null
  >("home");

  const toggleAccordion = (
    module: "home" | "product" | "realAsset" | "contactMessage" | "userRoleSetup" | "content" | "uddokta"
  ) => {
    setActiveAccordion((prev) => (prev === module ? null : module));
  };

  useEffect(() => {
    fetchRoles();
  }, []);

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

  const PageAccessBlock = ({ moduleKey }: { moduleKey: string }) => (
    <>
      <CategoryHeader title="Page Access" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-4">
        <PermissionItem
          label="Public Page Access"
          checked={!!permissionTree[moduleKey]?.isPublicPage}
          onChange={() => handleToggle([moduleKey, "isPublicPage"])}
        />
        <PermissionItem
          label="Admin Config Access"
          checked={!!permissionTree[moduleKey]?.isAdminConfig}
          onChange={() => handleToggle([moduleKey, "isAdminConfig"])}
        />
      </div>
    </>
  );

  const StandardActionsBlock = ({ moduleKey, customActions = [] }: { moduleKey: string, customActions?: {label: string, key: string}[] }) => (
    <>
      <CategoryHeader title="Module Actions" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-4">
        <PermissionItem
          label="View"
          checked={!!permissionTree[moduleKey]?.actions?.isView}
          onChange={() => handleToggle([moduleKey, "actions", "isView"])}
        />
        <PermissionItem
          label="Create"
          checked={!!permissionTree[moduleKey]?.actions?.isCreate}
          onChange={() => handleToggle([moduleKey, "actions", "isCreate"])}
        />
        <PermissionItem
          label="Update"
          checked={!!permissionTree[moduleKey]?.actions?.isUpdate}
          onChange={() => handleToggle([moduleKey, "actions", "isUpdate"])}
        />
        <PermissionItem
          label="Delete"
          checked={!!permissionTree[moduleKey]?.actions?.isDelete}
          onChange={() => handleToggle([moduleKey, "actions", "isDelete"])}
        />
        {customActions.map(a => (
          <PermissionItem
            key={a.key}
            label={a.label}
            checked={!!permissionTree[moduleKey]?.actions?.[a.key]}
            onChange={() => handleToggle([moduleKey, "actions", a.key])}
          />
        ))}
      </div>
    </>
  );

  const SubModuleBlock = ({ moduleKey, subKey, title }: { moduleKey: string, subKey: string, title: string }) => (
    <>
      <CategoryHeader title={`Sub-Module: ${title}`} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-4">
        <PermissionItem
          label="Access Module"
          checked={!!permissionTree[moduleKey]?.subModules?.[subKey]?.isAccess}
          onChange={() => handleToggle([moduleKey, "subModules", subKey, "isAccess"])}
        />
        <PermissionItem
          label="View"
          checked={!!permissionTree[moduleKey]?.subModules?.[subKey]?.actions?.isView}
          onChange={() => handleToggle([moduleKey, "subModules", subKey, "actions", "isView"])}
        />
        <PermissionItem
          label="Create"
          checked={!!permissionTree[moduleKey]?.subModules?.[subKey]?.actions?.isCreate}
          onChange={() => handleToggle([moduleKey, "subModules", subKey, "actions", "isCreate"])}
        />
        <PermissionItem
          label="Update"
          checked={!!permissionTree[moduleKey]?.subModules?.[subKey]?.actions?.isUpdate}
          onChange={() => handleToggle([moduleKey, "subModules", subKey, "actions", "isUpdate"])}
        />
        <PermissionItem
          label="Delete"
          checked={!!permissionTree[moduleKey]?.subModules?.[subKey]?.actions?.isDelete}
          onChange={() => handleToggle([moduleKey, "subModules", subKey, "actions", "isDelete"])}
        />
      </div>
    </>
  );

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

      {/* ACCORDION MODULE SECTIONS */}
      {isLoadingTree ? (
        <div className="py-12"><Loader text={`Fetching permission tree for ${selectedRole}...`} variant="inline" /></div>
      ) : (
        <div className="space-y-3">
          
          {/* 1. HOME MODULE */}
          <AccordionSection
            title="1. Home Module"
            icon={<LuHouse className="w-4 h-4 text-zinc-500" />}
            isOpen={activeAccordion === "home"}
            onToggle={() => toggleAccordion("home")}
          >
            <div className="rounded-b-xl overflow-hidden">
              <PageAccessBlock moduleKey="home" />
              <StandardActionsBlock moduleKey="home" />
              <SubModuleBlock moduleKey="home" subKey="hero" title="Hero Section" />
              <SubModuleBlock moduleKey="home" subKey="services" title="Services Section" />
              <SubModuleBlock moduleKey="home" subKey="aboutUs" title="About Us Section" />
              <SubModuleBlock moduleKey="home" subKey="contactSection" title="Contact Section" />
            </div>
          </AccordionSection>

          {/* CONTENT MODULE */}
          <AccordionSection
            title="Content Module"
            icon={<LuTv className="w-4 h-4 text-zinc-500" />}
            isOpen={activeAccordion === "content"}
            onToggle={() => toggleAccordion("content")}
          >
            <div className="rounded-b-xl overflow-hidden">
              <PageAccessBlock moduleKey="content" />
              <StandardActionsBlock moduleKey="content" />
            </div>
          </AccordionSection>

          {/* UDDOKTA MODULE */}
          <AccordionSection
            title="Uddokta Module"
            icon={<LuRocket className="w-4 h-4 text-zinc-500" />}
            isOpen={activeAccordion === "uddokta"}
            onToggle={() => toggleAccordion("uddokta")}
          >
            <div className="rounded-b-xl overflow-hidden">
              <PageAccessBlock moduleKey="uddokta" />
              <StandardActionsBlock moduleKey="uddokta" />
            </div>
          </AccordionSection>

          {/* 2. PRODUCT MODULE */}
          <AccordionSection
            title="2. Product Module"
            icon={<LuPackage className="w-4 h-4 text-zinc-500" />}
            isOpen={activeAccordion === "product"}
            onToggle={() => toggleAccordion("product")}
          >
            <div className="rounded-b-xl overflow-hidden">
              <PageAccessBlock moduleKey="product" />
              <StandardActionsBlock 
                moduleKey="product" 
                customActions={[
                  { label: "Manage Stock", key: "isManageStock" },
                  { label: "Record Sale", key: "isRecordSale" }
                ]} 
              />
            </div>
          </AccordionSection>

          {/* 3. REAL ASSET MODULE */}
          <AccordionSection
            title="3. Real Asset Module"
            icon={<LuBuilding2 className="w-4 h-4 text-zinc-500" />}
            isOpen={activeAccordion === "realAsset"}
            onToggle={() => toggleAccordion("realAsset")}
          >
            <div className="rounded-b-xl overflow-hidden">
              <PageAccessBlock moduleKey="realAsset" />
              <StandardActionsBlock 
                moduleKey="realAsset" 
                customActions={[
                  { label: "Manage Bookings", key: "isManageBookings" },
                  { label: "Toggle Featured", key: "isToggleFeatured" }
                ]} 
              />
            </div>
          </AccordionSection>

          {/* 4. CONTACT MESSAGES MODULE */}
          <AccordionSection
            title="4. Contact Messages Module"
            icon={<LuMail className="w-4 h-4 text-zinc-500" />}
            isOpen={activeAccordion === "contactMessage"}
            onToggle={() => toggleAccordion("contactMessage")}
          >
            <div className="rounded-b-xl overflow-hidden">
              <PageAccessBlock moduleKey="contactMessage" />
              <StandardActionsBlock 
                moduleKey="contactMessage" 
                customActions={[
                  { label: "Reply to Message", key: "isReplyMessage" }
                ]} 
              />
            </div>
          </AccordionSection>

          {/* 5. USER & ROLE SETUP MODULE */}
          <AccordionSection
            title="5. User & Role Setup Module"
            icon={<LuShieldCheck className="w-4 h-4 text-zinc-500" />}
            isOpen={activeAccordion === "userRoleSetup"}
            onToggle={() => toggleAccordion("userRoleSetup")}
          >
            <div className="rounded-b-xl overflow-hidden">
              <PageAccessBlock moduleKey="userRoleSetup" />
              <StandardActionsBlock moduleKey="userRoleSetup" />
              <SubModuleBlock moduleKey="userRoleSetup" subKey="systemUser" title="System Users" />
              <SubModuleBlock moduleKey="userRoleSetup" subKey="customerUser" title="Customer Users" />
              <SubModuleBlock moduleKey="userRoleSetup" subKey="roleManagement" title="Role Management" />
              <SubModuleBlock moduleKey="userRoleSetup" subKey="rolePermissionSetup" title="Role Permission Config" />
            </div>
          </AccordionSection>

        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------
// Reusable UI Components for the Accordion Layout
// ----------------------------------------------------------------------

function AccordionSection({
  title,
  icon,
  isOpen,
  onToggle,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-950/50 shadow-xs transition-colors">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3.5 px-4 bg-zinc-50/50 hover:bg-zinc-100/50 dark:bg-zinc-900/40 dark:hover:bg-zinc-900/60 transition-colors focus:outline-none"
      >
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center shadow-xs">
            {icon}
          </div>
          <span className="font-bold text-[13px] text-zinc-900 dark:text-white tracking-wide">
            {title}
          </span>
        </div>
        <LuChevronRight
          className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
        />
      </button>
      {isOpen && <div className="border-t border-zinc-100 dark:border-zinc-800/60">{children}</div>}
    </div>
  );
}

function CategoryHeader({ title }: { title: string }) {
  return (
    <div className="bg-zinc-100/50 dark:bg-zinc-900/30 px-4 py-2 border-y border-zinc-200/50 dark:border-zinc-800/50 first:border-t-0 flex items-center gap-2">
      <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-600"></div>
      <span className="text-[11px] font-extrabold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
        {title}
      </span>
    </div>
  );
}

function PermissionItem({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div
      onClick={onChange}
      className={`relative overflow-hidden group flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none ${
        checked
          ? "bg-zinc-900 border-zinc-900 dark:bg-zinc-100 dark:border-zinc-100 shadow-sm"
          : "bg-white border-zinc-200 hover:border-zinc-300 dark:bg-zinc-950 dark:border-zinc-800 dark:hover:border-zinc-700"
      }`}
    >
      <div className="pt-0.5 shrink-0">
        <div
          className={`w-4 h-4 rounded-md flex items-center justify-center transition-colors border ${
            checked
              ? "bg-white border-white text-zinc-900 dark:bg-zinc-900 dark:border-zinc-900 dark:text-white"
              : "bg-zinc-50 border-zinc-300 text-transparent dark:bg-zinc-900 dark:border-zinc-700 group-hover:border-zinc-400 dark:group-hover:border-zinc-500"
          }`}
        >
          <svg viewBox="0 0 14 14" fill="none" className="w-3 h-3 stroke-current stroke-[2.5px] stroke-linecap-round stroke-linejoin-round">
            <path d="M3 7.5L5.5 10L11 4" />
          </svg>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div
          className={`text-xs font-bold leading-tight ${
            checked ? "text-white dark:text-zinc-950" : "text-zinc-700 dark:text-zinc-300"
          }`}
        >
          {label}
        </div>
      </div>
    </div>
  );
}
