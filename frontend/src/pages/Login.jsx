// // src/pages/Login.jsx
// import React, { useState } from "react";
// import { useAuthApi } from "../api/authApi";
// import { useAuth } from "../hooks/useAuth";
// import { useNavigate } from "react-router-dom";
// import ChangePasswordModal from "../components/modals/ChangePasswordModal";
// import {
//   Eye,
//   EyeOff,
//   Mail,
//   Lock,
//   Shield,
//   ArrowRight,
//   ArrowUpRight,
//   Users,
//   CheckCircle2,
//   Activity,
//   ChevronDown,
//   ChevronRight,
//   LayoutDashboard,
//   KeyRound,
//   AtSign,
//   Fingerprint,
//   Smartphone,
//   Loader2,
//   ShieldCheck,
//   BadgeCheck,
//   Globe,
//   Sparkles,
//   FileCheck2,
//   AlertCircle,
//   FolderKanban,
//   X,
//   Check,
//   Cloud,
//   FileText,
//   Layers,
// } from "lucide-react";
// import Swal from "sweetalert2";

// const Login = () => {
//   const navigate = useNavigate();
//   const { login: saveLogin } = useAuth();
//   const { login: loginApi, requestPasswordReset } = useAuthApi();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPass, setShowPass] = useState(false);
//   const [error, setError] = useState("");
//   const [forgotLoading, setForgotLoading] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const [showChangePassword, setShowChangePassword] = useState(false);
//   const [tempUserId, setTempUserId] = useState(null);

//   // Mobile info panel state
//   const [mobileInfoExpanded, setMobileInfoExpanded] = useState(false);

//   const handleForgotPassword = async () => {
//     if (!email) {
//       Swal.fire({
//         icon: "warning",
//         title: "Email Required",
//         text: "Please enter your registered email address first.",
//         confirmButtonColor: "#6366f1",
//       });
//       return;
//     }

//     try {
//       setForgotLoading(true);

//       const res = await requestPasswordReset(email);

//       Swal.fire({
//         icon: "success",
//         title: "Check your email 📧",
//         text:
//           res?.data?.message ||
//           "A password reset link has been sent to your email.",
//         confirmButtonColor: "#6366f1",
//       });
//     } catch (err) {
//       console.log("❌ Forgot password error:", err);

//       Swal.fire({
//         icon: "error",
//         title: "Request Failed",
//         text: "Something went wrong. Please try again.",
//         confirmButtonColor: "#6366f1",
//       });
//     } finally {
//       setForgotLoading(false);
//     }
//   };

//   // --- LOGIC UNTOUCHED ---
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       const res = await loginApi({ email, password });

//       if (res.data.mustChangePassword) {
//         setTempUserId(res.data.userId);
//         setShowChangePassword(true);
//         return;
//       }

//       saveLogin(res.data.user, res.data.token);

//       Swal.fire({
//         icon: "success",
//         title: "Welcome Back! ✨",
//         html: '<p class="text-indigo-600 font-semibold">Successfully logged in</p>',
//         toast: true,
//         position: "top-end",
//         timer: 2500,
//         timerProgressBar: true,
//         showConfirmButton: false,
//         background: "linear-gradient(135deg, #E0E7FF 0%, #F3E8FF 100%)",
//         customClass: {
//           popup: "rounded-2xl shadow-2xl border-2 border-indigo-200",
//           timerProgressBar:
//             "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500",
//         },
//       });

//       if (
//         res.data.user.role === "admin" ||
//         res.data.user.role === "techsales"
//       ) {
//         navigate("/dashboard");
//       } else {
//         navigate("/customer/dashboard");
//       }
//     } catch (err) {
//       const data = err?.response?.data;

//       if (data?.resetSuggested) {
//         Swal.fire({
//           icon: "warning",
//           title: "Reset Password?",
//           html: `
//             <p class="text-red-500 font-medium">
//               You've entered an incorrect password multiple times.
//             </p>
//             <p class="text-indigo-900 font-semibold mt-2">
//               Would you like to reset your password?
//             </p>
//           `,
//           showCancelButton: true,
//           confirmButtonText: "Send Reset Link",
//           cancelButtonText: "Cancel",
//           confirmButtonColor: "#6366f1",
//           cancelButtonColor: "#9ca3af",
//         }).then(async (result) => {
//           if (result.isConfirmed) {
//             try {
//               await requestPasswordReset(email);
//               Swal.fire({
//                 icon: "success",
//                 title: "Email Sent 📧",
//                 html: `<p class="text-slate-700 font-medium">A password reset link has been sent to</p><p class="text-indigo-600 font-semibold">${email}</p>`,
//                 confirmButtonColor: "#6366f1",
//               });
//             } catch {
//               Swal.fire({
//                 icon: "error",
//                 title: "Failed",
//                 text: "Unable to send reset email. Please try again later.",
//               });
//             }
//           }
//         });
//         return;
//       }

//       Swal.fire({
//         icon: "error",
//         title: "Login Failed",
//         html: `<p class="text-red-700 font-semibold">${
//           data?.message || "Invalid email or password"
//         }</p>`,
//         toast: true,
//         position: "top-end",
//         timer: 3000,
//         timerProgressBar: true,
//         showConfirmButton: false,
//         background: "linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)",
//         customClass: {
//           popup: "rounded-2xl shadow-2xl border-2 border-red-300",
//           timerProgressBar: "bg-gradient-to-r from-red-500 to-rose-500",
//         },
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Enterprise features data
//   // const enterpriseFeatures = [
//   //   {
//   //     icon: Fingerprint,
//   //     title: "Secure Authentication",
//   //     description:
//   //       "Enterprise authentication with encrypted sessions and secure token-based validation.",
//   //     accentColor: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
//   //   },
//   //   {
//   //     icon: Cloud,
//   //     title: "Cloud-Hosted Infrastructure",
//   //     description:
//   //       "Enterprise deployment on Azure VM with IIS — optimized for performance, security, and availability.",
//   //     accentColor: "bg-blue-500/10 text-blue-600 border-blue-500/20",
//   //   },
//   //   {
//   //     icon: Users,
//   //     title: "Department-wise Access Control",
//   //     description: "Granular RBAC with hierarchical permission structures",
//   //     accentColor: "bg-violet-500/10 text-violet-600 border-violet-500/20",
//   //   },
//   //   {
//   //     icon: Activity,
//   //     title: "Real-time Project & Document Management",
//   //     description: "Live collaboration with instant sync across all devices",
//   //     accentColor: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
//   //   },
//   // ];

//   const complianceBadges = [
//     // { label: "SOC2 Type II", icon: Shield },
//     // { label: "GDPR Ready", icon: FileText },
//     // { label: "ISO 27001", icon: CheckCircle2 },
//   ];

//   return (
//     <div className="min-h-screen flex flex-col lg:flex-row overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
//       {showChangePassword && (
//         <ChangePasswordModal
//           open={showChangePassword}
//           userId={tempUserId}
//           onChanged={() => {
//             Swal.fire({
//               icon: "success",
//               title: "Password Updated! 🔐",
//               html: '<p class="text-indigo-600 font-semibold">Please login with your new password</p>',
//               toast: true,
//               position: "top-end",
//               timer: 3000,
//               timerProgressBar: true,
//               showConfirmButton: false,
//               background: "linear-gradient(135deg, #E0E7FF 0%, #F3E8FF 100%)",
//               customClass: {
//                 popup: "rounded-2xl shadow-2xl border-2 border-indigo-200",
//                 timerProgressBar:
//                   "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500",
//               },
//             });
//             setShowChangePassword(false);
//           }}
//         />
//       )}

//       {/* ═══════════════════════════════════════════════════════════════════════════
//           LEFT SIDE: Enterprise Platform Information
//           Desktop: Full panel | Mobile: Collapsible section below login
//       ═══════════════════════════════════════════════════════════════════════════ */}
//       <div className="hidden lg:flex lg:w-[55%] xl:w-3/5 relative bg-indigo-50 overflow-hidden">
//         {/* Subtle gradient overlay */}
//         <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50" />

//         {/* Grid pattern */}
//         <div className="absolute inset-0 bg-[linear-gradient(to_right,#6366f110_1px,transparent_1px),linear-gradient(to_bottom,#6366f110_1px,transparent_1px)] bg-[size:32px_32px]" />

//         {/* Decorative gradient orbs */}
//         <div className="absolute top-20 -left-20 w-80 h-80 bg-indigo-300/40 rounded-full blur-3xl" />

//         <div className="absolute bottom-20 right-10 w-60 h-60 bg-purple-300/30 rounded-full blur-3xl" />

//         <div className="relative z-10 w-full h-full flex flex-col px-8 lg:px-12 xl:px-16 py-10 lg:py-12">
//           {/* Logo Header */}
//           <div className="flex items-center gap-3 mb-auto">
//             <div className="flex items-center justify-center w-11 h-11 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg shadow-indigo-500/25">
//               <LayoutDashboard className="w-5 h-5 text-white" />
//             </div>
//             <div className="flex flex-col">
//               <span className="text-xl font-bold tracking-tight text-slate-800">
//                 Micro<span className="text-indigo-600">Sync</span>
//               </span>
//               <span className="text-[10px] uppercase tracking-widest text-slate-500 font-medium">
//                 Project Management
//               </span>
//             </div>
//           </div>

//           {/* Hero Section */}
//           <div className="my-auto max-w-xl">
//             <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-slate-900 leading-tight tracking-tight mb-4">
//               Secure. Scalable.
//               <span className="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400">
//                 Built for Enterprise Operations.
//               </span>
//             </h1>

//             <p className="text-base lg:text-lg text-slate-500 leading-relaxed max-w-md mb-10">
//               A unified platform for project management, team collaboration, and
//               document control—designed for security-first organizations.
//             </p>

//             {/* Feature Cards Grid */}
//             {/* <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 mb-10">
//               {enterpriseFeatures.map((feature, index) => (
//                 <div
//                   key={index}
//                   className="group flex items-start gap-4 p-4 rounded-xl bg-white/80 border border-slate-200 hover:bg-white hover:border-indigo-200 hover:shadow-sm transition-all duration-300"
//                 >
//                   <div
//                     className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${feature.accentColor} border`}
//                   >
//                     <feature.icon className="w-5 h-5" />
//                   </div>
//                   <div className="min-w-0">
//                     <h3 className="text-sm font-semibold text-slate-800 mb-1 leading-tight">
//                       {feature.title}
//                     </h3>
//                     <p className="text-xs text-slate-500 leading-relaxed">
//                       {feature.description}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div> */}
//           </div>

//           {/* Compliance Footer */}
//         </div>
//       </div>

//       {/* ═══════════════════════════════════════════════════════════════════════════
//           RIGHT SIDE: Login Form
//           Desktop: Side panel | Mobile/Tablet: Full width centered
//       ═══════════════════════════════════════════════════════════════════════════ */}
//       {/* ═══════════════════════════════════════════════════════════════════════════
//     RIGHT SIDE: Premium Enterprise Login Form
//     Desktop: Side panel | Mobile/Tablet: Full width centered
// ═══════════════════════════════════════════════════════════════════════════ */}
//       <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-10 xl:px-16 py-8 lg:py-12 relative">
//         {/* Subtle Background Pattern */}
//         <div className="absolute inset-0 overflow-hidden pointer-events-none">
//           <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-100/40 via-purple-100/30 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
//           <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-blue-100/40 via-indigo-100/30 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
//         </div>

//         <div className="w-full max-w-[420px] relative z-10">
//           {/* Mobile Logo - Enhanced */}
//           <div className="lg:hidden flex flex-col items-center mb-10">
//             <div className="relative mb-4">
//               {/* Animated Ring */}
//               <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur-lg opacity-40 animate-pulse" />
//               <div className="relative flex items-center justify-center w-14 h-14 bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 rounded-2xl shadow-xl shadow-indigo-500/30">
//                 <LayoutDashboard className="w-7 h-7 text-white" />
//               </div>
//             </div>
//             <div className="text-center">
//               <span className="text-xl font-bold tracking-tight text-slate-800">
//                 Micro
//                 <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
//                   Sync
//                 </span>
//               </span>
//               <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-semibold mt-1">
//                 Project Management Suite
//               </p>
//             </div>
//           </div>

//           {/* Login Card - Premium Design */}
//           <div className="relative">
//             {/* Card Glow Effect */}
//             <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

//             <div className="relative bg-white/90 backdrop-blur-2xl rounded-3xl shadow-[0_20px_70px_-15px_rgba(0,0,0,0.3)] border border-white/60 p-6 sm:p-8 lg:p-10 overflow-hidden">
//               {/* Decorative Corner Accent */}
//               <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-indigo-100/60 via-purple-100/40 to-transparent rounded-bl-[120px] opacity-50" />
//               <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-2xl" />

//               {/* Floating Orbs */}
//               <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl animate-pulse" />
//               <div className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-2xl animate-pulse delay-700" />

//               {/* Decorative Line */}
//               {/* <div className="mb-6 flex items-center gap-3">
//                 <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
//                 <div className="flex gap-1">
//                   <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
//                   <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
//                   <div className="w-1.5 h-1.5 rounded-full bg-pink-400" />
//                 </div>
//                 <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
//               </div> */}
//               {/* Form Header - Enhanced */}
//               <div className="mb-8 relative">
//                 <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-gradient-to-r from-emerald-50 via-indigo-50 to-purple-50 rounded-full border-2 border-indigo-200/40 shadow-lg shadow-indigo-100/50 mb-5">
//                   <div className="relative flex items-center justify-center">
//                     <div className="absolute w-3 h-3 bg-green-400 rounded-full animate-ping opacity-75" />
//                     <div className="w-2 h-2 bg-green-500 rounded-full" />
//                   </div>
//                   <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
//                   <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-widest">
//                     Secure Portal
//                   </span>
//                 </div>
//                 <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
//                   Welcome
//                 </h2>
//                 <p className="text-slate-500 mt-2 text-sm leading-relaxed">
//                   Sign in to continue to your project dashboard
//                 </p>
//               </div>

//               {/* Error Message - Enhanced Animation */}
//               {error && (
//                 <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-rose-50 border border-red-100 rounded-xl flex items-start gap-3 animate-[shake_0.5s_ease-in-out]">
//                   <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mt-0.5 ring-4 ring-red-50">
//                     <AlertCircle className="w-4 h-4 text-red-600" />
//                   </div>
//                   <div className="flex-1">
//                     <p className="text-sm font-semibold text-red-800">
//                       Authentication Failed
//                     </p>
//                     <p className="text-xs text-red-600 mt-0.5">{error}</p>
//                   </div>
//                   <button className="flex-shrink-0 text-red-400 hover:text-red-600 transition-colors">
//                     <X className="w-4 h-4" />
//                   </button>
//                 </div>
//               )}

//               <form onSubmit={handleSubmit} className="space-y-6">
//                 {/* Email Field - Premium Design */}
//                 <div className="space-y-2">
//                   <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 ml-1">
//                     <Mail className="w-4 h-4 text-slate-400" />
//                     Email Address
//                   </label>
//                   <div className="relative group">
//                     {/* Focus Ring Animation */}
//                     <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl opacity-0 group-focus-within:opacity-100 blur transition-opacity duration-300" />
//                     <div className="relative">
//                       <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
//                         <div className="w-8 h-8 rounded-lg bg-slate-100 group-focus-within:bg-indigo-100 flex items-center justify-center transition-colors duration-200">
//                           <AtSign className="h-4 w-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors duration-200" />
//                         </div>
//                       </div>
//                       <input
//                         type="email"
//                         className="block w-full pl-14 pr-4 py-3.5 bg-slate-50/80 border-2 border-slate-200/80 rounded-xl
//                     text-slate-900 placeholder-slate-400 text-sm font-medium
//                     focus:outline-none focus:border-transparent focus:bg-white
//                     hover:border-slate-300 hover:bg-slate-50
//                     transition-all duration-200"
//                         placeholder="name@company.com"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         required
//                         autoComplete="email"
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 {/* Password Field - Premium Design */}
//                 <div className="space-y-2">
//                   <div className="flex justify-between items-center ml-1">
//                     <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
//                       <KeyRound className="w-4 h-4 text-slate-400" />
//                       Password
//                     </label>
//                     <button
//                       type="button"
//                       onClick={handleForgotPassword}
//                       disabled={forgotLoading}
//                       className="group/forgot flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors disabled:opacity-50"
//                     >
//                       <span>
//                         {forgotLoading ? "Sending..." : "Forgot password?"}
//                       </span>
//                       <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover/forgot:opacity-100 group-hover/forgot:translate-x-0 transition-all duration-200" />
//                     </button>
//                   </div>
//                   <div className="relative group">
//                     {/* Focus Ring Animation */}
//                     <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl opacity-0 group-focus-within:opacity-100 blur transition-opacity duration-300" />
//                     <div className="relative">
//                       <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
//                         <div className="w-8 h-8 rounded-lg bg-slate-100 group-focus-within:bg-indigo-100 flex items-center justify-center transition-colors duration-200">
//                           <Lock className="h-4 w-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors duration-200" />
//                         </div>
//                       </div>
//                       <input
//                         type={showPass ? "text" : "password"}
//                         className="block w-full pl-14 pr-14 py-3.5 bg-slate-50/80 border-2 border-slate-200/80 rounded-xl
//                     text-slate-900 placeholder-slate-400 text-sm font-medium
//                     focus:outline-none focus:border-transparent focus:bg-white
//                     hover:border-slate-300 hover:bg-slate-50
//                     transition-all duration-200"
//                         placeholder="Enter your password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         required
//                         autoComplete="current-password"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => setShowPass(!showPass)}
//                         className="absolute inset-y-0 right-0 pr-4 flex items-center z-10"
//                         tabIndex={-1}
//                       >
//                         <div className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors duration-200">
//                           {showPass ? (
//                             <EyeOff className="h-4 w-4 text-slate-400 hover:text-slate-600" />
//                           ) : (
//                             <Eye className="h-4 w-4 text-slate-400 hover:text-slate-600" />
//                           )}
//                         </div>
//                       </button>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Submit Button - Premium Gradient with Shine Effect */}
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="group/btn relative w-full mt-4 overflow-hidden rounded-xl transition-all duration-300
//               disabled:opacity-60 disabled:cursor-not-allowed"
//                 >
//                   {/* Button Background */}
//                   <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 transition-all duration-300 group-hover/btn:from-indigo-700 group-hover/btn:via-indigo-700 group-hover/btn:to-purple-700" />

//                   {/* Shine Effect */}
//                   <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300">
//                     <div className="absolute inset-0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
//                   </div>

//                   {/* Button Shadow */}
//                   <div className="absolute inset-0 rounded-xl shadow-lg shadow-indigo-500/30 group-hover/btn:shadow-xl group-hover/btn:shadow-indigo-500/40 transition-shadow duration-300" />

//                   {/* Button Content */}
//                   <div className="relative flex items-center justify-center gap-2 py-4 px-6 text-white font-semibold text-sm">
//                     {loading ? (
//                       <>
//                         <Loader2 className="w-5 h-5 animate-spin" />
//                         <span>Authenticating...</span>
//                       </>
//                     ) : (
//                       <>
//                         <span>Sign In to Dashboard</span>
//                         <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
//                       </>
//                     )}
//                   </div>
//                 </button>
//               </form>

//               {/* Trust Indicators */}
//               <div className="mt-6 space-y-4">
//                 {/* Security Notice */}
//                 <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-slate-50 to-indigo-50/30 rounded-xl border border-slate-200/60">
//                   <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
//                     <ShieldCheck className="w-5 h-5 text-white" />
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <h4 className="text-xs font-bold text-slate-800 mb-0.5">
//                       256-bit Encryption Active
//                     </h4>
//                     <p className="text-[10px] text-slate-600 leading-relaxed">
//                       Your connection is secured with enterprise-grade SSL/TLS
//                       encryption
//                     </p>
//                   </div>
//                 </div>

//                 {/* Platform Features */}
//                 <div className="grid grid-cols-3 gap-2">
//                   {/* Centralized Projects */}
//                   <div className="text-center p-3 rounded-lg bg-white/70 border border-slate-200/50 backdrop-blur-sm">
//                     <div className="flex items-center justify-center mb-1">
//                       <FolderKanban className="w-4 h-4 text-indigo-500" />
//                     </div>
//                     <p className="text-[10px] font-medium text-slate-700 leading-tight">
//                       Centralized Projects
//                     </p>
//                     <p className="text-[11px] text-slate-500 mt-0.5">
//                       Organized folders & files
//                     </p>
//                   </div>

//                   {/* Version Integrity */}
//                   <div className="text-center p-3 rounded-lg bg-white/70 border border-slate-200/50 backdrop-blur-sm">
//                     <div className="flex items-center justify-center mb-1">
//                       <Layers className="w-4 h-4 text-indigo-500" />
//                     </div>
//                     <p className="text-[10px] font-medium text-slate-700 leading-tight">
//                       Version Integrity
//                     </p>
//                     <p className="text-[11px] text-slate-500 mt-0.5">
//                       No file loss or overwrites
//                     </p>
//                   </div>

//                   {/* Real-time Tracking */}
//                   <div className="text-center p-3 rounded-lg bg-white/70 border border-slate-200/50 backdrop-blur-sm">
//                     <div className="flex items-center justify-center mb-1">
//                       <Activity className="w-4 h-4 text-indigo-500" />
//                     </div>
//                     <p className="text-[10px] font-medium text-slate-700 leading-tight">
//                       Live Status Tracking
//                     </p>
//                     <p className="text-[11px] text-slate-500 mt-0.5">
//                       No follow-ups needed
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Subtle Footer Divider */}
//               <div className="mt-6 pt-6 border-t border-slate-200/60">
//                 <p className="text-center text-[10px] text-slate-400">
//                   Protected by enterprise-grade security
//                 </p>
//               </div>

//               {/* Divider with Text */}
//             </div>
//           </div>

//           {/* Security Trust Badges - Enhanced */}
//           <div className="mt-8 flex flex-col items-center gap-4">
//             {/* <p className="text-[11px] text-slate-900 text-center">
//               Enterprise-grade security ensured by Team Micrologic
//             </p> */}
//           </div>

//           {/* Mobile Info Toggle - Enhanced */}
//           <div className="lg:hidden mt-10">
//             <button
//               type="button"
//               onClick={() => setMobileInfoExpanded(!mobileInfoExpanded)}
//               className="group w-full flex items-center justify-between px-5 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl text-white shadow-lg shadow-slate-900/20 hover:shadow-xl transition-all duration-300"
//             >
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
//                   <Sparkles className="w-5 h-5 text-white" />
//                 </div>
//                 <div className="text-left">
//                   <span className="text-sm font-semibold block">
//                     Platform Features
//                   </span>
//                   <span className="text-xs text-slate-400">
//                     Why enterprises choose us
//                   </span>
//                 </div>
//               </div>
//               <div
//                 className={`w-8 h-8 rounded-full bg-white/10 flex items-center justify-center transition-transform duration-300 ${
//                   mobileInfoExpanded ? "rotate-180" : ""
//                 }`}
//               >
//                 <ChevronDown className="w-4 h-4" />
//               </div>
//             </button>

//             {/* Mobile Features Panel - Premium Design */}
//             <div
//               className={`overflow-hidden transition-all duration-500 ease-out ${
//                 mobileInfoExpanded
//                   ? "max-h-[800px] opacity-100 mt-4"
//                   : "max-h-0 opacity-0"
//               }`}
//             >
//               <div className="bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-6 space-y-5">
//                 {/* Header */}
//                 <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
//                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
//                   <h3 className="text-lg font-bold text-slate-800">
//                     Enterprise-Grade Platform
//                   </h3>
//                 </div>

//                 {/* Features List */}
//                 {/* <div className="space-y-3">
//                   {enterpriseFeatures.map((feature, index) => (
//                     <div
//                       key={index}
//                       className="group flex items-start gap-4 p-4 rounded-xl bg-white border border-slate-200 hover:border-indigo-200 hover:shadow-sm transition-all duration-300"
//                     >
//                       <div
//                         className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center ${feature.accentColor} border shadow-lg`}
//                       >
//                         <feature.icon className="w-5 h-5" />
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <h4 className="text-sm font-semibold text-slate-800 mb-1">
//                           {feature.title}
//                         </h4>
//                         <p className="text-xs text-slate-400 leading-relaxed">
//                           {feature.description}
//                         </p>
//                       </div>
//                       <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-1" />
//                     </div>
//                   ))}
//                 </div> */}

//                 {/* Stats Row */}
//                 {/* <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-700/50">
//                   <div className="text-center p-3 rounded-lg bg-white/5">
//                     <p className="text-xl font-bold text-white">99.9%</p>
//                     <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">
//                       Uptime SLA
//                     </p>
//                   </div>
//                   <div className="text-center p-3 rounded-lg bg-white/5">
//                     <p className="text-xl font-bold text-white">500+</p>
//                     <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">
//                       Enterprises
//                     </p>
//                   </div>
//                   <div className="text-center p-3 rounded-lg bg-white/5">
//                     <p className="text-xl font-bold text-white">24/7</p>
//                     <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">
//                       Support
//                     </p>
//                   </div>
//                 </div> */}

//                 {/* Compliance Badges Mobile */}
//                 {/* Compliance & Security Badges */}
//                 <div className="mt-8 flex flex-col items-center gap-5">
//                   <div className="flex items-center gap-2 flex-wrap justify-center">
//                     {complianceBadges.map((badge, index) => (
//                       <div
//                         key={index}
//                         className="group flex items-center gap-2 px-3 py-2 rounded-lg bg-white/80 border-2 border-slate-200/80 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-300"
//                       >
//                         <badge.icon className="w-4 h-4 text-slate-600 group-hover:text-indigo-600 transition-colors" />
//                         <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wide">
//                           {badge.label}
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                   <p className="text-[11px] text-slate-500 text-center max-w-xs leading-relaxed">
//                     Enterprise-grade security ensured by{" "}
//                     <span className="font-semibold text-indigo-600">
//                       Team Micrologic
//                     </span>
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

// src/pages/Login.jsx
import React, { useState } from "react";
import { useAuthApi } from "../api/authApi";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import ChangePasswordModal from "../components/modals/ChangePasswordModal";
import loginImage from "../assets/pm_login.png";

import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  LayoutDashboard,
  Loader2,
  AlertCircle,
  X,
} from "lucide-react";
import Swal from "sweetalert2";

const Login = () => {
  const navigate = useNavigate();
  const { login: saveLogin } = useAuth();
  const { login: loginApi, requestPasswordReset } = useAuthApi();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showChangePassword, setShowChangePassword] = useState(false);
  const [tempUserId, setTempUserId] = useState(null);

  const handleForgotPassword = async () => {
    if (!email) {
      Swal.fire({
        icon: "warning",
        title: "Email Required",
        text: "Please enter your registered email address first.",
        confirmButtonColor: "#6366f1",
      });
      return;
    }

    try {
      setForgotLoading(true);
      const res = await requestPasswordReset(email);

      Swal.fire({
        icon: "success",
        title: "Check your email 📧",
        text:
          res?.data?.message ||
          "A password reset link has been sent to your email.",
        confirmButtonColor: "#6366f1",
      });
    } catch {
      Swal.fire({
        icon: "error",
        title: "Request Failed",
        text: "Something went wrong. Please try again.",
        confirmButtonColor: "#6366f1",
      });
    } finally {
      setForgotLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginApi({ email, password });

      if (res.data.mustChangePassword) {
        setTempUserId(res.data.userId);
        setShowChangePassword(true);
        return;
      }

      saveLogin(res.data.user, res.data.token);

      // Swal.fire({
      //   icon: "success",
      //   title: "Welcome Back! ✨",
      //   toast: true,
      //   position: "top-end",
      //   timer: 2500,
      //   showConfirmButton: false,
      // });

      // Your Swal.fire() — unchanged
      Swal.fire({
        icon: "success",
        title: "Welcome ✨",
        html: '<p class="text-blue-600 font-semibold">Logged in successfully</p>',
        toast: true,
        position: "top-end",
        timer: 2500,
        timerProgressBar: true,
        showConfirmButton: false,
        background: "linear-gradient(135deg, #eff6ff 0%, #f3e8ff 100%)",
        customClass: {
          popup: "rounded-2xl shadow-2xl border-2 border-blue-200",
          timerProgressBar: "swal-progress-gradient",
        },
      });

      navigate(
        res.data.user.role === "admin" || res.data.user.role === "techsales"
          ? "/dashboard"
          : "/customer/dashboard",
      );
    } catch (err) {
      const data = err?.response?.data;

      if (data?.resetSuggested) {
        Swal.fire({
          icon: "warning",
          title: "Reset Password?",
          showCancelButton: true,
          confirmButtonText: "Send Reset Link",
        }).then(async (result) => {
          if (result.isConfirmed) {
            await requestPasswordReset(email);
          }
        });
        return;
      }

      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: data?.message || "Invalid email or password",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* LEFT SIDE */}
      <div className="hidden lg:block w-[65%] h-screen relative overflow-hidden">
        <img
          src={loginImage}
          alt="Login Visual"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* RIGHT SIDE */}
      <div className="relative flex w-full lg:w-[35%] items-center justify-center px-4 py-8 bg-gradient-to-br from-white via-slate-50 to-indigo-50 border-l border-slate-100">
        {/* SOFT GLOW */}
        <div className="absolute top-20 right-10 w-[200px] h-[200px] bg-indigo-200/30 blur-3xl rounded-full"></div>
        <div className="absolute bottom-10 left-10 w-[150px] h-[150px] bg-blue-200/30 blur-2xl rounded-full"></div>

        {/* MOBILE BG */}
        <div
          className="absolute inset-0 lg:hidden bg-cover bg-center"
          style={{ backgroundImage: `url(${loginImage})` }}
        />
        <div className="absolute inset-0 bg-white/85 backdrop-blur-sm lg:hidden" />

        {/* CONTENT */}
        <div className="relative w-full max-w-md animate-[fadeIn_0.6s_ease]">
          {/* LOGO */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-2.5 mb-1 transition hover:scale-105">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/30">
                <LayoutDashboard className="w-4.5 h-4.5 text-white" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Micro<span className="text-blue-600">Sync</span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 tracking-widest uppercase">
              Project Management
            </p>
          </div>

          {/* CARD */}
          <div
            className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 
    shadow-[0_10px_40px_rgba(0,0,0,0.08)] 
    hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)] 
    transition-all duration-300"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-slate-900">
                Welcome 👋
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Sign in to continue to MicroSync
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 rounded-lg flex gap-2">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <span className="text-sm text-red-700">{error}</span>
                <X className="w-4 h-4 ml-auto" />
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* EMAIL */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    placeholder="you@company.com"
                    className="w-full pl-10 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-300 
              shadow-sm focus:shadow-md focus:ring-2 focus:ring-blue-500/20 
              focus:border-blue-400 transition-all duration-200"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    disabled={forgotLoading}
                    className="text-xs text-blue-500 hover:text-blue-700 font-medium transition-colors"
                  >
                    {forgotLoading ? "Sending..." : "Forgot password?"}
                  </button>
                </div>

                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-11 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-300 
              shadow-sm focus:shadow-md focus:ring-2 focus:ring-blue-500/20 
              focus:border-blue-400 transition-all duration-200"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="group w-full flex items-center justify-center gap-2 
          bg-gradient-to-r from-blue-600 to-indigo-600 
          hover:from-blue-700 hover:to-indigo-700 
          text-white py-3 rounded-xl font-medium text-sm 
          shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 
          transition-all duration-300 active:scale-[0.97] 
          hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in to your account
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-slate-400">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              Secure login
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            © {new Date().getFullYear()} MicroSync
          </p>
        </div>
      </div>

      {showChangePassword && (
        <ChangePasswordModal
          open={showChangePassword}
          userId={tempUserId}
          onChanged={() => setShowChangePassword(false)}
        />
      )}
    </div>
  );
};

export default Login;
