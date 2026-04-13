// frontend/src/pages/teams/TeamsDashboard.jsx
import React, { useEffect, useState } from "react";
import {
  Building2,
  FolderKanban,
  ArrowRight,
  TrendingUp,
  Loader2,
  Clock,
  AlertCircle,
  Sparkles,
  ChevronRight,
  Activity,
  Zap,
  Star,
  Users,
  Network,
} from "lucide-react";
import { useAxios } from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useBreadcrumb } from "../../context/BreadcrumbContext";

export default function TeamsDashboard() {
  const api = useAxios();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { setBreadcrumb } = useBreadcrumb();

  useEffect(() => {
    setBreadcrumb([
      { label: "Dashboard", to: "/dashboard" },
      { label: "Teams" },
    ]);
  }, [setBreadcrumb]);

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    departments: "--",
    projects: "--",
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const res = await api.get("/departments/dashboard");

        setStats({
          departments: res.data.totalDepartments || 0,
          projects: res.data.totalProjects || 0,
        });
      } catch (err) {
        console.error("Teams dashboard error:", err);
        setStats({
          departments: 0,
          projects: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  /* ---------------------------------------------------
     Loading state
  --------------------------------------------------- */
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
              Loading Teams
            </h2>
            <p className="text-xs sm:text-sm lg:text-base text-gray-500">
              Please wait we are about to Fetch Department details and
              projects...
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

  // Get current time for greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="w-full min-h-[calc(100vh-60px)] sm:min-h-[calc(100vh-70px)] lg:min-h-[calc(100vh-80px)] bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 sm:-top-40 sm:-right-40 w-40 h-40 sm:w-60 sm:h-60 lg:w-80 lg:h-80 bg-sky-400 rounded-full opacity-5 blur-2xl sm:blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 sm:-bottom-40 sm:-left-40 w-40 h-40 sm:w-60 sm:h-60 lg:w-80 lg:h-80 bg-indigo-400 rounded-full opacity-5 blur-2xl sm:blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-gradient-to-r from-blue-300 to-indigo-300 rounded-full opacity-5 blur-2xl sm:blur-3xl"></div>
      </div>

      {/* Scrollable Content Area */}
      <div className="relative overflow-visible overflow-x-hidden">
        <div className="px-3 py-4 sm:px-4 sm:py-6 md:px-6 lg:px-8 xl:px-12 2xl:px-16 min-h-full flex flex-col">
          <div className="max-w-5xl mx-auto w-full flex flex-col">
            {/* Header Section */}
            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
              {/* Badge and Date */}
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div
                  className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-2 sm:py-2.5 
    bg-white/70 backdrop-blur-md 
    border border-slate-200/60 
    shadow-sm hover:shadow-md 
    rounded-full 
    text-xs sm:text-sm font-medium text-slate-700 
    transition-all duration-200"
                >
                  <div className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
                    <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>

                  <span className="hidden sm:inline tracking-wide">
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>

                  <span className="sm:hidden">
                    {new Date().toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {/* Greeting */}
              <div className="text-center space-y-2 sm:space-y-3 md:space-y-4">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-indigo-800 tracking-tight">
                  Teams Dashboard
                </h1>

                <p className="text-gray-500 text-sm sm:text-base max-w-2xl mx-auto font-medium">
                  Manage internal departments and track their project activities
                  across the organization.
                </p>
              </div>
            </div>

            {/* Main Content Area - Centered */}
            <div className="flex justify-center pt-2 sm:pt-3 px-2 sm:px-4">
              {stats.departments > 0 ? (
                /* Departments Card - Large and Centered */
                <div
                  onClick={() => navigate("/teams/departments")}
                  className="group cursor-pointer relative w-full max-w-[340px] sm:max-w-md"
                >
                  {/* Glow effect */}
                  <div className="absolute -inset-0.5 sm:-inset-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 rounded-2xl sm:rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>

                  {/* Card */}
                  <div className="relative bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 border border-gray-200/60 shadow-lg hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] overflow-hidden">
                    {/* Background pattern */}
                    <div className="absolute inset-0 bg-gradient-to-br from-sky-50/50 via-transparent to-indigo-50/50"></div>

                    {/* Floating elements */}
                    <div className="absolute top-2 right-2 sm:top-4 sm:right-4 opacity-10">
                      <Building2 className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 text-indigo-600 rotate-12" />
                    </div>

                    <div className="relative space-y-5 sm:space-y-6 md:space-y-8">
                      {/* Icon and Badge */}
                      <div className="flex items-start justify-between">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-700 rounded-2xl blur-xl opacity-50"></div>
                          <div className="relative inline-flex p-4 bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-700 rounded-2xl shadow-xl">
                            <Building2 className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                          </div>
                        </div>

                        {/* Status indicators */}
                      </div>

                      {/* Content */}
                      <div className="space-y-4 sm:space-y-5 md:space-y-6">
                        <div>
                          <p className="text-xs sm:text-sm font-semibold text-slate-500 mb-2 sm:mb-3 flex items-center gap-1.5 sm:gap-2">
                            Total Departments
                            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
                          </p>

                          <div className="flex items-baseline gap-2 sm:gap-3">
                            <p className="text-5xl sm:text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 bg-clip-text text-transparent">
                              {stats.departments}
                            </p>
                            <p className="text-sm sm:text-base md:text-lg text-slate-500 font-medium">
                              {stats.departments === 1
                                ? "Department"
                                : "Departments"}
                            </p>
                          </div>

                          <p className="text-xs sm:text-sm text-slate-400 mt-2 sm:mt-3">
                            Actively managed in the system
                          </p>
                        </div>

                        {/* Additional Stats */}
                        {/* <div className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-indigo-100">
                          <div className="flex items-center gap-2">
                            <FolderKanban className="w-4 h-4 text-indigo-600" />
                            <span className="text-sm font-semibold text-gray-700">
                              Total Projects
                            </span>
                          </div>
                          <span className="text-sm font-bold text-indigo-600">
                            {stats.projects}
                          </span>
                        </div> */}

                        {/* Progress bar */}
                        {/* <div className="space-y-2">
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500 rounded-full"
                              style={{
                                width: `${Math.min((stats.departments / 10) * 100, 100)}%`,
                              }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 font-medium">
                            Organization growth
                          </p>
                        </div> */}

                        {/* Action button */}
                        <button className="w-full group/btn relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl p-4 text-sm font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-200 hover:scale-105">
                          <span className="flex items-center justify-center gap-2">
                            View All Departments
                            <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Empty State - Centered */
                <div className="relative w-full max-w-xs sm:max-w-md md:max-w-2xl px-2">
                  <div className="relative overflow-hidden bg-white border-2 border-gray-200 border-dashed rounded-2xl sm:rounded-3xl p-8 sm:p-12 lg:p-16 shadow-lg">
                    <div className="absolute inset-0 bg-gradient-to-br from-sky-50/30 via-transparent to-indigo-50/30"></div>

                    <div className="relative space-y-4 sm:space-y-6 text-center">
                      <div className="inline-flex p-3 sm:p-4 md:p-5 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full shadow-inner mx-auto">
                        <Building2 className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-slate-400" />
                      </div>

                      <div className="space-y-2 sm:space-y-3">
                        <p className="text-lg sm:text-xl md:text-2xl font-bold text-slate-700">
                          No departments created yet
                        </p>
                        <p className="text-sm sm:text-base text-slate-500 leading-relaxed max-w-xs sm:max-w-md mx-auto">
                          Start by creating departments to organize your teams
                          and assign projects.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
