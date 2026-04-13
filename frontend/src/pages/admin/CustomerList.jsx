// src/pages/admin/CustomerList.jsx
import React, { useEffect, useLayoutEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { useAdminApi } from "../../api/adminApi";
import Swal from "sweetalert2";
import CreateCustomerModal from "../../components/modals/CreateCustomerModal";
import EditCustomerModal from "../../components/modals/EditCustomerModal";
import { useBreadcrumb } from "../../context/BreadcrumbContext";

import {
  Plus,
  Eye,
  Pencil,
  Trash2,
  Calendar,
  Building2,
  ClipboardList,
  Users,
  Mail,
  Clock,
  UserPlus,
  Shield,
  UserCheck,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";

import { toast } from "react-hot-toast";

export default function CustomerList() {
  const {
    getCustomers,
    deleteCompany,
    createCollaborator,
    deleteCollaborator,
  } = useAdminApi();

  const { setBreadcrumb } = useBreadcrumb();

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editCompanyId, setEditCompanyId] = useState(null);
  const [expandedMobile, setExpandedMobile] = useState({});

  const toggleMobileExpand = (id) => {
    setExpandedMobile((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const loadCustomers = async () => {
    try {
      const res = await getCustomers();
      setCustomers(res.data || []);
    } catch (err) {
      console.error("Load customers error", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCollaborator = async (companyId) => {
    const { value: form } = await Swal.fire({
      title: "",
      html: `
        <div style="text-align:center;padding-top:8px;">
          <div style="
            width:56px;height:56px;margin:0 auto 16px;
            background:linear-gradient(135deg,#6366f1,#8b5cf6);
            border-radius:16px;display:flex;align-items:center;justify-content:center;
            box-shadow:0 8px 24px rgba(99,102,241,0.3);
          ">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <line x1="19" y1="8" x2="19" y2="14"/>
              <line x1="22" y1="11" x2="16" y2="11"/>
            </svg>
          </div>
          <h2 style="font-size:1.25rem;font-weight:700;color:#1e293b;margin:0 0 4px;">Add Collaborator</h2>
          <p style="font-size:0.85rem;color:#94a3b8;margin:0 0 20px;">Invite a team member by email</p>
        </div>
        <div style="text-align:left;">
          <label style="display:block;font-size:0.75rem;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:6px;">
            Email Address
          </label>
          <div style="position:relative;">
            <div style="position:absolute;left:14px;top:50%;transform:translateY(-50%);pointer-events:none;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
            </div>
            <input
              id="email"
              type="email"
              placeholder="collaborator@company.com"
              style="
                width:100%;box-sizing:border-box;
                padding:13px 16px 13px 44px;
                border:2px solid #e2e8f0;border-radius:12px;
                font-size:0.95rem;color:#1e293b;
                background:#f8fafc;outline:none;
                transition:all 0.2s ease;
              "
              onfocus="this.style.borderColor='#6366f1';this.style.background='#ffffff';this.style.boxShadow='0 0 0 4px rgba(99,102,241,0.08)'"
              onblur="this.style.borderColor='#e2e8f0';this.style.background='#f8fafc';this.style.boxShadow='none'"
            />
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Add Collaborator",
      cancelButtonText: "Cancel",
      focusConfirm: false,
      buttonsStyling: false,
      customClass: {
        popup: "swal-collab-popup",
        confirmButton: "swal-collab-confirm",
        cancelButton: "swal-collab-cancel",
        actions: "swal-collab-actions",
      },
      didOpen: () => {
        const s = document.createElement("style");
        s.textContent = `
          .swal-collab-popup{border-radius:24px!important;padding:28px 28px 24px!important;max-width:440px!important;width:92vw!important;box-shadow:0 25px 60px rgba(0,0,0,0.12),0 0 0 1px rgba(0,0,0,0.04)!important;border:none!important;}
          .swal-collab-actions{gap:10px!important;padding:20px 0 0!important;flex-direction:row-reverse!important;}
          .swal-collab-confirm{background:linear-gradient(135deg,#6366f1,#8b5cf6)!important;color:#fff!important;border:none!important;padding:12px 28px!important;border-radius:12px!important;font-weight:600!important;font-size:0.9rem!important;cursor:pointer!important;box-shadow:0 4px 16px rgba(99,102,241,0.35)!important;transition:all 0.2s!important;}
          .swal-collab-confirm:hover{transform:translateY(-1px)!important;box-shadow:0 6px 24px rgba(99,102,241,0.45)!important;}
          .swal-collab-cancel{background:#f1f5f9!important;color:#64748b!important;border:1px solid #e2e8f0!important;padding:12px 24px!important;border-radius:12px!important;font-weight:600!important;font-size:0.9rem!important;cursor:pointer!important;transition:all 0.2s!important;}
          .swal-collab-cancel:hover{background:#e2e8f0!important;color:#475569!important;}
        `;
        document.head.appendChild(s);
        setTimeout(() => document.getElementById("email")?.focus(), 120);
      },
      preConfirm: () => ({
        email: document.getElementById("email").value,
      }),
    });

    if (!form?.email) return;

    try {
      await createCollaborator({
        companyId,
        email: form.email,
      });

      await loadCustomers();

      Swal.fire({
        icon: "success",
        title: "Collaborator Added!",
        text: "Team member has been invited successfully.",
        timer: 2500,
        showConfirmButton: false,
        customClass: { popup: "swal-collab-popup" },
        didOpen: () => {
          const s = document.createElement("style");
          s.textContent = `.swal-collab-popup{border-radius:24px!important;max-width:380px!important;width:90vw!important;}`;
          document.head.appendChild(s);
        },
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed to Add",
        text: err?.response?.data?.message || "Something went wrong",
        customClass: { popup: "swal-collab-popup" },
        didOpen: () => {
          const s = document.createElement("style");
          s.textContent = `.swal-collab-popup{border-radius:24px!important;max-width:380px!important;width:90vw!important;}`;
          document.head.appendChild(s);
        },
      });
    }
  };

  const handleDeleteCollaborator = async (id) => {
    const confirm = await Swal.fire({
      title: "Remove Collaborator?",
      text: "This person will lose access immediately.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Remove",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      await deleteCollaborator(id);
      await loadCustomers();

      toast.success("Collaborator removed successfully");
    } catch (err) {
      toast.error("Failed to remove collaborator");
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  useLayoutEffect(() => {
    setBreadcrumb([
      { label: "Dashboard", to: "/dashboard" },
      { label: "Customers" },
    ]);
  }, []);

  // -------------------------------
  // LOADING UI
  // -------------------------------
  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 flex items-center justify-center p-3 sm:p-6">
        <div className="text-center space-y-4 sm:space-y-6">
          {/* Animated Loader */}
          <div className="relative inline-flex items-center justify-center">
            {/* Outer pulsing ring */}
            <div className="absolute w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 opacity-20 animate-ping"></div>

            {/* Middle ring */}
            <div className="absolute w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full border-4 border-indigo-200 animate-pulse"></div>

            {/* Main loader */}
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-indigo-700 flex items-center justify-center shadow-xl shadow-indigo-500/30">
              <Building2 className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white animate-pulse" />
            </div>

            {/* Spinning outer ring */}
            <div className="absolute w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full border-4 border-transparent border-t-blue-500 border-r-indigo-600 animate-spin"></div>
          </div>

          {/* Text */}
          <div className="space-y-1 sm:space-y-2">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Loading Customers
            </h2>
            <p className="text-xs sm:text-sm lg:text-base text-gray-500">
              Please wait we are about to Fetch company details and projects...
            </p>
          </div>

          {/* Loading dots */}
          <div className="flex justify-center items-center gap-1 sm:gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 animate-bounce"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
  /* ---------- DELETE ---------- */
  const handleDelete = async (id, name) => {
    const { value: typedName } = await Swal.fire({
      title: "Delete Customer?",
      html: `
      <div style="text-align:left;margin-top:16px;">
        <p style="color:#64748b;font-size:0.9rem;margin-bottom:12px;">
          This action cannot be undone. To confirm, type the company name:
        </p>
        <p style="color:#1e293b;font-weight:600;font-size:1rem;margin-bottom:8px;padding:10px;background:#f1f5f9;border-radius:8px;text-align:center;">
          ${name}
        </p>
        <input
          id="company-name-input"
          type="text"
          placeholder="Type company name here"
          style="
            width:100%;box-sizing:border-box;
            padding:12px 14px;margin-top:8px;
            border:2px solid #e2e8f0;border-radius:10px;
            font-size:0.9rem;color:#1e293b;
            outline:none;transition:all 0.2s;
          "
          onfocus="this.style.borderColor='#dc2626';this.style.boxShadow='0 0 0 3px rgba(220,38,38,0.1)'"
          onblur="this.style.borderColor='#e2e8f0';this.style.boxShadow='none'"
        />
      </div>
    `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Delete Forever",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "rounded-2xl shadow-xl",
      },
      didOpen: () => {
        // Auto-focus the input field
        setTimeout(() => {
          document.getElementById("company-name-input")?.focus();
        }, 100);
      },
      preConfirm: () => {
        const input = document.getElementById("company-name-input").value;
        if (input.trim() !== name) {
          Swal.showValidationMessage(
            `Company name doesn't match. Please type exactly: ${name}`,
          );
          return false;
        }
        return input;
      },
    });

    // If user didn't type the correct name or cancelled
    if (!typedName) return;

    // Proceed with deletion
    try {
      await deleteCompany(id);
      setCustomers((prev) => prev.filter((c) => c.company_id !== id));
      Swal.fire({
        icon: "success",
        title: "Company Deleted",
        toast: true,
        position: "top-center",
        timer: 2200,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: err?.response?.data?.message || "Could not delete company",
      });
    }
  };

  /* ---------- HELPERS ---------- */
  const gradients = [
    "from-indigo-500 to-blue-600",
    "from-emerald-500 to-teal-600",
    "from-amber-500 to-orange-600",
    "from-rose-500 to-pink-600",
    "from-violet-500 to-purple-600",
    "from-cyan-500 to-sky-600",
  ];

  const getGradient = (i) => gradients[i % gradients.length];

  /* =============================== RENDER =============================== */
  return (
    <div className="w-full min-h-full bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* ── HEADER ── */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <div className="relative p-3 bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 rounded-2xl shadow-lg shadow-blue-500/30 group-hover:shadow-xl transition-shadow">
                  <div className="absolute inset-0 bg-white/10 rounded-2xl blur-xl"></div>
                  <Users className="w-5 h-5 text-white relative z-10" />
                </div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight">
                  Customers
                </h1>
              </div>
              <p className="text-sm text-gray-400 font-medium ml-[46px]">
                Manage companies, admins &amp; collaborators
              </p>
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="
    w-full sm:w-auto inline-flex items-center justify-center gap-2
    px-6 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700
    hover:from-blue-700 hover:to-blue-800
    text-white font-semibold text-sm rounded-xl
    shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40
    active:scale-[0.97] transition-all duration-200 hover:scale-105
  "
            >
              <Plus className="w-4 h-4" />
              Create Customer
            </button>
          </div>

          {/* Stats */}
          {customers.length > 0 && (
            <div className="flex flex-wrap gap-3 ml-0 sm:ml-[46px]">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-xl text-sm border border-indigo-100 shadow-sm hover:shadow-md transition-all hover:scale-105">
                <Building2 className="w-3.5 h-3.5 text-indigo-500" />
                <span className="text-indigo-600 font-bold">
                  {customers.length}
                </span>
                <span className="text-indigo-400 font-medium">companies</span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-xl text-sm border border-emerald-100 shadow-sm hover:shadow-md transition-all hover:scale-105">
                <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 font-bold">
                  {customers.reduce((a, c) => a + c.users.length, 0)}
                </span>
                <span className="text-emerald-400 font-medium">
                  total users
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ── EMPTY STATE ── */}
        {customers.length === 0 ? (
          <div className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 p-10 sm:p-16 text-center">
            <div className="max-w-sm mx-auto space-y-5">
              <div className="w-20 h-20 mx-auto bg-indigo-50 rounded-2xl flex items-center justify-center border border-indigo-100">
                <ClipboardList className="w-10 h-10 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  No Customers Yet
                </h3>
                <p className="text-sm text-gray-500 mt-1.5">
                  Create your first customer to get started.
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md transition-all"
              >
                <Plus className="w-4 h-4" />
                Create Your First Customer
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* ══════════════════════════ DESKTOP TABLE ══════════════════════════ */}
            <div className="hidden lg:block rounded-2xl border border-gray-200/60 overflow-hidden shadow-lg bg-white/80 backdrop-blur-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-50 to-slate-50/50 border-b border-gray-200/60 backdrop-blur-sm">
                      <th className="px-5 py-4 text-left">
                        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5" />
                          Company
                        </span>
                      </th>
                      <th className="px-5 py-4 text-left">
                        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                          <Shield className="w-3.5 h-3.5" />
                          Admin
                        </span>
                      </th>
                      <th className="px-5 py-4 text-left">
                        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5" />
                          Collaborators
                        </span>
                      </th>
                      <th className="px-5 py-4 text-left">
                        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          Created
                        </span>
                      </th>
                      <th className="px-5 py-4 text-right">
                        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                          Actions
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {customers.map((company, index) => {
                      const adminUser = company.users.find(
                        (u) => u.role === "customer",
                      );
                      const collaborators = company.users.filter(
                        (u) => u.role === "collaborator",
                      );

                      return (
                        <tr
                          key={company.company_id}
                          className="group hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-violet-50/30 transition-all duration-300 hover:shadow-sm"
                        >
                          {/* Company */}
                          {/* Company */}
                          <td className="px-5 py-4">
                            <div
                              onClick={() =>
                                navigate(`/admin/company/${company.company_id}`)
                              }
                              className="flex items-center gap-3 cursor-pointer"
                            >
                              <div className="relative flex-shrink-0">
                                <div
                                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getGradient(index)}
          flex items-center justify-center text-white font-bold text-sm shadow-md
          group-hover:shadow-lg group-hover:scale-105 transition-all duration-200`}
                                >
                                  {company.company_name.charAt(0).toUpperCase()}
                                </div>
                                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white"></div>
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900 text-sm group-hover:text-indigo-600 transition-colors">
                                  {company.company_name}
                                </h3>
                              </div>
                            </div>
                          </td>

                          {/* Admin */}
                          {/* Admin */}
                          <td className="px-5 py-4">
                            {adminUser ? (
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                                    <Shield className="w-3.5 h-3.5 text-indigo-600" />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium text-gray-800 truncate">
                                      {adminUser.name}
                                    </p>
                                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                                      <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                                      <span className="break-all">
                                        {adminUser.email}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <span className="text-xs text-gray-400 italic">
                                No admin
                              </span>
                            )}
                          </td>

                          {/* Collaborators */}
                          <td className="px-5 py-4">
                            <div className="space-y-1.5">
                              {collaborators.length === 0 ? (
                                <span className="text-sm text-gray-400 italic">
                                  No collaborators
                                </span>
                              ) : (
                                collaborators.map((c) => (
                                  <div
                                    key={c.id}
                                    className="flex items-center justify-between gap-2 bg-gradient-to-r from-white to-gray-50/50 hover:from-violet-50 hover:to-purple-50/30 border border-gray-200/60 px-3 py-2.5 rounded-xl transition-all duration-200 group/collab hover:shadow-md hover:scale-[1.02]"
                                  >
                                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                      <div className="w-7 h-7 rounded-md bg-violet-100 flex items-center justify-center flex-shrink-0">
                                        <span className="text-xs font-bold text-violet-600">
                                          {c.name?.charAt(0)?.toUpperCase() ||
                                            "?"}
                                        </span>
                                      </div>
                                      <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-gray-700 truncate">
                                          {c.name}
                                        </p>
                                        <p className="text-xs text-gray-500 break-all">
                                          {c.email}
                                        </p>
                                      </div>
                                    </div>
                                    <button
                                      onClick={() =>
                                        handleDeleteCollaborator(c.id)
                                      }
                                      className="opacity-0 group-hover/collab:opacity-100 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all flex-shrink-0"
                                      title="Remove collaborator"
                                    >
                                      <X size={14} />
                                    </button>
                                  </div>
                                ))
                              )}
                              <button
                                onClick={() =>
                                  handleAddCollaborator(company.company_id)
                                }
                                className="flex items-center gap-1.5 text-xs font-semibold text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 px-2.5 py-1.5 rounded-md transition-colors mt-1"
                              >
                                <UserPlus className="w-3.5 h-3.5" />
                                Add collaborator
                              </button>
                            </div>
                          </td>

                          {/* Created */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Clock className="w-3.5 h-3.5 text-gray-400" />
                              <div>
                                <p className="text-xs font-medium text-gray-600">
                                  {new Date(
                                    company.users[0]?.created_at,
                                  ).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </p>
                                <p className="text-[10px] text-gray-400">
                                  {new Date(
                                    company.users[0]?.created_at,
                                  ).toLocaleTimeString("en-US", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="px-5 py-4">
                            <div className="flex items-center justify-end gap-4">
                              {/* <button
                                onClick={() =>
                                  navigate(
                                    `/admin/company/${company.company_id}`,
                                  )
                                }
                                className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-gradient-to-br hover:from-blue-50 hover:to-blue-100/50 rounded-xl transition-all duration-200 hover:scale-110 hover:shadow-md active:scale-95"
                                title="View"
                              >
                                <Eye className="w-4 h-4" />
                              </button> */}
                              <button
                                onClick={() =>
                                  setEditCompanyId(company.company_id)
                                }
                                className="p-2.5 text-gray-400 hover:text-amber-600 hover:bg-gradient-to-br hover:from-amber-50 hover:to-amber-100/50 rounded-xl transition-all duration-200 hover:scale-110 hover:shadow-md active:scale-95"
                                title="Edit"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>

                              {/* More Options Dropdown */}
                              <div className="relative group/menu">
                                <button
                                  className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-100/50 rounded-xl transition-all duration-200 hover:scale-110 hover:shadow-md active:scale-95"
                                  title="More options"
                                >
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                                    />
                                  </svg>
                                </button>

                                {/* Dropdown Menu */}
                                <div className="absolute right-0 mt-1 w-48 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all duration-200 z-50">
                                  <div className="bg-white rounded-xl shadow-xl border border-gray-200/60 py-1 backdrop-blur-sm">
                                    <button
                                      onClick={() =>
                                        handleDelete(
                                          company.company_id,
                                          company.company_name,
                                        )
                                      }
                                      className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                      <span className="font-medium">
                                        Delete Customer
                                      </span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Footer */}
              <div className="bg-gray-50/60 px-5 py-3 border-t border-gray-100">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Users className="w-3.5 h-3.5 text-gray-400" />
                  Showing{" "}
                  <span className="font-bold text-gray-700">
                    {customers.length}
                  </span>{" "}
                  companies
                </div>
              </div>
            </div>

            {/* ══════════════════════════ MOBILE / TABLET ══════════════════════════ */}
            <div className="lg:hidden space-y-3">
              {customers.map((company, index) => {
                const adminUser = company.users.find(
                  (u) => u.role === "customer",
                );
                const collaborators = company.users.filter(
                  (u) => u.role === "collaborator",
                );
                const isExpanded = expandedMobile[company.company_id];

                return (
                  <div
                    key={company.company_id}
                    className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
                  >
                    {/* Card Header */}
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="relative flex-shrink-0">
                          <div
                            className={`w-11 h-11 rounded-xl bg-gradient-to-br ${getGradient(index)}
                              flex items-center justify-center text-white font-bold text-base shadow-md`}
                          >
                            {company.company_name.charAt(0).toUpperCase()}
                          </div>
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white"></div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 text-[15px] truncate">
                            {company.company_name}
                          </h3>

                          {/* Admin info */}
                          {adminUser && (
                            <div className="mt-1.5 flex items-center gap-2">
                              <div className="w-5 h-5 rounded-md bg-indigo-100 flex items-center justify-center flex-shrink-0">
                                <Shield className="w-3 h-3 text-indigo-600" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-medium text-gray-700 truncate">
                                  {adminUser.name}
                                </p>
                                <div className="flex items-center gap-1 text-[10px] text-gray-400">
                                  <Mail className="w-2.5 h-2.5" />
                                  <span className="truncate">
                                    {adminUser.email}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Date */}
                          <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-gray-400">
                            <Clock className="w-3 h-3" />
                            {new Date(
                              company.users[0]?.created_at,
                            ).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </div>
                        </div>

                        <button
                          onClick={() => toggleMobileExpand(company.company_id)}
                          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0 mt-0.5"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      {/* Collaborator chips (always visible) */}
                      <div className="mt-3">
                        <div className="flex items-center gap-1.5 mb-2">
                          <Users className="w-3 h-3 text-gray-400" />
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            Collaborators ({collaborators.length})
                          </span>
                        </div>

                        {collaborators.length === 0 ? (
                          <p className="text-[11px] text-gray-400 italic ml-[18px]">
                            No collaborators yet
                          </p>
                        ) : (
                          <div className="space-y-1.5">
                            {collaborators.map((c) => (
                              <div
                                key={c.id}
                                className="flex items-center justify-between bg-gray-50 border border-gray-100 px-2.5 py-2 rounded-lg"
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <div className="w-6 h-6 rounded-md bg-violet-100 flex items-center justify-center flex-shrink-0">
                                    <span className="text-[10px] font-bold text-violet-600">
                                      {c.name?.charAt(0)?.toUpperCase() || "?"}
                                    </span>
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-xs font-medium text-gray-700 truncate">
                                      {c.name}
                                    </p>
                                    <p className="text-[10px] text-gray-400 truncate">
                                      {c.email}
                                    </p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleDeleteCollaborator(c.id)}
                                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors flex-shrink-0"
                                >
                                  <X size={12} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        <button
                          onClick={() =>
                            handleAddCollaborator(company.company_id)
                          }
                          className="flex items-center gap-1.5 mt-2 text-[11px] font-semibold text-indigo-500 hover:text-indigo-700 px-2 py-1 rounded-md hover:bg-indigo-50 transition-colors"
                        >
                          <UserPlus className="w-3 h-3" />
                          Add collaborator
                        </button>
                      </div>
                    </div>

                    {/* Expanded Actions */}
                    {isExpanded && (
                      <div className="px-4 pb-4">
                        <div className="h-px bg-gray-100 mb-3"></div>
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            onClick={() =>
                              navigate(`/admin/company/${company.company_id}`)
                            }
                            className="flex items-center justify-center gap-1.5 px-3 py-2.5
                              text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100
                              border border-blue-100 rounded-xl active:scale-[0.97] transition-all"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View
                          </button>
                          <button
                            onClick={() => setEditCompanyId(company.company_id)}
                            className="flex items-center justify-center gap-1.5 px-3 py-2.5
                              text-xs font-semibold text-amber-600 bg-amber-50 hover:bg-amber-100
                              border border-amber-100 rounded-xl active:scale-[0.97] transition-all"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            Edit
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(
                                company.company_id,
                                company.company_name,
                              )
                            }
                            className="flex items-center justify-center gap-1.5 px-3 py-2.5
                              text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100
                              border border-red-100 rounded-xl active:scale-[0.97] transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Quick action bar (collapsed) */}
                    {!isExpanded && (
                      <div className="flex border-t border-gray-100 divide-x divide-gray-100">
                        <button
                          onClick={() =>
                            navigate(`/admin/company/${company.company_id}`)
                          }
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-blue-500 hover:bg-blue-50 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </button>
                        <button
                          onClick={() => setEditCompanyId(company.company_id)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-amber-500 hover:bg-amber-50 transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(
                              company.company_id,
                              company.company_name,
                            )
                          }
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Mobile footer */}
              <div className="flex items-center justify-center gap-2 py-3 text-xs text-gray-400">
                <Users className="w-3.5 h-3.5" />
                <span>{customers.length} companies</span>
                <span className="text-gray-300">•</span>
                <span>
                  {customers.reduce((a, c) => a + c.users.length, 0)} users
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      <CreateCustomerModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={loadCustomers}
      />

      <EditCustomerModal
        open={!!editCompanyId}
        companyId={editCompanyId}
        onClose={() => setEditCompanyId(null)}
        onSuccess={loadCustomers}
      />
    </div>
  );
}
