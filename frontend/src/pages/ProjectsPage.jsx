// // frontend/src/pages/ProjectsPage.jsx
// import React, { useEffect, useState } from "react";
// import { useProjectsApi } from "../api/projectsApi";
// import { useAuth } from "../hooks/useAuth";
// import ProjectCard from "../components/ProjectCard";
// import { useBreadcrumb } from "../context/BreadcrumbContext";

// import {
//   Building2,
//   Users,
//   FolderKanban,
//   ChevronRight,
//   Loader2,
//   Calendar,
//   Sparkles,
//   ArrowRight,
//   Building,
//   Clock,
//   TrendingUp,
//   Search,
//   Filter,
// } from "lucide-react";

// const ProjectsPage = () => {
//   const { getAllProjects } = useProjectsApi();
//   const { user } = useAuth();
//   const { setBreadcrumb } = useBreadcrumb();

//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const loadProjects = async () => {
//     try {
//       const res = await getAllProjects();
//       setProjects(res.data);
//     } catch (err) {
//       console.error("Failed to load projects:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadProjects();

//     setBreadcrumb([{ label: "Projects", to: "/projects" }]);
//   }, [setBreadcrumb]);

//   // -------------------------------
//   // LOADING UI
//   // -------------------------------
//   if (loading) {
//     return (
//       <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 flex items-center justify-center p-3 sm:p-6">
//         <div className="text-center space-y-4 sm:space-y-6">
//           {/* Animated Loader */}
//           <div className="relative inline-flex items-center justify-center">
//             {/* Outer pulsing ring */}
//             <div className="absolute w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 opacity-20 animate-ping"></div>

//             {/* Middle ring */}
//             <div className="absolute w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full border-4 border-indigo-200 animate-pulse"></div>

//             {/* Main loader */}
//             <div className="relative w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-indigo-700 flex items-center justify-center shadow-xl shadow-indigo-500/30">
//               <Building2 className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white animate-pulse" />
//             </div>

//             {/* Spinning outer ring */}
//             <div className="absolute w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full border-4 border-transparent border-t-blue-500 border-r-indigo-600 animate-spin"></div>
//           </div>

//           {/* Text */}
//           <div className="space-y-1 sm:space-y-2">
//             <h2 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
//               Loading Projects
//             </h2>
//             <p className="text-xs sm:text-sm lg:text-base text-gray-500">
//               Please wait we are about to Fetch Project details...
//             </p>
//           </div>

//           {/* Loading dots */}
//           <div className="flex justify-center items-center gap-1 sm:gap-1.5">
//             {[0, 1, 2].map((i) => (
//               <div
//                 key={i}
//                 className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 animate-bounce"
//                 style={{ animationDelay: `${i * 150}ms` }}
//               />
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="relative w-full min-h-screen">
//       {/* Background design - Hide complex gradients on mobile for performance */}
//       <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-violet-50/30">
//         <div className="hidden sm:block absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_transparent,_white_50%)]"></div>
//         <div className="hidden sm:block absolute top-0 right-0 w-64 h-64 lg:w-96 lg:h-96 bg-gradient-to-br from-purple-100/40 to-indigo-100/40 rounded-full blur-3xl"></div>
//         <div className="hidden sm:block absolute bottom-0 left-0 w-64 h-64 lg:w-96 lg:h-96 bg-gradient-to-tr from-blue-100/40 to-purple-100/40 rounded-full blur-3xl"></div>
//       </div>

//       {/* Content container */}
//       <div className="relative w-full">
//         <style>{`
//           div::-webkit-scrollbar {
//             width: 8px;
//           }
//           div::-webkit-scrollbar-track {
//             background: rgba(241, 245, 249, 0.5);
//             border-radius: 10px;
//           }
//           div::-webkit-scrollbar-thumb {
//             background: linear-gradient(to bottom, #8b5cf6, #6366f1);
//             border-radius: 10px;
//             border: 2px solid transparent;
//             background-clip: padding-box;
//           }
//           div::-webkit-scrollbar-thumb:hover {
//             background: linear-gradient(to bottom, #7c3aed, #4f46e5);
//             background-clip: padding-box;
//           }
//         `}</style>

//         <div className="relative z-10 pt-2 sm:pt-3 md:pt-4 lg:pt-6 xl:pt-8 px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 max-w-7xl mx-auto">
//           {/* Enhanced Header */}
//           <div className="mb-3 sm:mb-4 md:mb-5 lg:mb-6 xl:mb-8">
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
//               <div className="space-y-1 sm:space-y-2">
//                 <div className="flex items-center gap-2 sm:gap-3">
//                   <div className="w-1 sm:w-1.5 h-7 sm:h-9 lg:h-10 bg-gradient-to-b from-indigo-500 to-blue-600 rounded-full"></div>

//                   <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold">
//                     <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-500 bg-clip-text text-transparent">
//                       Projects
//                     </span>
//                   </h1>
//                 </div>

//                 <p className="text-xs sm:text-sm md:text-base text-gray-600 font-medium ml-3 sm:ml-4">
//                   {user?.role === "department"
//                     ? "Projects assigned to your department"
//                     : user?.role === "customer"
//                       ? "Projects under your organization"
//                       : "Explore and manage all projects"}
//                 </p>
//               </div>

//               {/* Project count badge */}
//               {projects.length > 0 && (
//                 <div className="self-start sm:self-auto flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-sm sm:shadow-md border border-gray-200/50">
//                   <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
//                   <span className="text-[10px] sm:text-xs font-semibold text-gray-700">
//                     {projects.length} Active
//                   </span>
//                 </div>
//               )}
//             </div>

//             {/* Decorative line */}
//             <div className="mt-2 sm:mt-3 lg:mt-4 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
//           </div>

//           {/* Projects Grid */}
//           {projects.length === 0 ? (
//             <div className="flex flex-col items-center justify-center py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
//               <div className="relative">
//                 {/* Empty state illustration background */}
//                 <div className="absolute inset-0 w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 bg-gradient-to-br from-purple-200/30 to-indigo-200/30 rounded-full blur-2xl"></div>

//                 {/* Icon container */}
//                 <div className="relative w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 bg-gradient-to-br from-white to-gray-50 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl flex items-center justify-center mb-4 sm:mb-6 transform rotate-3 hover:rotate-0 transition-transform duration-500">
//                   <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-2xl sm:rounded-3xl"></div>
//                   <svg
//                     className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 text-gray-400"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={1.5}
//                       d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
//                     />
//                   </svg>
//                 </div>
//               </div>

//               <div className="text-center space-y-2 sm:space-y-3 max-w-xs sm:max-w-sm lg:max-w-md">
//                 <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent px-2">
//                   {user?.role === "department"
//                     ? "No projects assigned to your department"
//                     : user?.role === "customer"
//                       ? "No projects available for your company"
//                       : "No projects created yet"}
//                 </h3>
//               </div>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-8 animate-fadeIn">
//               {projects.map((project, index) => (
//                 <div
//                   key={project.id}
//                   className="group relative transform transition-all duration-500 hover:scale-[1.01] sm:hover:scale-[1.02] hover:-translate-y-0.5 sm:hover:-translate-y-1"
//                   style={{ animationDelay: `${index * 50}ms` }}
//                 >
//                   {/* Card glow effect on hover - lighter on mobile */}
//                   <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/10 sm:from-purple-500/20 to-indigo-500/10 sm:to-indigo-500/20 rounded-xl sm:rounded-2xl blur-md sm:blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

//                   <div className="relative bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-md sm:shadow-xl hover:shadow-lg sm:hover:shadow-2xl transition-shadow duration-500 overflow-hidden">
//                     <ProjectCard project={project} />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* Bottom spacing */}
//           <div className="h-6 sm:h-8 md:h-10 lg:h-12 xl:h-16"></div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProjectsPage;

// // frontend/src/pages/ProjectsPage.jsx
// import React, { useEffect, useState } from "react";
// import { useProjectsApi } from "../api/projectsApi";
// import { useAuth } from "../hooks/useAuth";
// import ProjectCard from "../components/ProjectCard";
// import { useBreadcrumb } from "../context/BreadcrumbContext";

// import { Building2 } from "lucide-react";

// const ProjectsPage = () => {
//   const { getAllProjects } = useProjectsApi();
//   const { user } = useAuth();
//   const { setBreadcrumb } = useBreadcrumb();

//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [view, setView] = useState("grid"); // ✅ NEW

//   const loadProjects = async () => {
//     try {
//       const res = await getAllProjects();
//       setProjects(res.data);
//     } catch (err) {
//       console.error("Failed to load projects:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadProjects();
//     setBreadcrumb([{ label: "Projects", to: "/projects" }]);
//   }, [setBreadcrumb]);

//   // ---------------- LOADING ----------------
//   if (loading) {
//     return (
//       <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 flex items-center justify-center p-3 sm:p-6">
//         <div className="text-center space-y-4 sm:space-y-6">
//           <div className="relative inline-flex items-center justify-center">
//             <div className="absolute w-24 h-24 rounded-full bg-blue-500/20 animate-ping"></div>
//             <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
//               <Building2 className="w-8 h-8 text-white animate-pulse" />
//             </div>
//           </div>

//           <h2 className="text-xl font-bold text-blue-600">
//             Loading Projects...
//           </h2>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="relative w-full min-h-screen">
//       {/* Background */}
//       <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-violet-50/30" />

//       <div className="relative z-10 px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto">
//         {/* HEADER */}
//         <div className="mb-6">
//           <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
//             {/* Title */}
//             <div>
//               <h1 className="text-2xl sm:text-3xl font-bold text-indigo-600">
//                 Projects
//               </h1>
//               <p className="text-sm text-gray-500">
//                 {user?.role === "department"
//                   ? "Projects assigned to your department"
//                   : user?.role === "customer"
//                     ? "Projects under your organization"
//                     : "Explore and manage all projects"}
//               </p>
//             </div>

//             {/* RIGHT SIDE */}
//             <div className="flex items-center gap-3">
//               {/* VIEW TOGGLE */}
//               <div className="flex bg-white border rounded-lg p-1 shadow-sm">
//                 <button
//                   onClick={() => setView("grid")}
//                   className={`px-3 py-1 text-xs font-semibold rounded-md ${
//                     view === "grid"
//                       ? "bg-indigo-500 text-white"
//                       : "text-gray-600 hover:bg-gray-100"
//                   }`}
//                 >
//                   Grid
//                 </button>
//                 <button
//                   onClick={() => setView("list")}
//                   className={`px-3 py-1 text-xs font-semibold rounded-md ${
//                     view === "list"
//                       ? "bg-indigo-500 text-white"
//                       : "text-gray-600 hover:bg-gray-100"
//                   }`}
//                 >
//                   List
//                 </button>
//               </div>

//               {/* COUNT */}
//               {projects.length > 0 && (
//                 <div className="px-3 py-1 bg-white border rounded-lg text-xs font-semibold">
//                   {projects.length} Active
//                 </div>
//               )}
//             </div>
//           </div>

//           <div className="mt-3 h-px bg-gray-200" />
//         </div>

//         {/* EMPTY STATE */}
//         {projects.length === 0 ? (
//           <div className="flex flex-col items-center py-20 text-gray-500">
//             <Building2 className="w-12 h-12 mb-4" />
//             <p>No projects found</p>
//           </div>
//         ) : view === "grid" ? (
//           // ================= GRID =================
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//             {projects.map((project, index) => (
//               <div
//                 key={project.id}
//                 className="transform hover:scale-[1.02] transition"
//                 style={{ animationDelay: `${index * 50}ms` }}
//               >
//                 <ProjectCard project={project} />
//               </div>
//             ))}
//           </div>
//         ) : (
//           // ================= LIST =================
//           <div className="flex flex-col gap-3">
//             {projects.map((project) => (
//               <ProjectCard key={project.id} project={project} view="list" />
//             ))}
//           </div>
//         )}

//         <div className="h-10" />
//       </div>
//     </div>
//   );
// };

// export default ProjectsPage;

// frontend/src/pages/ProjectsPage.jsx
import React, { useEffect, useState } from "react";
import { useProjectsApi } from "../api/projectsApi";
import { useAuth } from "../hooks/useAuth";
import ProjectCard from "../components/ProjectCard";
import { useBreadcrumb } from "../context/BreadcrumbContext";
import { Building2, Grid3x3, List, Sparkles, Loader2 } from "lucide-react";

const getFinancialYears = (projects = []) => {
  const fyMap = new Map();

  projects.forEach((p) => {
    const date = new Date(p.created_at);
    if (isNaN(date)) return;

    const year = date.getFullYear();
    const month = date.getMonth(); // 0-11

    // Financial year logic (April start)
    const fyStartYear = month >= 3 ? year : year - 1;

    const label = `April ${fyStartYear} - March ${fyStartYear + 1}`;

    if (!fyMap.has(label)) {
      fyMap.set(label, {
        label,
        start: new Date(fyStartYear, 3, 1),
        end: new Date(fyStartYear + 1, 2, 31),
      });
    }
  });

  // Convert to array
  let fyList = Array.from(fyMap.values());

  // Sort latest first
  fyList.sort((a, b) => b.start - a.start);

  // OPTIONAL: Add previous FY if not present
  const today = new Date();
  const currentFYStartYear =
    today.getMonth() >= 3 ? today.getFullYear() : today.getFullYear() - 1;

  const prevLabel = `April ${currentFYStartYear - 1} - March ${currentFYStartYear}`;

  if (!fyList.find((fy) => fy.label === prevLabel)) {
    fyList.push({
      label: prevLabel,
      start: new Date(currentFYStartYear - 1, 3, 1),
      end: new Date(currentFYStartYear, 2, 31),
    });
  }

  return fyList;
};

const getProjectCountByFY = (projects, fy) => {
  return projects.filter((p) => {
    const created = new Date(p.created_at);
    if (isNaN(created)) return false;

    return created >= fy.start && created <= fy.end;
  }).length;
};

const ProjectsPage = () => {
  const { getAllProjects } = useProjectsApi();
  const { user } = useAuth();
  const { setBreadcrumb } = useBreadcrumb();
  const [selectedFY, setSelectedFY] = useState(null);

  const [projects, setProjects] = useState([]); // ✅ define first

  const financialYears = getFinancialYears(projects); // ✅ now safe
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("grid");

  const filteredProjects = selectedFY
    ? projects.filter((p) => {
        const created = new Date(p.created_at);
        return created >= selectedFY.start && created <= selectedFY.end;
      })
    : projects;

  const loadProjects = async () => {
    try {
      const res = await getAllProjects();
      setProjects(
        res.data.map((p) => ({
          ...p,
          customer_name: p.company_name, // ✅ normalize backend → frontend
        })),
      );
    } catch (err) {
      console.error("Failed to load projects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
    setBreadcrumb([{ label: "Projects", to: "/projects" }]);
  }, [setBreadcrumb]);

  useEffect(() => {
    console.log("PROJECTS DATA:", projects);
  }, [projects]);

  // useEffect(() => {
  //   if (projects.length) {
  //     const fyList = getFinancialYears(projects);
  //     const today = new Date();

  //     const currentFY = fyList.find(
  //       (fy) => today >= fy.start && today <= fy.end,
  //     );

  //     setSelectedFY(currentFY || null);
  //   }
  // }, [projects]);
  // ---------------- LOADING ----------------
  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center space-y-6">
          {/* Animated loader */}
          <div className="relative inline-flex items-center justify-center">
            {/* Outer ring */}
            <div className="absolute w-32 h-32 rounded-full border-4 border-violet-200 animate-ping" />

            {/* Middle ring */}
            <div className="absolute w-24 h-24 rounded-full border-4 border-indigo-300 animate-pulse" />

            {/* Inner circle with icon */}
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 flex items-center justify-center shadow-2xl">
              <Building2
                className="w-10 h-10 text-white animate-bounce"
                strokeWidth={2.5}
              />
            </div>

            {/* Orbiting dot */}
            <div
              className="absolute w-32 h-32 animate-spin"
              style={{ animationDuration: "3s" }}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-violet-500 rounded-full shadow-lg" />
            </div>
          </div>

          {/* Text */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Loading Projects
            </h2>
            <div className="flex items-center justify-center gap-1">
              <Loader2 className="w-4 h-4 text-violet-500 animate-spin" />
              <p className="text-sm text-gray-500">Please wait...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 px-2 sm:px-4 lg:px-6">
      <div className="relative z-10 py-8 max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Title Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl shadow-lg">
                  <Building2 className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <h1 className="text-3xl sm:text-4xl font-black leading-tight pl-[2px] bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Projects
                </h1>
                {/* <Sparkles className="w-6 h-6 text-violet-500 animate-pulse" /> */}
              </div>

              <p className="text-sm sm:text-base text-gray-600 font-medium ml-14">
                {user?.role === "department"
                  ? "Projects assigned to your department"
                  : user?.role === "customer"
                    ? "Projects under your organization"
                    : "Explore and manage all projects"}
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="flex bg-white border-2 border-gray-200 rounded-xl p-1 shadow-lg backdrop-blur-sm">
                <button
                  onClick={() => setView("grid")}
                  className={`px-4 py-2 text-sm font-bold rounded-lg transition-all duration-300 flex items-center gap-2 ${
                    view === "grid"
                      ? "bg-gradient-to-r from-violet-500 to-indigo-600 text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Grid3x3 className="w-4 h-4" strokeWidth={2.5} />
                  Grid
                </button>
                <button
                  onClick={() => setView("list")}
                  className={`px-4 py-2 text-sm font-bold rounded-lg transition-all duration-300 flex items-center gap-2 ${
                    view === "list"
                      ? "bg-gradient-to-r from-violet-500 to-indigo-600 text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <List className="w-4 h-4" strokeWidth={2.5} />
                  List
                </button>
              </div>

              {/* Count Badge */}
              <div>
                <select
                  value={selectedFY?.label || ""}
                  onChange={(e) => {
                    const fy = financialYears.find(
                      (f) => f.label === e.target.value,
                    );
                    setSelectedFY(fy || null);
                  }}
                  className="px-4 py-2 bg-white border-2 border-violet-200 rounded-xl shadow-lg text-sm font-semibold text-gray-700 focus:outline-none"
                >
                  <option value="">All Years</option>
                  {financialYears.map((fy) => {
                    const count = getProjectCountByFY(projects, fy);

                    return (
                      <option key={fy.label} value={fy.label}>
                        {fy.label} ({count})
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          </div>

          {/* Decorative divider */}
          <div className="mt-6 h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 rounded-full shadow-lg" />
        </div>

        {/* EMPTY STATE */}
        {filteredProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 px-4">
            <div className="relative">
              <div className="absolute inset-0 bg-violet-300/30 rounded-full blur-2xl animate-pulse" />
              <div className="relative p-6 bg-gradient-to-br from-violet-100 to-indigo-100 rounded-3xl shadow-xl">
                <Building2
                  className="w-16 h-16 text-violet-600"
                  strokeWidth={2}
                />
              </div>
            </div>
            <h3 className="mt-6 text-xl font-bold text-gray-700">
              No projects found
            </h3>
            <p className="mt-2 text-gray-500">
              Start by creating your first project
            </p>
          </div>
        ) : view === "grid" ? (
          // ================= GRID =================
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <div
                key={project.id}
                className="animate-fade-in-up"
                style={{
                  animationDelay: `${index * 75}ms`,
                  animationFillMode: "both",
                }}
              >
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        ) : (
          // ================= LIST =================
          <div className="flex flex-col gap-4">
            {filteredProjects.map((project, index) => (
              <div
                key={project.id}
                className="animate-fade-in-up"
                style={{
                  animationDelay: `${index * 50}ms`,
                  animationFillMode: "both",
                }}
              >
                <ProjectCard project={project} view="list" />
              </div>
            ))}
          </div>
        )}

        <div className="h-16" />
      </div>

      {/* Add this to your global CSS for the animation */}
      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ProjectsPage;
