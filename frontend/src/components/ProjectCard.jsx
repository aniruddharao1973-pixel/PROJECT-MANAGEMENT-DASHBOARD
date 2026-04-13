// // src/components/ProjectCard.jsx
// import React from "react";
// import { useNavigate, useLocation } from "react-router-dom";

// const ProjectCard = ({ project }) => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const isTeamsContext = location.pathname.startsWith("/teams");

//   const colors = [
//     "from-blue-500 to-blue-600",
//     "from-purple-500 to-purple-600",
//     "from-green-500 to-green-600",
//     "from-pink-500 to-pink-600",
//     "from-teal-500 to-sky-500",
//   ];

//   // Fix: UUID cannot use % → create numeric hash
//   const hashString = (str) => {
//     let hash = 0;
//     for (let i = 0; i < str.length; i++) {
//       hash = str.charCodeAt(i) + ((hash << 5) - hash);
//     }
//     return Math.abs(hash);
//   };

//   const color = colors[hashString(project.id) % colors.length];

//   return (
//     <div
//       onClick={() =>
//         navigate(
//           isTeamsContext
//             ? `/teams/projects/${project.id}/folders`
//             : `/projects/${project.id}/folders`
//         )
//       }
//       className="group cursor-pointer bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-purple-400 hover:-translate-y-2"
//     >
//       {/* Top colored strip with gradient */}
//       <div className={`h-2 bg-gradient-to-r ${color}`}></div>

//       <div className="p-6">
//         {/* Icon and Badge Row */}
//         <div className="flex items-center justify-between mb-4">
//           {/* Project Icon */}
//           <div
//             className={`h-14 w-14 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-7 w-7 text-white"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M3 7l9-4 9 4-9 4-9-4zm0 7l9 4 9-4"
//               />
//             </svg>
//           </div>

//           {/* Status Badge */}
//           <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
//             Active
//           </span>
//         </div>

//         {/* Project Name */}
//         <h3 className="text-xl font-bold text-gray-800 group-hover:text-purple-600 transition-colors duration-300 mb-3">
//           {project.name}
//         </h3>

//         {/* Divider */}
//         <div className="h-px bg-gradient-to-r from-purple-200 via-blue-200 to-transparent mb-4"></div>

//         {/* Details Section */}
//         <div className="space-y-2.5">
//           {/* Customer */}
//           {project.customer_name && (
//             <div className="flex items-center gap-2.5 text-sm">
//               <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
//                 <svg
//                   className="w-4 h-4 text-purple-600"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//                   />
//                 </svg>
//               </div>
//               <div className="flex-1">
//                 <p className="text-xs text-gray-500 font-medium">Customer</p>
//                 <p className="text-gray-800 font-semibold">
//                   {project.customer_name}
//                 </p>
//               </div>
//             </div>
//           )}

//           {/* Created Date */}
//           <div className="flex items-center gap-2.5 text-sm">
//             <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
//               <svg
//                 className="w-4 h-4 text-blue-600"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
//                 />
//               </svg>
//             </div>
//             <div className="flex-1">
//               <p className="text-xs text-gray-500 font-medium">Created</p>
//               <p className="text-gray-800 font-semibold">
//                 {new Date(project.created_at).toLocaleDateString()}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Arrow Icon - appears on hover */}
//         <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
//           <span className="text-gray-600 font-medium group-hover:text-purple-600 transition-colors">
//             View Details
//           </span>
//           <svg
//             className="w-5 h-5 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M13 7l5 5m0 0l-5 5m5-5H6"
//             />
//           </svg>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProjectCard;

// // src/components/ProjectCard.jsx
// import React from "react";
// import { useNavigate, useLocation } from "react-router-dom";

// const ProjectCard = ({ project, view = "grid" }) => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const isTeamsContext = location.pathname.startsWith("/teams");

//   const colors = [
//     "from-blue-500 to-blue-600",
//     "from-purple-500 to-purple-600",
//     "from-green-500 to-green-600",
//     "from-pink-500 to-pink-600",
//     "from-teal-500 to-sky-500",
//   ];

//   const hashString = (str) => {
//     let hash = 0;
//     for (let i = 0; i < str.length; i++) {
//       hash = str.charCodeAt(i) + ((hash << 5) - hash);
//     }
//     return Math.abs(hash);
//   };

//   const color = colors[hashString(project.id) % colors.length];

//   const handleClick = () => {
//     navigate(
//       isTeamsContext
//         ? `/teams/projects/${project.id}/folders`
//         : `/projects/${project.id}/folders`,
//     );
//   };

//   // ================= LIST VIEW =================
//   if (view === "list") {
//     return (
//       <div
//         onClick={handleClick}
//         className="group cursor-pointer flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/90 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-indigo-300"
//       >
//         {/* Icon */}
//         <div
//           className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center shadow-md group-hover:scale-105 transition`}
//         >
//           <svg
//             className="w-5 h-5 sm:w-6 sm:h-6 text-white"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path strokeWidth={2} d="M3 7l9-4 9 4-9 4-9-4zm0 7l9 4 9-4" />
//           </svg>
//         </div>

//         {/* Content */}
//         <div className="flex-1 min-w-0">
//           <h3 className="text-sm sm:text-base font-semibold text-gray-800 truncate group-hover:text-indigo-600">
//             {project.name}
//           </h3>

//           <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1 text-[11px] sm:text-xs text-gray-500">
//             {project.customer_name && (
//               <span className="flex items-center gap-1">
//                 {project.customer_name}
//               </span>
//             )}

//             <span>{new Date(project.created_at).toLocaleDateString()}</span>
//           </div>
//         </div>

//         {/* Arrow */}
//         <div className="text-gray-400 group-hover:text-indigo-500 transition">
//           <svg
//             className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
//           </svg>
//         </div>
//       </div>
//     );
//   }

//   // ================= GRID VIEW (UNCHANGED) =================
//   return (
//     <div
//       onClick={handleClick}
//       className="group cursor-pointer bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-purple-400 hover:-translate-y-2"
//     >
//       <div className={`h-2 bg-gradient-to-r ${color}`}></div>

//       <div className="p-6">
//         <div className="flex items-center justify-between mb-4">
//           <div
//             className={`h-14 w-14 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg group-hover:scale-110 transition`}
//           >
//             <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24">
//               <path strokeWidth={2} d="M3 7l9-4 9 4-9 4-9-4zm0 7l9 4 9-4" />
//             </svg>
//           </div>

//           <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
//             Active
//           </span>
//         </div>

//         <h3 className="text-xl font-bold text-gray-800 group-hover:text-purple-600 mb-3">
//           {project.name}
//         </h3>

//         <div className="h-px bg-gradient-to-r from-purple-200 via-blue-200 to-transparent mb-4"></div>

//         <div className="space-y-2.5">
//           {project.customer_name && (
//             <div className="flex items-center gap-2.5 text-sm">
//               <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
//                 <svg
//                   className="w-4 h-4 text-purple-600"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeWidth={2}
//                     d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//                   />
//                 </svg>
//               </div>
//               <div>
//                 <p className="text-xs text-gray-500">Customer</p>
//                 <p className="font-semibold">{project.customer_name}</p>
//               </div>
//             </div>
//           )}

//           <div className="flex items-center gap-2.5 text-sm">
//             <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
//               <svg
//                 className="w-4 h-4 text-blue-600"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeWidth={2}
//                   d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
//                 />
//               </svg>
//             </div>
//             <div>
//               <p className="text-xs text-gray-500">Created</p>
//               <p className="font-semibold">
//                 {new Date(project.created_at).toLocaleDateString()}
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="mt-5 pt-4 border-t flex justify-between text-sm">
//           <span className="text-gray-600 group-hover:text-purple-600">
//             View Details
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProjectCard;

// src/components/ProjectCard.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Layers, User, Calendar, ArrowRight, Sparkles } from "lucide-react";

const ProjectCard = ({ project, view = "grid" }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isTeamsContext = location.pathname.startsWith("/teams");

  const colorSchemes = [
    {
      gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
      bg: "bg-violet-50",
      icon: "bg-violet-100",
      iconText: "text-violet-600",
      hover: "hover:border-violet-400",
      text: "group-hover:text-violet-600",
    },
    {
      gradient: "from-blue-500 via-cyan-500 to-teal-500",
      bg: "bg-blue-50",
      icon: "bg-blue-100",
      iconText: "text-blue-600",
      hover: "hover:border-blue-400",
      text: "group-hover:text-blue-600",
    },
    {
      gradient: "from-emerald-500 via-green-500 to-lime-500",
      bg: "bg-emerald-50",
      icon: "bg-emerald-100",
      iconText: "text-emerald-600",
      hover: "hover:border-emerald-400",
      text: "group-hover:text-emerald-600",
    },
    {
      gradient: "from-rose-500 via-pink-500 to-fuchsia-500",
      bg: "bg-rose-50",
      icon: "bg-rose-100",
      iconText: "text-rose-600",
      hover: "hover:border-rose-400",
      text: "group-hover:text-rose-600",
    },
    {
      gradient: "from-amber-500 via-orange-500 to-red-500",
      bg: "bg-amber-50",
      icon: "bg-amber-100",
      iconText: "text-amber-600",
      hover: "hover:border-amber-400",
      text: "group-hover:text-amber-600",
    },
  ];

  const hashString = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
  };

  const colorScheme =
    colorSchemes[hashString(project.id) % colorSchemes.length];

  const handleClick = () => {
    navigate(
      isTeamsContext
        ? `/teams/projects/${project.id}/folders`
        : `/projects/${project.id}/folders`,
    );
  };

  // ================= LIST VIEW =================
  if (view === "list") {
    return (
      <div
        onClick={handleClick}
        className={`group cursor-pointer relative overflow-hidden bg-white/80 backdrop-blur-md rounded-2xl border-2 border-gray-100 ${colorScheme.hover} transition-all duration-300 hover:shadow-xl hover:shadow-${colorScheme.iconText}/5`}
      >
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative flex items-center gap-4 p-4 sm:p-5">
          {/* Icon with animated glow */}
          <div className="relative">
            <div
              className={`absolute inset-0 bg-gradient-to-br ${colorScheme.gradient} rounded-xl blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300`}
            />
            <div
              className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br ${colorScheme.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
            >
              <Layers
                className="w-7 h-7 sm:w-8 sm:h-8 text-white"
                strokeWidth={2.5}
              />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full animate-pulse" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3
                className={`text-base sm:text-lg font-bold text-gray-800 truncate ${colorScheme.text} transition-colors duration-300`}
              >
                {project.name}
              </h3>
              <Sparkles
                className={`w-4 h-4 ${colorScheme.iconText} opacity-0 group-hover:opacity-100 transition-opacity`}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500">
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                <span className="font-medium">
                  {project.customer_name || "Internal"}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{new Date(project.created_at).toLocaleDateString()}</span>
              </div>

              <span className="px-2.5 py-0.5 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 text-xs font-semibold rounded-full border border-green-200">
                Ongoing
              </span>
            </div>
          </div>

          {/* Arrow with animated background */}
          <div
            className={`relative p-3 rounded-xl ${colorScheme.bg} group-hover:scale-110 transition-transform duration-300`}
          >
            <ArrowRight
              className={`w-5 h-5 ${colorScheme.iconText} group-hover:translate-x-1 transition-transform duration-300`}
              strokeWidth={2.5}
            />
          </div>
        </div>
      </div>
    );
  }

  // ================= GRID VIEW =================
  return (
    <div
      onClick={handleClick}
      className="group cursor-pointer relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 border-gray-100 hover:border-transparent hover:-translate-y-2"
    >
      {/* Animated gradient border effect */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${colorScheme.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`}
        style={{ padding: "2px" }}
      />

      {/* Top accent bar with shimmer */}
      <div className="relative h-1.5 overflow-hidden">
        <div
          className={`absolute inset-0 bg-gradient-to-r ${colorScheme.gradient}`}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
      </div>

      <div className="relative bg-white rounded-b-3xl p-6 sm:p-7">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          {/* Icon with glow */}
          <div className="relative">
            <div
              className={`absolute inset-0 bg-gradient-to-br ${colorScheme.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500`}
            />
            <div
              className={`relative h-16 w-16 sm:h-18 sm:w-18 rounded-2xl bg-gradient-to-br ${colorScheme.gradient} flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}
            >
              <Layers
                className="h-8 w-8 sm:h-9 sm:w-9 text-white"
                strokeWidth={2.5}
              />
            </div>
          </div>

          {/* Status badge */}
          <div className="relative overflow-hidden px-3 py-1.5 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-full">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <div className="relative flex items-center gap-1.5">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs font-bold text-green-700">Ongoing</span>
            </div>
          </div>
        </div>

        {/* Title */}
        <h3
          className={`text-xl sm:text-2xl font-bold text-gray-800 mb-4 line-clamp-2 ${colorScheme.text} transition-colors duration-300`}
        >
          {project.name}
        </h3>

        {/* Divider with gradient */}
        <div
          className={`h-0.5 bg-gradient-to-r ${colorScheme.gradient} opacity-20 mb-5 rounded-full`}
        />

        {/* Details */}
        <div className="space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">
              {new Date(project.created_at).toLocaleDateString()}
            </span>

            <span className="px-2.5 py-1 text-xs font-semibold bg-blue-50 text-blue-700 rounded-full">
              {project.customer_name || "Internal"}
            </span>
          </div>

          {/* <div className="flex items-center gap-3 group/item">
            <div
              className={`w-10 h-10 ${colorScheme.icon} rounded-xl flex items-center justify-center group-hover/item:scale-110 transition-transform duration-300`}
            >
              <Calendar
                className={`w-5 h-5 ${colorScheme.iconText}`}
                strokeWidth={2.5}
              />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 font-medium mb-0.5">
                Created
              </p>
              <p className="font-bold text-gray-800 text-sm">
                {new Date(project.created_at).toLocaleDateString()}
              </p>
            </div>
          </div> */}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-5 border-t-2 border-gray-100">
          <div
            className={`flex items-center justify-between text-sm font-semibold ${colorScheme.iconText} transition-colors duration-300`}
          >
            <span className="flex items-center gap-2">
              View Details
              <Sparkles className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </span>
            <ArrowRight
              className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300"
              strokeWidth={2.5}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
