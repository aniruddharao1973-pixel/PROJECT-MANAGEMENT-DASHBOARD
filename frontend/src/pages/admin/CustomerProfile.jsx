// // src/pages/admin/CustomerProfile.jsx
// import React, { useEffect, useState } from "react";
// import { useParams, Link, useNavigate } from "react-router-dom";
// import { useAdminApi } from "../../api/adminApi";
// import { useProjectsApi } from "../../api/projectsApi";
// import { useAuth } from "../../hooks/useAuth";
// import CreateProjectModal from "../../components/modals/CreateProjectModal";
// import ManageProjectDepartmentsModal from "../../components/modals/ManageProjectDepartmentsModal";

// import Swal from "sweetalert2";
// import { toast } from "react-toastify";
// import { useBreadcrumb } from "../../context/BreadcrumbContext";

// import {
//   Building2,
//   User,
//   Mail,
//   Phone,
//   MapPin,
//   Calendar,
//   Clock,
//   Folder,
//   FolderOpen,
//   Briefcase,
//   MoreVertical,
//   Eye,
//   ArrowRight,
//   ArrowLeft,
//   Trash2,
//   Plus,
//   Search,
//   CheckCircle,
//   XCircle,
//   AlertCircle,
//   Loader2,
//   LayoutGrid,
//   ExternalLink,
//   Sparkles,
//   Shield,
//   Hash,
//   ChevronRight,
//   FileText,
//   Activity,
//   TrendingUp,
//   Users,
//   Star,
//   Pencil,
// } from "lucide-react";

// export default function CustomerProfile() {
//   const { companyId } = useParams();
//   const { getCustomer, deleteProject, unassignDepartmentFromProject } =
//     useAdminApi();

//   const { renameProject } = useProjectsApi();

//   const [createOpen, setCreateOpen] = useState(false);
//   const [selectedProject, setSelectedProject] = useState(null);
//   const [manageDeptOpen, setManageDeptOpen] = useState(false);
//   const [openMenuProjectId, setOpenMenuProjectId] = useState(null);

//   const [data, setData] = useState({
//     company: null,
//     admin: null,
//     projects: [],
//   });

//   const [loading, setLoading] = useState(true);

//   const navigate = useNavigate();
//   const { isAdminLike } = useAuth();
//   const { setBreadcrumb } = useBreadcrumb();

//   // -------------------------------
//   // FETCH COMPANY PROFILE
//   // -------------------------------
//   useEffect(() => {
//     let cancelled = false;

//     async function load() {
//       try {
//         if (!isAdminLike) {
//           navigate("/projects", { replace: true });
//           return;
//         }

//         const res = await getCustomer(companyId);
//         if (cancelled) return;

//         const companyData = res.data || {};
//         const adminUser = (companyData.users && companyData.users[0]) || null;

//         setBreadcrumb([
//           { label: "Customers", to: "/admin/customers" },
//           { label: companyData.company?.name || "Customer" },
//         ]);

//         setData({
//           company: companyData.company || null,
//           admin: adminUser,
//           projects: companyData.projects || [],
//         });
//       } catch (err) {
//         if (cancelled) return;
//         console.error("Load company profile error", err);
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     }

//     load();

//     return () => {
//       cancelled = true;
//     };
//   }, [companyId, isAdminLike, navigate, setBreadcrumb]);

//   useEffect(() => {
//     const close = () => setOpenMenuProjectId(null);
//     window.addEventListener("click", close);
//     return () => window.removeEventListener("click", close);
//   }, []);

//   //------------------------------------------
//   // DELETE PROJECT HANDLER
//   //------------------------------------------
//   const handleDeleteProject = async (projectId, name) => {
//     const confirm = await Swal.fire({
//       title: `Delete project "${name}"?`,
//       text: "This action cannot be undone.",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#dc2626",
//       cancelButtonColor: "#6b7280",
//       confirmButtonText: "Yes, delete",
//     });

//     if (!confirm.isConfirmed) return;

//     try {
//       await deleteProject(projectId);

//       setData((prev) => ({
//         ...prev,
//         projects: prev.projects.filter((p) => p.id !== projectId),
//       }));

//       Swal.fire("Deleted!", "Project removed successfully.", "success");
//     } catch (err) {
//       Swal.fire("Error", "Failed to delete project.", "error");
//     }
//   };

//   const handleRenameProject = async (projectId, currentName) => {
//     // Inject custom styles once
//     if (!document.getElementById("swal-rename-styles")) {
//       const style = document.createElement("style");
//       style.id = "swal-rename-styles";
//       style.innerHTML = `
//       .swal-rename-popup {
//         border-radius: 16px !important;
//         padding: 32px 28px 28px !important;
//         box-shadow: 0 24px 64px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.08) !important;
//         font-family: 'Inter', system-ui, sans-serif !important;
//         border: 1px solid rgba(0,0,0,0.06) !important;
//       }
//       .swal-rename-title {
//         font-size: 18px !important;
//         font-weight: 600 !important;
//         color: #0f172a !important;
//         letter-spacing: -0.3px !important;
//         margin-bottom: 4px !important;
//       }
//       .swal-rename-input {
//         border: 1.5px solid #e2e8f0 !important;
//         border-radius: 10px !important;
//         font-size: 14px !important;
//         color: #1e293b !important;
//         padding: 11px 14px !important;
//         margin-top: 16px !important;
//         transition: border-color 0.15s ease, box-shadow 0.15s ease !important;
//         box-shadow: none !important;
//         outline: none !important;
//       }
//       .swal-rename-input:focus {
//         border-color: #6366f1 !important;
//         box-shadow: 0 0 0 3px rgba(99,102,241,0.12) !important;
//       }
//       .swal-rename-validation {
//         font-size: 12.5px !important;
//         color: #ef4444 !important;
//         margin-top: 6px !important;
//         text-align: left !important;
//       }
//       .swal-rename-actions {
//         gap: 10px !important;
//         margin-top: 24px !important;
//       }
//       .swal-rename-confirm {
//         background: #6366f1 !important;
//         border-radius: 9px !important;
//         font-size: 14px !important;
//         font-weight: 500 !important;
//         padding: 10px 22px !important;
//         box-shadow: none !important;
//         transition: background 0.15s ease, transform 0.1s ease !important;
//         border: none !important;
//       }
//       .swal-rename-confirm:hover {
//         background: #4f46e5 !important;
//         transform: translateY(-1px) !important;
//       }
//       .swal-rename-confirm:active {
//         transform: translateY(0) !important;
//       }
//       .swal-rename-cancel {
//         background: transparent !important;
//         border: 1.5px solid #e2e8f0 !important;
//         border-radius: 9px !important;
//         font-size: 14px !important;
//         font-weight: 500 !important;
//         color: #64748b !important;
//         padding: 10px 22px !important;
//         box-shadow: none !important;
//         transition: border-color 0.15s ease, color 0.15s ease !important;
//       }
//       .swal-rename-cancel:hover {
//         border-color: #cbd5e1 !important;
//         color: #475569 !important;
//         background: #f8fafc !important;
//       }
//     `;
//       document.head.appendChild(style);
//     }

//     const { value: newName } = await Swal.fire({
//       title: "Rename Project",
//       input: "text",
//       inputValue: currentName,
//       inputPlaceholder: "Enter new project name",
//       showCancelButton: true,
//       confirmButtonText: "Rename",
//       customClass: {
//         popup: "swal-rename-popup",
//         title: "swal-rename-title",
//         input: "swal-rename-input",
//         validationMessage: "swal-rename-validation",
//         actions: "swal-rename-actions",
//         confirmButton: "swal-rename-confirm",
//         cancelButton: "swal-rename-cancel",
//       },
//       inputValidator: (value) => {
//         if (!value || !value.trim()) {
//           return "Project name cannot be empty";
//         }
//       },
//     });

//     if (!newName) return;

//     try {
//       await renameProject(projectId, newName);

//       setData((prev) => ({
//         ...prev,
//         projects: prev.projects.map((p) =>
//           p.id === projectId ? { ...p, name: newName } : p,
//         ),
//       }));

//       toast.success("Project renamed successfully");
//     } catch (err) {
//       toast.error(err?.response?.data?.message || "Failed to rename project");
//     }
//   };
//   // -------------------------------
//   // LOADING UI
//   // -------------------------------
//   if (loading) {
//     return (
//       <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/40 flex items-center justify-center p-3 sm:p-6">
//         <div className="text-center space-y-4 sm:space-y-6">
//           <div className="relative inline-flex items-center justify-center">
//             <div className="absolute w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-20 animate-ping"></div>
//             <div className="absolute w-16 h-16 sm:w-24 sm:h-24 rounded-full border-4 border-indigo-200 animate-pulse"></div>
//             <div className="relative w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-600 flex items-center justify-center shadow-xl shadow-indigo-500/30">
//               <Building2 className="w-6 h-6 sm:w-10 sm:h-10 text-white animate-pulse" />
//             </div>
//             <div className="absolute w-20 h-20 sm:w-28 sm:h-28 rounded-full border-4 border-transparent border-t-indigo-500 border-r-purple-500 animate-spin"></div>
//           </div>

//           <div className="space-y-1 sm:space-y-2">
//             <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
//               Loading Company Profile
//             </h2>
//             <p className="text-xs sm:text-base text-gray-500">
//               Fetching company details and projects...
//             </p>
//           </div>

//           <div className="flex justify-center items-center gap-1">
//             {[0, 1, 2].map((i) => (
//               <div
//                 key={i}
//                 className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 animate-bounce"
//                 style={{ animationDelay: `${i * 150}ms` }}
//               />
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // -------------------------------
//   // NOT FOUND UI
//   // -------------------------------
//   if (!data.company) {
//     return (
//       <div className="w-full min-h-screen bg-gradient-to-br from-rose-50 via-red-50/50 to-orange-50/30 flex items-center justify-center p-4 sm:p-6">
//         <div className="bg-white/80 backdrop-blur-xl rounded-xl sm:rounded-3xl shadow-2xl border border-rose-100 p-6 sm:p-12 text-center max-w-md w-full">
//           <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 rounded-xl sm:rounded-3xl bg-gradient-to-br from-rose-100 to-red-100 flex items-center justify-center">
//             <XCircle className="w-8 h-8 sm:w-12 sm:h-12 text-rose-500" />
//           </div>

//           <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mb-2">
//             Company Not Found
//           </h2>
//           <p className="text-xs sm:text-base text-gray-500 mb-6 sm:mb-8">
//             The company you're looking for doesn't exist or has been removed.
//           </p>

//           <button
//             onClick={() => navigate("/admin/customers")}
//             className="inline-flex items-center gap-2 px-4 sm:px-8 py-2.5 sm:py-4 bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 text-white font-semibold text-sm sm:text-base rounded-lg sm:rounded-2xl shadow-lg shadow-rose-500/30 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
//           >
//             <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
//             <span>Go Back</span>
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const { company, admin, projects } = data;
//   return (
//     <div className="w-full min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50/20 to-purple-50/30 p-3 sm:p-4 md:p-6 lg:p-8 xl:p-10">
//       <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 lg:space-y-8">
//         {/* ==================== HERO SECTION ==================== */}
//         <header className="mb-6 sm:mb-8 lg:mb-10">
//           <div className="relative bg-white/80 backdrop-blur-xl rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
//             <div className="absolute inset-y-0 left-0 w-1 sm:w-1.5 lg:w-2 bg-gradient-to-b from-indigo-500 via-purple-500 to-violet-600"></div>
//             <div className="absolute top-0 right-0 w-40 h-40 sm:w-56 sm:h-56 lg:w-64 lg:h-64 bg-gradient-to-br from-indigo-100/50 to-purple-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

//             <div className="relative p-4 sm:p-6 md:p-8 lg:p-10">
//               <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6 lg:gap-8">
//                 {/* Company Info Section */}
//                 <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 lg:gap-6">
//                   {/* Company Avatar */}
//                   <div className="relative flex-shrink-0">
//                     <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 rounded-xl sm:rounded-2xl lg:rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-600 flex items-center justify-center text-white font-bold text-2xl sm:text-3xl lg:text-4xl xl:text-5xl shadow-lg sm:shadow-xl shadow-indigo-500/30">
//                       {company.name.charAt(0).toUpperCase()}
//                     </div>
//                     <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 p-1 sm:p-1.5 lg:p-2 bg-white rounded-lg sm:rounded-xl shadow-lg">
//                       <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-emerald-500" />
//                     </div>
//                   </div>

//                   {/* Company Details */}
//                   <div className="space-y-2 sm:space-y-3 lg:space-y-4">
//                     <div>
//                       <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-0.5 sm:mb-1 break-words">
//                         {company.name}
//                       </h1>
//                       <div className="flex items-center gap-1.5 sm:gap-2 text-gray-500">
//                         <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
//                         <span className="text-xs sm:text-sm lg:text-base">
//                           Customer Organization
//                         </span>
//                       </div>
//                     </div>

//                     {/* Admin Info Card */}
//                     {admin && (
//                       <div className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg sm:rounded-xl lg:rounded-2xl border border-indigo-100">
//                         <div className="p-1.5 sm:p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-md sm:rounded-lg lg:rounded-xl flex-shrink-0">
//                           <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white" />
//                         </div>
//                         <div className="min-w-0">
//                           <div className="flex items-center gap-1.5 sm:gap-2">
//                             <Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-indigo-500 flex-shrink-0" />
//                             <span className="text-xs sm:text-sm lg:text-base font-medium text-gray-800 truncate">
//                               {admin.email}
//                             </span>
//                           </div>
//                           <div className="flex items-center gap-1 sm:gap-1.5 mt-0.5">
//                             <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-500 flex-shrink-0" />
//                             <span className="text-[10px] sm:text-xs text-gray-500">
//                               Administrator
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2 sm:gap-3 mt-2 sm:mt-0">
//                   <button
//                     onClick={() => setCreateOpen(true)}
//                     className="group inline-flex items-center justify-center gap-2 sm:gap-2.5 px-4 sm:px-5 lg:px-6 py-2.5 sm:py-3 lg:py-3.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500 hover:from-indigo-600 hover:via-purple-600 hover:to-violet-600 text-white font-semibold text-xs sm:text-sm lg:text-base rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transform hover:-translate-y-0.5 transition-all duration-300"
//                   >
//                     <div className="p-0.5 sm:p-1 bg-white/20 rounded-md sm:rounded-lg group-hover:bg-white/30 transition-colors">
//                       <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
//                     </div>
//                     <span>Create Project</span>
//                     <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 opacity-70 hidden sm:block" />
//                   </button>
//                 </div>
//               </div>

//               {/* Stats Row */}
//               <div className="mt-4 sm:mt-6 lg:mt-8 pt-4 sm:pt-6 lg:pt-8 border-t border-gray-100">
//                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
//                   <div className="flex items-center gap-2 sm:gap-3">
//                     <div className="p-2 sm:p-2.5 lg:p-3 bg-indigo-100 rounded-lg sm:rounded-xl flex-shrink-0">
//                       <Folder className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-indigo-600" />
//                     </div>
//                     <div>
//                       <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
//                         {projects.length}
//                       </p>
//                       <p className="text-[10px] sm:text-xs lg:text-sm text-gray-500">
//                         Projects
//                       </p>
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-2 sm:gap-3">
//                     <div className="p-2 sm:p-2.5 lg:p-3 bg-purple-100 rounded-lg sm:rounded-xl flex-shrink-0">
//                       <Users className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-purple-600" />
//                     </div>
//                     <div>
//                       <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
//                         1
//                       </p>
//                       <p className="text-[10px] sm:text-xs lg:text-sm text-gray-500">
//                         Admin
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* ==================== PROJECTS SECTION ==================== */}
//         <section>
//           {/* Section Header */}
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 lg:mb-8">
//             <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
//               <div className="p-2 sm:p-2.5 lg:p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg shadow-indigo-500/25 flex-shrink-0">
//                 <LayoutGrid className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
//               </div>
//               <div className="min-w-0">
//                 <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
//                   Projects
//                 </h2>
//                 <p className="text-[11px] sm:text-xs lg:text-sm text-gray-500 mt-0.5">
//                   Manage and view all customer projects
//                 </p>
//               </div>
//               <span className="ml-1 sm:ml-2 px-2 sm:px-3 py-0.5 sm:py-1 bg-indigo-100 text-indigo-700 text-[11px] sm:text-xs lg:text-sm font-semibold rounded-full">
//                 {projects.length}
//               </span>
//             </div>
//           </div>

//           {/* Empty State */}
//           {projects.length === 0 ? (
//             <div className="bg-white/80 backdrop-blur-xl rounded-xl sm:rounded-2xl lg:rounded-3xl border border-gray-100 shadow-xl p-6 sm:p-10 lg:p-16 text-center">
//               <div className="max-w-md mx-auto">
//                 <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl sm:rounded-3xl flex items-center justify-center">
//                   <FolderOpen className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 text-indigo-400" />
//                 </div>

//                 <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
//                   No Projects Yet
//                 </h3>
//                 <p className="text-xs sm:text-sm lg:text-base text-gray-500 mb-6 sm:mb-8">
//                   Get started by creating the first project for this customer.
//                 </p>

//                 <button
//                   onClick={() => setCreateOpen(true)}
//                   className="inline-flex items-center gap-2 sm:gap-2.5 px-5 sm:px-6 lg:px-8 py-3 sm:py-3.5 lg:py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500 hover:from-indigo-600 hover:via-purple-600 hover:to-violet-600 text-white font-semibold text-xs sm:text-sm lg:text-base rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg shadow-indigo-500/30 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
//                 >
//                   <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
//                   <span>Create First Project</span>
//                 </button>
//               </div>
//             </div>
//           ) : (
//             /* Projects Grid */
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-5 xl:gap-6">
//               {projects.map((project, index) => (
//                 <article
//                   key={project.id}
//                   role="button"
//                   tabIndex={0}
//                   onClick={() => {
//                     if (!project.created_at) {
//                       toast.info(
//                         "Project is initializing, please wait a moment",
//                       );
//                       return;
//                     }
//                     navigate(`/projects/${project.id}/folders`);
//                   }}
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter" || e.key === " ") {
//                       e.preventDefault();
//                       if (!project.created_at) {
//                         toast.info(
//                           "Project is initializing, please wait a moment",
//                         );
//                         return;
//                       }
//                       navigate(`/projects/${project.id}/folders`);
//                     }
//                   }}
//                   className="group relative bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl border border-gray-100 shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 overflow-hidden focus:outline-none focus:ring-2 focus:ring-indigo-300 cursor-pointer"
//                 >
//                   {/* <div className="absolute -top-16 -right-16 sm:-top-20 sm:-right-20 w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br from-indigo-400/15 to-purple-400/15 rounded-full blur-3xl pointer-events-none group-hover:from-indigo-400/25 group-hover:to-purple-400/25 transition-all duration-500" /> */}

//                   <div className="relative p-4 sm:p-6 lg:p-8">
//                     <div className="flex items-start gap-3 sm:gap-4">
//                       {/* Project Icon */}
//                       <div className="relative flex-shrink-0">
//                         <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 opacity-0 blur-xl group-hover:opacity-40 transition-all duration-300" />
//                         <div className="relative w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-500 flex items-center justify-center shadow-md group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
//                           <Folder className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white drop-shadow-sm" />
//                         </div>
//                       </div>

//                       {/* Content - Title and Badges */}
//                       <div className="flex-1 min-w-0">
//                         <h3
//                           className="text-[15px] sm:text-lg lg:text-xl font-semibold text-gray-900 tracking-tight truncate"
//                           title={project.name}
//                         >
//                           {project.name}
//                         </h3>
//                         <p className="text-xs text-gray-500 mt-0.5">Project</p>

//                         <div className="flex items-center gap-2 sm:gap-2.5 mt-2 sm:mt-2.5">
//                           <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50 border border-gray-200 text-xs text-gray-600">
//                             <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-600" />
//                             <span className="font-medium">
//                               {project.created_at
//                                 ? new Date(
//                                     project.created_at,
//                                   ).toLocaleDateString("en-US", {
//                                     month: "short",
//                                     day: "numeric",
//                                     year: "numeric",
//                                   })
//                                 : "Initializing"}
//                             </span>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Right Side - Manage Depts and Menu */}
//                       <div className="flex flex-col items-end gap-2">
//                         {/* Top Row: Manage Depts + 3 Dots */}
//                         <div className="flex items-center gap-3">
//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               setSelectedProject(project);
//                               setManageDeptOpen(true);
//                             }}
//                             className="inline-flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium text-indigo-700 rounded-lg hover:bg-indigo-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-300 whitespace-nowrap"
//                             aria-label={`Manage departments for ${project.name}`}
//                           >
//                             <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600" />
//                             <span className="hidden xs:inline">Manage</span>
//                             <span>Depts</span>
//                           </button>

//                           <div className="relative">
//                             <button
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 setOpenMenuProjectId(
//                                   openMenuProjectId === project.id
//                                     ? null
//                                     : project.id,
//                                 );
//                               }}
//                               aria-haspopup="menu"
//                               aria-expanded={openMenuProjectId === project.id}
//                               aria-label={`Open actions for ${project.name}`}
//                               className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-colors"
//                               type="button"
//                             >
//                               <MoreVertical className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
//                             </button>

//                             {/* {openMenuProjectId === project.id && (
//                               <div
//                                 onClick={(e) => e.stopPropagation()}
//                                 role="menu"
//                                 aria-label={`Project actions menu for ${project.name}`}
//                                 className="absolute right-0 mt-1 sm:mt-2 bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-100 z-20 p-0.5 sm:p-1"
//                               >
//                                 <button
//                                   role="menuitem"
//                                   aria-label={`Delete project ${project.name}`}
//                                   title="Delete Project"
//                                   onClick={() => {
//                                     setOpenMenuProjectId(null);
//                                     handleDeleteProject(
//                                       project.id,
//                                       project.name,
//                                     );
//                                   }}
//                                   className="inline-flex items-center justify-center p-1.5 sm:p-2 text-rose-600 hover:bg-rose-50 rounded-md sm:rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 transition-colors"
//                                   type="button"
//                                 >
//                                   <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
//                                 </button>
//                               </div>
//                             )} */}

//                             {openMenuProjectId === project.id && (
//                               <div
//                                 onClick={(e) => e.stopPropagation()}
//                                 role="menu"
//                                 className="
//       absolute right-0 mt-2 z-30 min-w-[180px]
//       rounded-2xl border border-gray-200/60
//       bg-white/80 backdrop-blur-xl
//       shadow-[0_10px_40px_rgba(0,0,0,0.08)]
//       p-1.5
//       animate-in fade-in zoom-in-95 duration-150
//     "
//                               >
//                                 {/* ✏️ RENAME */}
//                                 <button
//                                   onClick={() => {
//                                     setOpenMenuProjectId(null);
//                                     handleRenameProject(
//                                       project.id,
//                                       project.name,
//                                     );
//                                   }}
//                                   className="
//         group w-full flex items-center gap-3
//         px-3.5 py-2.5 rounded-xl
//         text-sm font-medium text-gray-700
//         hover:bg-gradient-to-r hover:from-indigo-50 hover:to-violet-50
//         transition-all duration-200
//       "
//                                 >
//                                   <div className="p-1.5 rounded-lg bg-indigo-100 group-hover:bg-indigo-200 transition">
//                                     <Pencil className="w-4 h-4 text-indigo-600" />
//                                   </div>
//                                   <span className="flex-1 text-left">
//                                     Rename Project
//                                   </span>
//                                 </button>

//                                 {/* Divider */}
//                                 <div className="my-1 h-px bg-gray-100" />

//                                 {/* 🗑 DELETE */}
//                                 <button
//                                   onClick={() => {
//                                     setOpenMenuProjectId(null);
//                                     handleDeleteProject(
//                                       project.id,
//                                       project.name,
//                                     );
//                                   }}
//                                   className="
//         group w-full flex items-center gap-3
//         px-3.5 py-2.5 rounded-xl
//         text-sm font-medium text-rose-600
//         hover:bg-gradient-to-r hover:from-rose-50 hover:to-red-50
//         transition-all duration-200
//       "
//                                 >
//                                   <div className="p-1.5 rounded-lg bg-rose-100 group-hover:bg-rose-200 transition">
//                                     <Trash2 className="w-4 h-4 text-rose-600" />
//                                   </div>
//                                   <span className="flex-1 text-left">
//                                     Delete Project
//                                   </span>
//                                 </button>
//                               </div>
//                             )}
//                           </div>
//                         </div>

//                         {/* Bottom Row: Active Badge */}
//                         {/* <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-emerald-50/80 text-emerald-700 text-[11px] sm:text-xs lg:text-sm font-semibold border border-emerald-200/50 backdrop-blur-sm shadow-sm">
//                           <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-400" />
//                           Active
//                         </span> */}
//                       </div>
//                     </div>

//                     <div className="mt-3 sm:mt-4 pt-3 sm:pt-3 border-t border-gradient-to-r from-indigo-100/50 via-purple-100/50 to-transparent flex items-center justify-between">
//                       <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600 group-hover:text-indigo-600 transition-colors">
//                         <div className="w-6 h-0.5 sm:w-8 sm:h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-transparent rounded-full group-hover:w-10 sm:group-hover:w-12 group-hover:shadow-sm group-hover:shadow-indigo-300 transition-all duration-500" />
//                         <span className="text-sm font-medium">
//                           Open project
//                         </span>
//                       </div>
//                       <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-2 transition-all duration-300" />
//                     </div>
//                   </div>
//                 </article>
//               ))}
//             </div>
//           )}
//         </section>
//       </div>

//       {/* ==================== MODALS ==================== */}
//       {selectedProject && (
//         <ManageProjectDepartmentsModal
//           open={manageDeptOpen}
//           project={selectedProject}
//           projectId={selectedProject.id}
//           onClose={() => {
//             setManageDeptOpen(false);
//             setSelectedProject(null);
//           }}
//           onUpdated={async () => {
//             try {
//               const res = await getCustomer(companyId);
//               setData({
//                 company: res.data.company || null,
//                 admin: (res.data.users && res.data.users[0]) || null,
//                 projects: res.data.projects || [],
//               });
//             } catch (err) {
//               toast.error("Failed to refresh projects");
//             }
//           }}
//         />
//       )}

//       <CreateProjectModal
//         open={createOpen}
//         customerId={company.id}
//         onClose={() => setCreateOpen(false)}
//         onCreated={async () => {
//           setCreateOpen(false);
//           setLoading(true);

//           try {
//             const res = await getCustomer(company.id);
//             const companyData = res.data || {};
//             const adminUser =
//               (companyData.users && companyData.users[0]) || null;

//             setData({
//               company: companyData.company || null,
//               admin: adminUser,
//               projects: companyData.projects || [],
//             });
//           } catch (err) {
//             console.error("Reload after create failed", err);
//           } finally {
//             setLoading(false);
//           }
//         }}
//       />

//       <div className="h-6 sm:h-8 lg:h-12" />
//     </div>
//   );
// }

// src/pages/admin/CustomerProfile.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAdminApi } from "../../api/adminApi";
import { useProjectsApi } from "../../api/projectsApi";
import { useAuth } from "../../hooks/useAuth";
import CreateProjectModal from "../../components/modals/CreateProjectModal";
import ManageProjectDepartmentsModal from "../../components/modals/ManageProjectDepartmentsModal";

import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useBreadcrumb } from "../../context/BreadcrumbContext";

import {
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Folder,
  FolderOpen,
  Briefcase,
  MoreVertical,
  Eye,
  ArrowRight,
  ArrowLeft,
  Trash2,
  Plus,
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  LayoutGrid,
  ExternalLink,
  Sparkles,
  Shield,
  Hash,
  ChevronRight,
  FileText,
  Activity,
  TrendingUp,
  Users,
  Star,
  Pencil,
} from "lucide-react";

export default function CustomerProfile() {
  const { companyId } = useParams();
  const { getCustomer, deleteProject, unassignDepartmentFromProject } =
    useAdminApi();

  const { renameProject } = useProjectsApi();

  const [createOpen, setCreateOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [manageDeptOpen, setManageDeptOpen] = useState(false);
  const [openMenuProjectId, setOpenMenuProjectId] = useState(null);
  const [projectSearchTerm, setProjectSearchTerm] = useState("");

  const [data, setData] = useState({
    company: null,
    admin: null,
    projects: [],
  });

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { isAdminLike } = useAuth();
  const { setBreadcrumb } = useBreadcrumb();

  // -------------------------------
  // FETCH COMPANY PROFILE
  // -------------------------------
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        if (!isAdminLike) {
          navigate("/projects", { replace: true });
          return;
        }

        const res = await getCustomer(companyId);
        if (cancelled) return;

        const companyData = res.data || {};
        const adminUser = (companyData.users && companyData.users[0]) || null;

        setBreadcrumb([
          { label: "Customers", to: "/admin/customers" },
          { label: companyData.company?.name || "Customer" },
        ]);

        setData({
          company: companyData.company || null,
          admin: adminUser,
          projects: companyData.projects || [],
        });
      } catch (err) {
        if (cancelled) return;
        console.error("Load company profile error", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [companyId, isAdminLike, navigate, setBreadcrumb]);

  useEffect(() => {
    const close = () => setOpenMenuProjectId(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  //------------------------------------------
  // DELETE PROJECT HANDLER
  //------------------------------------------
  const handleDeleteProject = async (projectId, name) => {
    const confirm = await Swal.fire({
      title: `Delete project "${name}"?`,
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete",
    });

    if (!confirm.isConfirmed) return;

    try {
      await deleteProject(projectId);

      setData((prev) => ({
        ...prev,
        projects: prev.projects.filter((p) => p.id !== projectId),
      }));

      Swal.fire("Deleted!", "Project removed successfully.", "success");
    } catch (err) {
      Swal.fire("Error", "Failed to delete project.", "error");
    }
  };

  const handleRenameProject = async (projectId, currentName) => {
    if (!document.getElementById("swal-rename-styles")) {
      const style = document.createElement("style");
      style.id = "swal-rename-styles";
      style.innerHTML = `
      .swal-rename-popup {
        border-radius: 16px !important;
        padding: 32px 28px 28px !important;
        box-shadow: 0 24px 64px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.08) !important;
        font-family: 'Inter', system-ui, sans-serif !important;
        border: 1px solid rgba(0,0,0,0.06) !important;
      }
      .swal-rename-title {
        font-size: 18px !important;
        font-weight: 600 !important;
        color: #0f172a !important;
        letter-spacing: -0.3px !important;
        margin-bottom: 4px !important;
      }
      .swal-rename-input {
        border: 1.5px solid #e2e8f0 !important;
        border-radius: 10px !important;
        font-size: 14px !important;
        color: #1e293b !important;
        padding: 11px 14px !important;
        margin-top: 16px !important;
        transition: border-color 0.15s ease, box-shadow 0.15s ease !important;
        box-shadow: none !important;
        outline: none !important;
      }
      .swal-rename-input:focus {
        border-color: #3b82f6 !important;
        box-shadow: 0 0 0 3px rgba(59,130,246,0.12) !important;
      }
      .swal-rename-validation {
        font-size: 12.5px !important;
        color: #ef4444 !important;
        margin-top: 6px !important;
        text-align: left !important;
      }
      .swal-rename-actions {
        gap: 10px !important;
        margin-top: 24px !important;
      }
      .swal-rename-confirm {
        background: #2563eb !important;
        border-radius: 9px !important;
        font-size: 14px !important;
        font-weight: 500 !important;
        padding: 10px 22px !important;
        box-shadow: none !important;
        transition: background 0.15s ease !important;
        border: none !important;
      }
      .swal-rename-confirm:hover {
        background: #1d4ed8 !important;
      }
      .swal-rename-cancel {
        background: transparent !important;
        border: 1.5px solid #e2e8f0 !important;
        border-radius: 9px !important;
        font-size: 14px !important;
        font-weight: 500 !important;
        color: #64748b !important;
        padding: 10px 22px !important;
        box-shadow: none !important;
      }
      .swal-rename-cancel:hover {
        border-color: #cbd5e1 !important;
        color: #475569 !important;
        background: #f8fafc !important;
      }
    `;
      document.head.appendChild(style);
    }

    const { value: newName } = await Swal.fire({
      title: "Rename Project",
      input: "text",
      inputValue: currentName,
      inputPlaceholder: "Enter new project name",
      showCancelButton: true,
      confirmButtonText: "Rename",
      customClass: {
        popup: "swal-rename-popup",
        title: "swal-rename-title",
        input: "swal-rename-input",
        validationMessage: "swal-rename-validation",
        actions: "swal-rename-actions",
        confirmButton: "swal-rename-confirm",
        cancelButton: "swal-rename-cancel",
      },
      inputValidator: (value) => {
        if (!value || !value.trim()) {
          return "Project name cannot be empty";
        }
      },
    });

    if (!newName) return;

    try {
      await renameProject(projectId, newName);

      setData((prev) => ({
        ...prev,
        projects: prev.projects.map((p) =>
          p.id === projectId ? { ...p, name: newName } : p,
        ),
      }));

      toast.success("Project renamed successfully");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to rename project");
    }
  };

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
              Loading Customer Profile
            </h2>
            <p className="text-xs sm:text-sm lg:text-base text-gray-500">
              Please wait we are about to Fetch Customer Projects details....
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
  // -------------------------------
  // NOT FOUND UI
  // -------------------------------
  if (!data.company) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-10 text-center max-w-sm w-full">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-red-50 flex items-center justify-center">
            <XCircle className="w-7 h-7 text-red-400" />
          </div>
          <h2 className="text-base font-bold text-gray-900 mb-1">
            Company Not Found
          </h2>
          <p className="text-sm text-gray-400 mb-6">
            This company doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/admin/customers")}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const { company, admin, projects } = data;

  return (
    <div className="w-full min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* ── Hero Card ── */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Blue top accent */}
          <div className="h-1 w-full bg-blue-600" />

          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
              {/* Left: avatar + company info */}
              <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-blue-600 flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-2xl sm:text-3xl">
                      {company.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-white rounded-full flex items-center justify-center border border-gray-100 shadow-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  </div>
                </div>

                {/* Info */}
                <div className="min-w-0 space-y-2.5">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight leading-snug">
                      {company.name}
                    </h1>

                    <div className="flex items-center gap-2 mt-1.5 text-sm text-gray-500">
                      <Building2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="font-medium">Customer Organization</span>
                    </div>
                  </div>

                  {admin && (
                    <div className="flex flex-col items-start gap-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 max-w-full">
                        <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <Shield className="w-3.5 h-3.5 text-blue-600" />
                        </div>

                        <span className="font-medium truncate flex-1 min-w-0">
                          {admin.email}
                        </span>

                        <span className="text-xs text-blue-600 border-l border-gray-200 pl-3 ml-auto font-medium whitespace-nowrap">
                          Customer Admin
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Create button */}
              <div className="flex-shrink-0">
                <button
                  onClick={() => setCreateOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-base font-semibold rounded-xl shadow-sm hover:shadow-md transition-all duration-150"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Project</span>
                </button>
              </div>
            </div>

            {/* Stats row */}
            <div className="mt-6 pt-5 border-t border-gray-100 flex flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                  <Folder className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900 leading-none">
                    {projects.length}
                  </p>
                  <p className="text-sm text-gray-400 mt-0.5">Projects</p>
                </div>
              </div>
              <div className="w-px bg-gray-100 self-stretch mx-1 hidden sm:block" />
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                  <Users className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900 leading-none">
                    1
                  </p>
                  <p className="text-sm text-gray-400 mt-0.5">Admins</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Projects Section ── */}
        <section>
          {/* Section header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-2.5 bg-blue-600 rounded-xl shadow-md shadow-blue-500/25 flex-shrink-0">
                <LayoutGrid className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Projects</h2>
                <p className="text-sm text-gray-400">
                  Manage and view all customer projects
                </p>
              </div>
            </div>

            {/* Search */}
            <div className="w-full sm:max-w-xs">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={projectSearchTerm}
                  onChange={(e) => setProjectSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 placeholder:text-gray-400 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Empty state */}
          {projects.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-14 text-center">
              <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                <FolderOpen className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-base font-bold text-gray-800 mb-1.5">
                No Projects Yet
              </h3>
              <p className="text-sm text-gray-400 mb-6 max-w-xs mx-auto">
                Get started by creating the first project for this customer.
              </p>
              <button
                onClick={() => setCreateOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Create First Project
              </button>
            </div>
          ) : (
            /* Projects grid */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {projects
                .filter((p) =>
                  p.name
                    .toLowerCase()
                    .includes(projectSearchTerm.toLowerCase()),
                )
                .map((project, index) => {
                  const accentColors = [
                    {
                      bar: "from-blue-500 to-indigo-500",
                      icon: "from-blue-500 to-indigo-600",
                      shadow: "shadow-blue-500/30",
                      ring: "focus:ring-blue-300",
                      hover: "hover:border-blue-200",
                    },
                    {
                      bar: "from-violet-500 to-purple-500",
                      icon: "from-violet-500 to-purple-600",
                      shadow: "shadow-violet-500/30",
                      ring: "focus:ring-violet-300",
                      hover: "hover:border-violet-200",
                    },
                    {
                      bar: "from-emerald-500 to-teal-500",
                      icon: "from-emerald-500 to-teal-600",
                      shadow: "shadow-emerald-500/30",
                      ring: "focus:ring-emerald-300",
                      hover: "hover:border-emerald-200",
                    },
                    {
                      bar: "from-amber-500 to-orange-500",
                      icon: "from-amber-500 to-orange-600",
                      shadow: "shadow-amber-500/30",
                      ring: "focus:ring-amber-300",
                      hover: "hover:border-amber-200",
                    },
                    {
                      bar: "from-rose-500 to-pink-500",
                      icon: "from-rose-500 to-pink-600",
                      shadow: "shadow-rose-500/30",
                      ring: "focus:ring-rose-300",
                      hover: "hover:border-rose-200",
                    },
                  ];
                  const color = accentColors[index % accentColors.length];

                  return (
                    <article
                      key={project.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        if (!project.created_at) {
                          toast.info(
                            "Project is initializing, please wait a moment",
                          );
                          return;
                        }
                        navigate(`/projects/${project.id}/folders`);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          if (!project.created_at) {
                            toast.info(
                              "Project is initializing, please wait a moment",
                            );
                            return;
                          }
                          navigate(`/projects/${project.id}/folders`);
                        }
                      }}
                      className={`group relative bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl ${color.hover} hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer focus:outline-none ${color.ring} focus:ring-2`}
                      style={{
                        animationDelay: `${index * 60}ms`,
                        animation: "fadeInUp 0.4s ease-out forwards",
                        opacity: 0,
                      }}
                    >
                      {/* Colored top accent bar */}
                      <div
                        className={`h-1 w-full bg-gradient-to-r ${color.bar}`}
                      />

                      <div className="p-5 sm:p-6">
                        <div className="flex items-start gap-4">
                          {/* Project icon — gradient, switches open on hover */}
                          <div
                            className={`relative flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${color.icon} shadow-lg ${color.shadow} flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}
                          >
                            <Folder className="w-6 h-6 sm:w-7 sm:h-7 text-white group-hover:hidden" />
                            <FolderOpen className="w-6 h-6 sm:w-7 sm:h-7 text-white hidden group-hover:block" />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <h3
                              className="text-lg sm:text-xl font-semibold text-gray-900 tracking-tight group-hover:text-blue-600 transition-all duration-200 truncate"
                              title={project.name}
                            >
                              {project.name}
                            </h3>
                            <p className="text-sm text-gray-400 mt-0.5">
                              Project
                            </p>

                            <div className="mt-2.5 flex flex-wrap items-center gap-2">
                              {project.created_at ? (
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 border border-gray-100 rounded-lg text-sm text-gray-500 font-medium">
                                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                  {new Date(
                                    project.created_at,
                                  ).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </div>
                              ) : (
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-100 rounded-lg text-sm text-amber-600 font-medium">
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  Initializing…
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedProject(project);
                                setManageDeptOpen(true);
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 whitespace-nowrap"
                              aria-label={`Manage departments for ${project.name}`}
                            >
                              <Users className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">
                                Manage Depts
                              </span>
                              <span className="sm:hidden">Depts</span>
                            </button>

                            <div className="relative">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenMenuProjectId(
                                    openMenuProjectId === project.id
                                      ? null
                                      : project.id,
                                  );
                                }}
                                aria-haspopup="menu"
                                aria-expanded={openMenuProjectId === project.id}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
                                type="button"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </button>

                              {openMenuProjectId === project.id && (
                                <div
                                  onClick={(e) => e.stopPropagation()}
                                  role="menu"
                                  className="absolute right-0 mt-1.5 z-30 min-w-[172px] rounded-xl border border-gray-200 bg-white shadow-lg p-1"
                                >
                                  <button
                                    onClick={() => {
                                      setOpenMenuProjectId(null);
                                      handleRenameProject(
                                        project.id,
                                        project.name,
                                      );
                                    }}
                                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                  >
                                    <div className="p-1 rounded-md bg-blue-50">
                                      <Pencil className="w-3.5 h-3.5 text-blue-600" />
                                    </div>
                                    Rename Project
                                  </button>
                                  <div className="my-1 h-px bg-gray-100" />
                                  <button
                                    onClick={() => {
                                      setOpenMenuProjectId(null);
                                      handleDeleteProject(
                                        project.id,
                                        project.name,
                                      );
                                    }}
                                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors"
                                  >
                                    <div className="p-1 rounded-md bg-red-50">
                                      <Trash2 className="w-3.5 h-3.5 text-red-500" />
                                    </div>
                                    Delete Project
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-gray-400 group-hover:text-blue-600 transition-colors">
                            <FolderOpen className="w-4 h-4" />
                            <span className="font-medium">Open Project</span>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-300" />
                        </div>
                      </div>
                    </article>
                  );
                })}

              {/* No search results */}
              {projects.filter((p) =>
                p.name.toLowerCase().includes(projectSearchTerm.toLowerCase()),
              ).length === 0 &&
                projectSearchTerm && (
                  <div className="col-span-full text-center py-10 text-gray-400 text-sm">
                    No projects match "
                    <span className="font-semibold text-gray-600">
                      {projectSearchTerm}
                    </span>
                    "
                  </div>
                )}
            </div>
          )}
        </section>
      </div>

      {/* ── Modals ── */}
      {selectedProject && (
        <ManageProjectDepartmentsModal
          open={manageDeptOpen}
          project={selectedProject}
          projectId={selectedProject.id}
          onClose={() => {
            setManageDeptOpen(false);
            setSelectedProject(null);
          }}
          onUpdated={async () => {
            try {
              const res = await getCustomer(companyId);
              setData({
                company: res.data.company || null,
                admin: (res.data.users && res.data.users[0]) || null,
                projects: res.data.projects || [],
              });
            } catch (err) {
              toast.error("Failed to refresh projects");
            }
          }}
        />
      )}

      <CreateProjectModal
        open={createOpen}
        customerId={company.id}
        onClose={() => setCreateOpen(false)}
        onCreated={async () => {
          setCreateOpen(false);
          setLoading(true);
          try {
            const res = await getCustomer(company.id);
            const companyData = res.data || {};
            const adminUser =
              (companyData.users && companyData.users[0]) || null;
            setData({
              company: companyData.company || null,
              admin: adminUser,
              projects: companyData.projects || [],
            });
          } catch (err) {
            console.error("Reload after create failed", err);
          } finally {
            setLoading(false);
          }
        }}
      />

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div className="h-8" />
    </div>
  );
}
