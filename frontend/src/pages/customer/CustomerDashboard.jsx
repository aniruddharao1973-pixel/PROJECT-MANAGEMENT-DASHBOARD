// // src/pages/customer/CustomerDashboard.jsx
// import React, { useState, useEffect } from "react";
// import { useAuth } from "../../hooks/useAuth";
// import { useAxios } from "../../api/axios";
// import { Folder, FileText, TrendingUp, ArrowRight } from "lucide-react";
// import { getGreeting } from "../../utils/getGreeting";
// import { useNavigate } from "react-router-dom";

// const CustomerDashboard = () => {
//   const { user } = useAuth();
//   const api = useAxios();
//   const navigate = useNavigate();

//   const [stats, setStats] = useState({
//     projects: "--",
//     documents: "--",
//   });

//   const loadStats = async () => {
//     try {
//       const res = await api.get("/dashboard/customer");
//       setStats({
//         projects: res.data.totalProjects,
//         documents: res.data.totalDocuments,
//       });
//     } catch (err) {
//       console.error("Customer Dashboard Error:", err);
//     }
//   };

//   useEffect(() => {
//     if (user) loadStats();
//   }, [user]);

//   return (
//     <div
//       className="
//         w-full
//         h-[calc(100vh-80px)]
//         overflow-y-scroll
//         scroll-smooth
//         bg-slate-50
//         px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10
//       "
//       style={{
//         scrollbarWidth: "thin",
//         scrollbarColor: "#cbd5e1 #f1f5f9",
//       }}
//     >
//       <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 md:space-y-10">
//         {/* Greeting Section */}
//         <div className="space-y-3">
//           <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-violet-50 border border-violet-100 rounded-full">
//             <TrendingUp className="w-3.5 h-3.5 text-violet-600" />
//             <span className="text-xs font-medium text-violet-600">
//               Your Overview
//             </span>
//           </div>

//           <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
//             {getGreeting()}, {user?.name}{" "}
//             <span className="inline-block">👋</span>
//           </h1>

//           <p className="text-slate-500 text-sm sm:text-base max-w-xl">
//             Welcome back! Here's a quick overview of your activity.
//           </p>
//         </div>

//         {/* Stats Cards Grid */}
//         <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 max-w-4xl">
//           {/* My Projects Card */}
//           <div
//             onClick={() => navigate("/projects")}
//             className="group cursor-pointer bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/60 shadow-sm hover:shadow-lg hover:border-violet-200 transition-all duration-300"
//           >
//             <div className="flex items-start justify-between">
//               <div className="space-y-4">
//                 <div className="p-2.5 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl w-fit shadow-lg shadow-violet-500/25">
//                   <Folder className="w-5 h-5 text-white" />
//                 </div>

//                 <div>
//                   <p className="text-sm font-medium text-slate-500 mb-1">
//                     My Projects
//                   </p>
//                   <p className="text-3xl sm:text-4xl font-bold text-slate-900">
//                     {stats.projects}
//                   </p>
//                 </div>
//               </div>

//               <div className="p-2 rounded-full bg-slate-50 group-hover:bg-violet-50 group-hover:text-violet-600 text-slate-400 transition-colors">
//                 <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
//               </div>
//             </div>

//             <div className="mt-4 pt-4 border-t border-slate-100">
//               <div className="flex items-center gap-2">
//                 <span className="flex h-2 w-2 relative">
//                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
//                   <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
//                 </span>
//                 <p className="text-xs text-slate-400">Updated just now</p>
//               </div>
//             </div>
//           </div>

//           {/* My Documents Card */}
//           <div
//             onClick={() => navigate("/projects")}
//             className="group cursor-pointer bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/60 shadow-sm hover:shadow-lg hover:border-emerald-200 transition-all duration-300"
//           >
//             <div className="flex items-start justify-between">
//               <div className="space-y-4">
//                 <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl w-fit shadow-lg shadow-emerald-500/25">
//                   <FileText className="w-5 h-5 text-white" />
//                 </div>

//                 <div>
//                   <p className="text-sm font-medium text-slate-500 mb-1">
//                     My Documents
//                   </p>
//                   <p className="text-3xl sm:text-4xl font-bold text-slate-900">
//                     {stats.documents}
//                   </p>
//                 </div>
//               </div>

//               <div className="p-2 rounded-full bg-slate-50 group-hover:bg-emerald-50 group-hover:text-emerald-600 text-slate-400 transition-colors">
//                 <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
//               </div>
//             </div>

//             <div className="mt-4 pt-4 border-t border-slate-100">
//               <div className="flex items-center gap-2">
//                 <span className="flex h-2 w-2 relative">
//                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
//                   <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
//                 </span>
//                 <p className="text-xs text-slate-400">Updated just now</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CustomerDashboard;

// src/pages/customer/CustomerDashboard.jsx
// import React, { useState, useEffect, useMemo } from "react";
// import { useAuth } from "../../hooks/useAuth";
// import { useAxios } from "../../api/axios";
// import {
//   Folder,
//   FileText,
//   ArrowRight,
//   Activity,
//   Clock,
//   Sparkles,
// } from "lucide-react";
// import { getGreeting } from "../../utils/getGreeting";
// import { useNavigate } from "react-router-dom";
// import { useBreadcrumb } from "../../context/BreadcrumbContext";

// /* ---------------------------------------------------
//    Performance detection hook (SAME AS Dashboard.jsx)
// --------------------------------------------------- */
// const usePerformanceMode = () => {
//   const [performanceMode, setPerformanceMode] = useState("high");

//   useEffect(() => {
//     const checkPerformance = () => {
//       const prefersReducedMotion = window.matchMedia(
//         "(prefers-reduced-motion: reduce)",
//       ).matches;
//       const deviceMemory = navigator.deviceMemory || 4;
//       const cores = navigator.hardwareConcurrency || 4;
//       const isMobile =
//         /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
//           navigator.userAgent,
//         );

//       if (prefersReducedMotion || deviceMemory <= 2 || cores <= 2) {
//         setPerformanceMode("low");
//       } else if (deviceMemory <= 4 || cores <= 4 || isMobile) {
//         setPerformanceMode("medium");
//       } else {
//         setPerformanceMode("high");
//       }
//     };

//     checkPerformance();
//     const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
//     mediaQuery.addEventListener("change", checkPerformance);

//     return () => mediaQuery.removeEventListener("change", checkPerformance);
//   }, []);

//   return performanceMode;
// };

// /* ---------------------------------------------------
//    Animated Counter (SAME AS Dashboard.jsx)
// --------------------------------------------------- */
// const AnimatedCounter = ({ value, performanceMode }) => {
//   const [displayValue, setDisplayValue] = useState(0);
//   const numericValue = typeof value === "number" ? value : parseInt(value) || 0;

//   useEffect(() => {
//     if (performanceMode === "low" || value === "--") {
//       setDisplayValue(value);
//       return;
//     }

//     let startTime;
//     let raf;
//     const duration = performanceMode === "medium" ? 500 : 1000;

//     const animate = (time) => {
//       if (!startTime) startTime = time;
//       const progress = Math.min((time - startTime) / duration, 1);
//       const eased = 1 - Math.pow(1 - progress, 4);
//       setDisplayValue(Math.floor(eased * numericValue));
//       if (progress < 1) raf = requestAnimationFrame(animate);
//     };

//     raf = requestAnimationFrame(animate);
//     return () => raf && cancelAnimationFrame(raf);
//   }, [value, numericValue, performanceMode]);

//   return <span>{displayValue}</span>;
// };

// /* ---------------------------------------------------
//    Stat Card (SAME DESIGN AS Dashboard.jsx)
// --------------------------------------------------- */
// const StatCard = ({
//   title,
//   value,
//   icon: Icon,
//   gradient,
//   hoverBorder,
//   shadowColor,
//   onClick,
//   performanceMode,
//   delay = 0,
// }) => {
//   const [visible, setVisible] = useState(false);

//   useEffect(() => {
//     const t = setTimeout(() => setVisible(true), delay);
//     return () => clearTimeout(t);
//   }, [delay]);

//   return (
//     <div
//       onClick={onClick}
//       className={`
//         group relative cursor-pointer
//         bg-white rounded-2xl
//         p-4 sm:p-5 md:p-6
//         border border-slate-200/60
//         overflow-hidden
//         ${
//           performanceMode === "low"
//             ? ""
//             : `transition-all duration-500 ${
//                 visible
//                   ? "opacity-100 translate-y-0"
//                   : "opacity-0 translate-y-4"
//               } hover:shadow-xl ${hoverBorder}`
//         }
//       `}
//       style={{
//         minWidth: "min(100%, 280px)",
//         willChange:
//           performanceMode === "high" ? "transform, box-shadow" : "auto",
//       }}
//     >
//       {performanceMode === "high" && (
//         <div
//           className={`absolute -right-8 -top-8 w-28 h-28 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-700 ${gradient}`}
//         />
//       )}

//       <div className="relative flex items-start justify-between gap-3">
//         <div className="space-y-3 flex-1 min-w-0">
//           <div
//             className={`
//               p-2.5 rounded-xl w-fit
//               ${gradient}
//               shadow-md ${shadowColor}
//               ${
//                 performanceMode === "high"
//                   ? "group-hover:scale-110 transition-transform duration-500"
//                   : ""
//               }
//             `}
//           >
//             <Icon className="w-5 h-5 text-white" />
//           </div>

//           <div>
//             <p className="text-sm font-medium text-slate-500 truncate">
//               {title}
//             </p>
//             <p className="text-3xl sm:text-4xl font-bold text-slate-900">
//               <AnimatedCounter
//                 value={value}
//                 performanceMode={performanceMode}
//               />
//             </p>
//           </div>
//         </div>

//         <div className="p-2 rounded-full bg-slate-50 text-slate-400 group-hover:bg-slate-100 transition">
//           <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
//         </div>
//       </div>

//       <div className="mt-4 pt-4 border-t border-slate-100">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <span className="relative flex h-2 w-2">
//               <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
//               <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
//             </span>
//             <span className="text-xs text-slate-400">Live data</span>
//           </div>
//           <Clock className="w-3.5 h-3.5 text-slate-300" />
//         </div>
//       </div>
//     </div>
//   );
// };

// /* ---------------------------------------------------
//    Welcome Banner (CUSTOMER VARIANT, SAME DESIGN)
// --------------------------------------------------- */
// const WelcomeBanner = ({ user, performanceMode }) => {
//   const greeting = getGreeting();
//   const hour = new Date().getHours();

//   const gradient = useMemo(() => {
//     if (hour < 12) return "from-blue-500 via-indigo-500 to-purple-500";
//     if (hour < 18) return "from-indigo-500 via-purple-500 to-fuchsia-600";
//     return "from-purple-600 via-indigo-700 to-slate-800";
//   }, [hour]);

//   return (
//     <div
//       className={`
//         relative overflow-hidden rounded-2xl
//         bg-gradient-to-br ${gradient}
//         p-5 sm:p-6 md:p-8
//         ${
//           performanceMode === "low"
//             ? ""
//             : "transition-all duration-700 animate-fade-in"
//         }
//       `}
//     >
//       {performanceMode === "high" && (
//         <>
//           <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
//           <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-black/10 rounded-full blur-3xl" />
//         </>
//       )}

//       <div className="relative z-10">
//         <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 border border-white/20 rounded-full mb-4">
//           <Sparkles className="w-3.5 h-3.5 text-white" />
//           <span className="text-xs font-medium text-white">
//             Customer Dashboard
//           </span>
//         </div>

//         <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
//           {greeting}, {user?.name}! 👋
//         </h1>

//         <p className="text-white/80 text-sm sm:text-base max-w-xl">
//           Track your projects, documents, and activity in one place.
//         </p>

//         <div className="flex gap-4 mt-5">
//           <div className="flex items-center gap-2 text-white/90 text-xs sm:text-sm">
//             <Activity className="w-4 h-4" />
//             All systems operational
//           </div>
//           <div className="flex items-center gap-2 text-white/90 text-xs sm:text-sm">
//             <Clock className="w-4 h-4" />
//             {new Date().toLocaleDateString("en-US", {
//               weekday: "short",
//               month: "short",
//               day: "numeric",
//             })}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* ---------------------------------------------------
//    MAIN CUSTOMER DASHBOARD
// --------------------------------------------------- */
// const CustomerDashboard = () => {
//   const { user } = useAuth();
//     // console.log("AUTH USER OBJECT:", user); // ✅ ADD THIS LINE

//   const api = useAxios();
//   const navigate = useNavigate();
//   const performanceMode = usePerformanceMode();
//   const { clearBreadcrumb } = useBreadcrumb();

//   const [stats, setStats] = useState({
//     projects: "--",
//     documents: "--",
//   });

//   const loadStats = async () => {
//     try {
//       const res = await api.get("/dashboard/customer");
//       setStats({
//         projects: res.data.totalProjects,
//         documents: res.data.totalDocuments,
//       });
//     } catch (err) {
//       console.error("Customer Dashboard Error:", err);
//     }
//   };

//   useEffect(() => {
//     if (user) loadStats();
//   }, [user]);

//   useEffect(() => {
//     clearBreadcrumb();
//   }, [clearBreadcrumb]);

//   useEffect(() => {
//   console.log("AUTH USER OBJECT:", user);
// }, [user]);

//   return (
//     <div
//       className="
//         w-full
//         bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100
//         relative
//       "
//     >
//       {performanceMode === "high" && (
//         <div className="absolute inset-0 pointer-events-none overflow-hidden">
//           <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-200 rounded-full blur-3xl opacity-20 animate-blob" />
//           <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full blur-3xl opacity-20 animate-blob animation-delay-2000" />
//         </div>
//       )}

//       <div className="relative z-10 w-full">
//         <div className="w-full min-h-screen px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10">
//           <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
//             <WelcomeBanner user={user} performanceMode={performanceMode} />

//             <div>
//               <h2 className="text-lg sm:text-xl font-semibold text-slate-800">
//                 Quick Stats
//               </h2>
//               <p className="text-sm text-slate-500">
//                 Your project and document summary
//               </p>
//             </div>

//             <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 sm:gap-6 max-w-4xl">
//               <StatCard
//                 title="My Projects"
//                 value={stats.projects}
//                 icon={Folder}
//                 gradient="bg-gradient-to-br from-indigo-500 to-purple-600"
//                 hoverBorder="hover:border-indigo-300"
//                 shadowColor="shadow-indigo-500/20"
//                 onClick={() => navigate("/projects")}
//                 performanceMode={performanceMode}
//                 delay={100}
//               />

//               <StatCard
//                 title="My Documents"
//                 value={stats.documents}
//                 icon={FileText}
//                 gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
//                 hoverBorder="hover:border-emerald-300"
//                 shadowColor="shadow-emerald-500/20"
//                 onClick={() => navigate("/projects")}
//                 performanceMode={performanceMode}
//                 delay={200}
//               />
//             </div>

//             <div className="h-6" />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CustomerDashboard;

// src/pages/customer/CustomerDashboard.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useAxios } from "../../api/axios";
import {
  Folder,
  FileText,
  Activity,
  Clock,
  Sparkles,
  ChevronRight,
  Zap,
  Users,
} from "lucide-react";
import { getGreeting } from "../../utils/getGreeting";
import { useNavigate } from "react-router-dom";
import { useBreadcrumb } from "../../context/BreadcrumbContext";

/* ---------------------------------------------------
   Global keyframes injected once at the top level
   (only animations that can't be done with Tailwind)
--------------------------------------------------- */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

    .font-display { font-family: 'Sora', 'DM Sans', system-ui, sans-serif !important; }
    .font-body    { font-family: 'DM Sans', system-ui, sans-serif; }

    /* Waving emoji */
    @keyframes cd-wave {
      0%, 100% { transform: rotate(0deg); }
      25%       { transform: rotate(20deg); }
      75%       { transform: rotate(-15deg); }
    }
    .cd-wave {
      display: inline-block;
      animation: cd-wave 2.4s ease-in-out infinite;
      transform-origin: 70% 80%;
    }

    /* Decorative bar chart bars */
    @keyframes cd-bar-rise {
      from { transform: scaleY(0); opacity: 0; }
      to   { transform: scaleY(1); opacity: 1; }
    }
    .cd-deco-bar {
      width: 10px;
      border-radius: 4px 4px 0 0;
      background: linear-gradient(180deg, #818cf8, #c7d2fe);
      transform-origin: bottom;
      animation: cd-bar-rise 0.6s cubic-bezier(0.34,1.56,0.64,1) both;
    }

    /* Green pulse for status dot & live badge */
    @keyframes cd-pulse-green {
      0%, 100% { box-shadow: 0 0 0 3px rgba(34,197,94,0.15); }
      50%       { box-shadow: 0 0 0 5px rgba(34,197,94,0.25); }
    }
    .cd-pulse-green { animation: cd-pulse-green 2s ease-in-out infinite; }

    /* Gradient text for user name */
    .cd-name-gradient {
      background: linear-gradient(135deg, #6366f1, #0ea5e9);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    /* Stat card CTA + stripe reveal on hover */
    .cd-stat-card:hover .cd-stat-cta  { opacity: 1; transform: translateX(0); }
    .cd-stat-card:hover .cd-stat-stripe { opacity: 1; }
    .cd-stat-card:hover .cd-stat-glow  { opacity: 1; }
    .cd-stat-card:hover .cd-stat-icon  { transform: scale(1.12) rotate(-4deg); }

    /* Quick action arrow reveal */
    .cd-quick-action:hover .cd-qa-arrow { opacity: 1; transform: translateX(0); }

    /* xs grid breakpoint (480px) for stat cards — matches original xs:grid-cols-2 */
    @media (min-width: 480px) {
      .cd-stats-grid { grid-template-columns: 1fr 1fr !important; }
    }
  `}</style>
);

/* ---------------------------------------------------
   Performance detection hook (UNCHANGED LOGIC)
--------------------------------------------------- */
const usePerformanceMode = () => {
  const [performanceMode, setPerformanceMode] = useState("high");

  useEffect(() => {
    const checkPerformance = () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const deviceMemory = navigator.deviceMemory || 4;
      const cores = navigator.hardwareConcurrency || 4;
      const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent,
        );
      if (prefersReducedMotion || deviceMemory <= 2 || cores <= 2) {
        setPerformanceMode("low");
      } else if (deviceMemory <= 4 || cores <= 4 || isMobile) {
        setPerformanceMode("medium");
      } else {
        setPerformanceMode("high");
      }
    };
    checkPerformance();
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    mq.addEventListener("change", checkPerformance);
    return () => mq.removeEventListener("change", checkPerformance);
  }, []);

  return performanceMode;
};

/* ---------------------------------------------------
   Animated Counter (UNCHANGED LOGIC)
--------------------------------------------------- */
const AnimatedCounter = ({ value, performanceMode }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const numericValue = typeof value === "number" ? value : parseInt(value) || 0;

  useEffect(() => {
    if (performanceMode === "low" || value === "--") {
      setDisplayValue(value);
      return;
    }
    let startTime;
    let raf;
    const duration = performanceMode === "medium" ? 500 : 1000;
    const animate = (time) => {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setDisplayValue(Math.floor(eased * numericValue));
      if (progress < 1) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => raf && cancelAnimationFrame(raf);
  }, [value, numericValue, performanceMode]);

  return <span>{displayValue}</span>;
};

/* ---------------------------------------------------
   Stat Card
   accent* props are Tailwind class strings so the
   parent controls colour without any inline CSS vars.
--------------------------------------------------- */
const StatCard = ({
  title,
  value,
  icon: Icon,
  iconBg, // e.g. "bg-indigo-500/10"
  iconText, // e.g. "text-indigo-500"
  stripeBg, // e.g. "bg-indigo-500"
  glowBg, // e.g. "bg-indigo-500/10"
  hoverBorder, // e.g. "hover:border-indigo-300"
  ctaText, // e.g. "text-indigo-500"
  onClick,
  performanceMode,
  delay = 0,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  const entryStyle =
    performanceMode === "low"
      ? {}
      : {
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms,
                       box-shadow 0.22s ease, border-color 0.2s ease`,
        };

  return (
    <div
      onClick={onClick}
      className={[
        "cd-stat-card",
        // layout
        "group relative cursor-pointer flex flex-col gap-3.5 overflow-hidden",
        // surface
        "bg-white border border-slate-200 rounded-2xl",
        // spacing
        "px-5 pt-5 pb-4 sm:px-6 sm:pt-6 sm:pb-5",
        // shadow
        "shadow-sm",
        // hover lift
        `hover:-translate-y-0.5 hover:scale-[1.005] hover:shadow-2xl ${hoverBorder}`,
        // active
        "active:-translate-y-px active:scale-[1.002]",
        // smooth base transitions (entry handled via style prop)
        "transition-[transform,box-shadow,border-color] duration-200",
      ].join(" ")}
      style={{ minWidth: "min(100%, 280px)", ...entryStyle }}
    >
      {/* Top-right glow blob */}
      <div
        className={[
          "cd-stat-glow pointer-events-none absolute -top-10 -right-10 w-28 h-28 rounded-full",
          glowBg,
          "opacity-0 transition-opacity duration-300",
        ].join(" ")}
      />

      {/* Left accent stripe */}
      <div
        className={[
          "cd-stat-stripe absolute left-0 top-3.5 bottom-3.5 w-[3px] rounded-r-sm",
          stripeBg,
          "opacity-0 transition-opacity duration-200",
        ].join(" ")}
      />

      {/* ── Header row ── */}
      <div className="flex items-center justify-between">
        {/* Icon */}
        <div
          className={[
            "cd-stat-icon w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0",
            iconBg,
            iconText,
            "transition-transform duration-300",
          ].join(" ")}
        >
          <Icon size={18} strokeWidth={1.8} />
        </div>

        {/* Live badge */}
        <span className="flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5">
          <span className="cd-pulse-green w-[5px] h-[5px] rounded-full bg-emerald-500 flex-shrink-0" />
          Live
        </span>
      </div>

      {/* ── Value ── */}
      <div className="font-display text-[clamp(34px,5vw,50px)] font-extrabold tracking-[-0.03em] text-slate-900 leading-none">
        <AnimatedCounter value={value} performanceMode={performanceMode} />
      </div>

      {/* ── Footer ── */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <span className="text-[13px] font-medium text-slate-500">{title}</span>
        <div
          className={[
            "cd-stat-cta flex items-center gap-0.5 text-[12px] font-semibold",
            ctaText,
            "opacity-0 -translate-x-1.5 transition-all duration-200",
          ].join(" ")}
        >
          View all <ChevronRight size={12} />
        </div>
      </div>
    </div>
  );
};

/* ---------------------------------------------------
   Welcome Banner
--------------------------------------------------- */
const WelcomeBanner = ({ user, performanceMode }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  const greeting = getGreeting();
  const hour = new Date().getHours();

  const timeLabel = useMemo(() => {
    if (hour < 12) return "Morning";
    if (hour < 17) return "Afternoon";
    if (hour < 21) return "Evening";
    return "Night";
  }, [hour]);

  const entryStyle =
    performanceMode === "low"
      ? {}
      : {
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        };

  return (
    <div
      className={[
        // layout
        "relative flex items-center justify-between gap-5 overflow-hidden",
        // surface
        "bg-white border border-slate-200 rounded-[22px]",
        // spacing
        "px-6 py-7 sm:px-9 sm:py-9 md:px-11 md:py-10",
        // shadow
        "shadow-[0_4px_16px_rgba(0,0,0,0.06),0_1px_4px_rgba(0,0,0,0.04)]",
      ].join(" ")}
      style={entryStyle}
    >
      {/* Gradient accent top line — can't do multi-stop via Tailwind alone */}
      <div
        className="pointer-events-none absolute top-0 left-0 right-0 h-[3px] rounded-t-[22px]"
        style={{ background: "linear-gradient(90deg,#6366f1,#818cf8,#06b6d4)" }}
      />

      {/* Noise texture overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: 0.018,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px",
        }}
      />

      {/* Dot grid overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: 0.032,
          backgroundImage:
            "radial-gradient(circle, #64748b 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* ── Text content ── */}
      <div className="relative z-10 flex-1 min-w-0">
        {/* Eyebrow pill */}
        <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.08em] uppercase text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-full px-3 py-1 mb-3.5">
          <Sparkles size={12} />
          <span>Good {timeLabel}</span>
        </div>

        {/* Heading */}
        <h1 className="font-display text-[clamp(20px,4vw,34px)] font-bold leading-[1.2] tracking-[-0.02em] text-slate-900 mb-2.5">
          {greeting}, <span className="cd-name-gradient">{user?.name}</span>{" "}
          <span className={performanceMode !== "low" ? "cd-wave" : ""}>👋</span>
        </h1>

        {/* Subtitle */}
        <p className="text-[13px] sm:text-sm text-slate-500 leading-relaxed mb-4 max-w-[400px]">
          Track your projects, documents, and activity in one place.
        </p>

        {/* Meta pills */}
        <div className="flex flex-wrap gap-2">
          {/* Status */}
          <div className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-medium text-slate-500 bg-slate-100 border border-slate-200 rounded-full px-3 py-1">
            <span className="cd-pulse-green w-[7px] h-[7px] rounded-full bg-emerald-500 flex-shrink-0" />
            All systems operational
          </div>
          {/* Date */}
          <div className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-medium text-slate-500 bg-slate-100 border border-slate-200 rounded-full px-3 py-1">
            <Clock size={11} />
            {new Date().toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </div>
        </div>
      </div>

      {/* ── Decorative bar chart (desktop only) ── */}
      {performanceMode !== "low" && (
        <div
          className="hidden sm:flex items-end gap-[5px] h-16 flex-shrink-0"
          aria-hidden="true"
        >
          {[40, 65, 50, 80, 55, 90, 68].map((h, i) => (
            <div
              key={i}
              className="cd-deco-bar"
              style={{ height: `${h}%`, animationDelay: `${i * 0.08}s` }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/* ---------------------------------------------------
   Quick Action Button
--------------------------------------------------- */
const QuickAction = ({
  label,
  icon: Icon,
  onClick,
  iconBg,
  iconText,
  iconHoverBg,
  borderHover,
}) => (
  <button
    onClick={onClick}
    className={[
      "cd-quick-action group flex items-center gap-3 w-full text-left",
      "px-4 py-3 rounded-[10px]",
      "bg-slate-50 border border-slate-200",
      `hover:${borderHover} hover:translate-x-[3px]`,
      "active:translate-x-px",
      "transition-all duration-200",
    ].join(" ")}
  >
    <div
      className={[
        "w-[34px] h-[34px] rounded-[9px] flex items-center justify-center flex-shrink-0",
        iconBg,
        iconText,
        `group-hover:${iconHoverBg}`,
        "transition-colors duration-150",
      ].join(" ")}
    >
      <Icon size={16} strokeWidth={1.8} />
    </div>
    <span className="flex-1 text-[13px] font-semibold text-slate-800">
      {label}
    </span>
    <ChevronRight
      size={13}
      className="cd-qa-arrow text-slate-400 opacity-0 -translate-x-1 transition-all duration-150"
    />
  </button>
);

/* ---------------------------------------------------
   MAIN CUSTOMER DASHBOARD (LOGIC UNCHANGED)
--------------------------------------------------- */
const CustomerDashboard = () => {
  const { user } = useAuth();
  const api = useAxios();
  const navigate = useNavigate();
  const performanceMode = usePerformanceMode();
  const { clearBreadcrumb } = useBreadcrumb();

  const [stats, setStats] = useState({ projects: "--", documents: "--" });

  const loadStats = async () => {
    try {
      const res = await api.get("/dashboard/customer");
      setStats({
        projects: res.data.totalProjects,
        documents: res.data.totalDocuments,
      });
    } catch (err) {
      console.error("Customer Dashboard Error:", err);
    }
  };

  useEffect(() => {
    if (user) loadStats();
  }, [user]);
  useEffect(() => {
    clearBreadcrumb();
  }, [clearBreadcrumb]);
  useEffect(() => {
    console.log("AUTH USER OBJECT:", user);
  }, [user]);

  const quickActions = [
    // { label: "My Account", icon: Users,    path: "/profile",  iconBg: "bg-rose-500/10",   iconText: "text-rose-500",   iconHoverBg: "bg-rose-500/20",   borderHover: "border-rose-300" },
    // { label: "Get Help",   icon: Activity, path: "/support",  iconBg: "bg-violet-500/10", iconText: "text-violet-500", iconHoverBg: "bg-violet-500/20", borderHover: "border-violet-300" },
    {
      label: "My Projects",
      icon: Folder,
      path: "/projects",
      iconBg: "bg-indigo-500/10",
      iconText: "text-indigo-600",
      iconHoverBg: "bg-indigo-500/20",
      borderHover: "border-indigo-300",
    },
  ];

  return (
    <>
      <GlobalStyles />

      {/* Root — light bg, full-width, full-height */}
      <div className="font-body w-full bg-[#f8f9fc] text-slate-900 min-h-screen">
        {/* Inner padding — matches original px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 */}
        <div className="relative z-10 w-full min-h-screen px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10">
          {/* Content column — matches original max-w-6xl mx-auto */}
          <div className="max-w-6xl mx-auto flex flex-col gap-6 sm:gap-8">
            {/* ── Welcome Banner ──────────────────────────── */}
            <WelcomeBanner user={user} performanceMode={performanceMode} />

            {/* ── Section Header ──────────────────────────── */}
            <div className="flex items-end justify-between gap-3">
              <div>
                <h2 className="font-display text-[17px] sm:text-lg font-bold tracking-[-0.01em] text-slate-900 mb-0.5">
                  Overview
                </h2>
                <p className="text-[13px] text-slate-400">
                  Your project and document summary
                </p>
              </div>
              <span className="text-[11px] font-semibold tracking-[0.05em] text-slate-400 bg-slate-100 border border-slate-200 rounded-full px-2.5 py-1 whitespace-nowrap">
                {new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>

            {/* ── Stats Grid ──────────────────────────────── */}
            {/*
              grid-cols-1 by default.
              xs (480px): 2-col via .cd-stats-grid in GlobalStyles.
              max-w-4xl matches original.
            */}
            <div className="cd-stats-grid grid grid-cols-1 gap-4 sm:gap-6 max-w-4xl">
              <StatCard
                title="My Projects"
                value={stats.projects}
                icon={Folder}
                iconBg="bg-indigo-500/10"
                iconText="text-indigo-500"
                stripeBg="bg-indigo-500"
                glowBg="bg-indigo-500/10"
                hoverBorder="hover:border-indigo-300"
                ctaText="text-indigo-500"
                onClick={() => navigate("/projects")}
                performanceMode={performanceMode}
                delay={100}
              />
              <StatCard
                title="My Documents"
                value={stats.documents}
                icon={FileText}
                iconBg="bg-sky-500/10"
                iconText="text-sky-500"
                stripeBg="bg-sky-500"
                glowBg="bg-sky-500/10"
                hoverBorder="hover:border-sky-300"
                ctaText="text-sky-500"
                onClick={() => navigate("/projects")}
                performanceMode={performanceMode}
                delay={200}
              />
            </div>

            {/* ── Quick Actions ────────────────────────────── */}
            <div className="bg-white border border-slate-200 rounded-2xl px-5 py-5 sm:px-6 sm:py-6 shadow-sm">
              {/* Title with trailing divider line */}
              <h3 className="font-display flex items-center gap-2 text-[15px] font-bold text-slate-900 mb-4">
                <Zap size={15} className="text-amber-400 flex-shrink-0" />
                Quick Actions
                <span className="flex-1 h-px bg-slate-100 ml-1" />
              </h3>

              {/* Action buttons */}
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
                {quickActions.map((action, idx) => (
                  <QuickAction
                    key={idx}
                    label={action.label}
                    icon={action.icon}
                    onClick={() => navigate(action.path)}
                    iconBg={action.iconBg}
                    iconText={action.iconText}
                    iconHoverBg={action.iconHoverBg}
                    borderHover={action.borderHover}
                  />
                ))}
              </div>
            </div>

            {/* Bottom spacer — matches original h-6 */}
            <div className="h-6" />
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerDashboard;
