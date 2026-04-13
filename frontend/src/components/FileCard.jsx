// // src/components/FileCard.jsx
// import React, { useEffect, useRef, useState } from "react";
// import { getFileIcon } from "../utils/fileIcons";
// import { formatDate } from "../utils/formatDate";
// import {
//   Eye,
//   EyeOff,
//   User,
//   Calendar,
//   Trash2,
//   History,
//   ChevronRight,
//   Shield,
//   Download,
// } from "lucide-react";

// const FileCard = ({
//   document,
//   user,
//   onView,
//   onDelete,
//   onVersions,
//   canView,
//   canDelete,
//   canDownload,
// }) => {
//   const fileType = document.filename
//     ? document.filename.split(".").pop().toUpperCase()
//     : "UNKNOWN";

//   const Icon = getFileIcon(fileType);
//   const uploadedBy = document.uploaded_by_name || "Unknown User";

//   const titleRef = useRef(null);
//   const [isOverflowing, setIsOverflowing] = useState(false);

//   const handleDownload = async () => {
//     if (!canDownload) return;

//     try {
//       const token = localStorage.getItem("token");

//       // ✅ Step 1: get versions
//       const versionsRes = await fetch(
//         `${import.meta.env.VITE_API_URL}/api/documents/${document.id}/versions`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         },
//       );

//       if (!versionsRes.ok) {
//         throw new Error("Failed to fetch versions");
//       }

//       const versions = await versionsRes.json();
//       const latest = versions?.[0];

//       if (!latest) {
//         console.error("No versions found");
//         return;
//       }

//       // ✅ Step 2: download using VERSION ID
//       const res = await fetch(
//         `${import.meta.env.VITE_API_URL}/api/documents/download/${latest.id}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         },
//       );

//       if (!res.ok) {
//         throw new Error("Download API failed");
//       }

//       const blob = await res.blob();

//       const link = window.document.createElement("a");
//       link.href = URL.createObjectURL(blob);
//       link.download = latest.original_filename || latest.filename || "file";

//       link.click();

//       // ✅ cleanup (good practice)
//       URL.revokeObjectURL(link.href);
//     } catch (err) {
//       console.error("Download failed", err);
//       alert("Download failed. Please try again.");
//     }
//   };

//   useEffect(() => {
//     const el = titleRef.current;
//     if (el) {
//       setIsOverflowing(el.scrollWidth > el.clientWidth);
//     }
//   }, [document.original_filename, document.filename, document.title]);

//   return (
//     <div
//       className="
//         group relative
//         bg-white
//         border border-gray-200
//         rounded-2xl
//         p-5
//         hover:shadow-lg hover:shadow-indigo-500/10
//         hover:border-indigo-200
//         transition-all duration-300
//       "
//     >
//       {/* subtle gradient accent */}
//       <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-50/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />

//       {/* Delete */}
//       {canDelete && (
//         <button
//           onClick={onDelete}
//           className="
//             absolute top-3 right-3 z-10
//             opacity-0 group-hover:opacity-100
//             p-2 rounded-lg
//             text-gray-400 hover:text-red-600 hover:bg-red-50
//             transition
//           "
//         >
//           <Trash2 className="w-4 h-4" />
//         </button>
//       )}

//       <div className="relative z-10 flex gap-4">
//         {/* Icon */}
//         <div
//           className="
//     h-14 w-14 flex items-center justify-center
//     rounded-xl
//     bg-gradient-to-br from-blue-500 to-indigo-600
//     text-white shadow-md
//     group-hover:scale-105
//     transition
//   "
//         >
//           {Icon && <div className="w-6 h-6">{Icon}</div>}
//         </div>

//         {/* Content */}
//         <div className="flex-1 min-w-0">
//           {/* File Name */}
//           <div className="overflow-hidden relative">
//             <h3
//               ref={titleRef}
//               className={`
//     text-sm font-semibold text-gray-900
//     group-hover:text-indigo-600 transition
//     whitespace-nowrap
//     ${isOverflowing ? "animate-marquee" : "truncate"}
//   `}
//             >
//               {document.original_filename ||
//                 document.filename ||
//                 document.title}
//             </h3>
//           </div>

//           {/* Meta */}
//           <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
//             <User className="w-3.5 h-3.5" />
//             <span>{uploadedBy}</span>
//           </div>

//           <div className="flex items-center gap-2 mt-4">
//             {/* VIEW */}
//             {canView ? (
//               <button
//                 onClick={onView}
//                 className="
//         px-3 py-1.5
//         text-xs font-medium
//         rounded-md
//         bg-indigo-600 text-white
//         hover:bg-indigo-700
//         transition
//         flex items-center gap-1
//       "
//               >
//                 <Eye className="w-4 h-4" />
//                 <span className="hidden sm:inline">View</span>
//               </button>
//             ) : (
//               <div className="px-3 py-1.5 rounded-md bg-gray-100 text-gray-400 text-xs flex items-center gap-1">
//                 <EyeOff className="w-4 h-4" />
//               </div>
//             )}

//             {/* DOWNLOAD */}
//             <button
//               onClick={handleDownload}
//               disabled={!canDownload}
//               className={`
//       px-3 py-1.5
//       text-xs font-medium
//       rounded-md
//       flex items-center gap-1
//       transition
//       ${
//         canDownload
//           ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow"
//           : "bg-gray-100 text-gray-400 cursor-not-allowed"
//       }
//     `}
//             >
//               <Download className="w-4 h-4" />
//               <span className="hidden sm:inline">Download</span>
//             </button>

//             {/* HISTORY */}
//             <button
//               onClick={onVersions}
//               className="
//       px-3 py-1.5
//       text-xs font-medium
//       rounded-md
//       border border-gray-200
//       text-gray-700
//       hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600
//       transition
//       flex items-center gap-1
//     "
//             >
//               <History className="w-4 h-4" />
//               <span className="hidden sm:inline">History</span>
//               <ChevronRight className="w-3 h-3" />
//             </button>
//           </div>

//           {/* Tags */}
//           <div className="flex gap-2 mt-3">
//             <span className="px-2 py-1 text-xs rounded-md bg-gray-100 text-gray-600">
//               {fileType}
//             </span>

//             <span className="px-2 py-1 text-xs rounded-md bg-indigo-50 text-indigo-600 flex items-center gap-1">
//               <Shield className="w-3 h-3" />v{document.current_version}
//             </span>
//           </div>

//           {/* Footer */}
//           <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
//             <Calendar className="w-3.5 h-3.5" />
//             {formatDate(document.created_at)}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FileCard;

// src/components/FileCard.jsx
import React, { useEffect, useRef, useState } from "react";
import { getFileIcon } from "../utils/fileIcons";
import { formatDate } from "../utils/formatDate";
import {
  User,
  Calendar,
  Trash2,
  History,
  ChevronRight,
  Shield,
  Download,
} from "lucide-react";

const FileCard = ({
  document,
  user,
  onView,
  onDelete,
  onVersions,
  canView,
  canDelete,
  canDownload,
}) => {
  const fileType = document.filename
    ? document.filename.split(".").pop().toUpperCase()
    : "UNKNOWN";

  const Icon = getFileIcon(fileType);
  const uploadedBy = document.uploaded_by_name || "Unknown User";

  const titleRef = useRef(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const handleDownload = async (e) => {
    e.stopPropagation(); // ✅ prevent card click
    if (!canDownload) return;

    try {
      const token = localStorage.getItem("token");

      const versionsRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/documents/${document.id}/versions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!versionsRes.ok) throw new Error("Failed to fetch versions");

      const versions = await versionsRes.json();
      const latest = versions?.[0];

      if (!latest) return;

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/documents/download/${latest.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) throw new Error("Download API failed");

      const blob = await res.blob();

      const link = window.document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = latest.original_filename || latest.filename || "file";
      link.click();

      URL.revokeObjectURL(link.href);
    } catch (err) {
      console.error("Download failed", err);
      alert("Download failed. Please try again.");
    }
  };

  useEffect(() => {
    const el = titleRef.current;
    if (el) {
      setIsOverflowing(el.scrollWidth > el.clientWidth);
    }
  }, [document.original_filename, document.filename, document.title]);

  return (
    <div
      className="
    group relative
    bg-white border border-gray-200 rounded-2xl p-5
    hover:shadow-lg hover:shadow-indigo-500/10
    hover:border-indigo-200
    transition-all duration-300
  "
    >
      {/* gradient */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-50/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />

      {/* Delete */}
      {canDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="
            absolute top-3 right-3 z-10
            opacity-0 group-hover:opacity-100
            p-2 rounded-lg
            text-gray-400 hover:text-red-600 hover:bg-red-50
            transition
          "
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}

      <div className="relative z-10 flex gap-4">
        {/* Icon */}
        <div
          className="
            h-14 w-14 flex items-center justify-center
            rounded-xl
            bg-gradient-to-br from-blue-500 to-indigo-600
            text-white shadow-md
            group-hover:scale-105
            transition
          "
        >
          {Icon && <div className="w-6 h-6">{Icon}</div>}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* File Name (CLICKABLE) */}
          <div className="overflow-hidden relative">
            <button
              ref={titleRef}
              onClick={(e) => {
                e.stopPropagation();
                if (canView) onView();
              }}
              disabled={!canView}
              className={`
                text-left w-full text-sm font-semibold
                whitespace-nowrap transition
                ${
                  canView
                    ? "text-gray-900 hover:text-indigo-600 cursor-pointer"
                    : "text-gray-400 cursor-not-allowed"
                }
                ${isOverflowing ? "animate-marquee" : "truncate"}
              `}
            >
              {document.original_filename ||
                document.filename ||
                document.title}
            </button>
          </div>

          {/* Meta */}
          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
            <User className="w-3.5 h-3.5" />
            <span>{uploadedBy}</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 mt-4">
            {/* DOWNLOAD */}
            <button
              onClick={handleDownload}
              disabled={!canDownload}
              className={`
                px-3 py-1.5 text-xs font-medium rounded-md
                flex items-center gap-1 transition
                ${
                  canDownload
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }
              `}
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download</span>
            </button>

            {/* HISTORY */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onVersions();
              }}
              className="
                px-3 py-1.5 text-xs font-medium rounded-md
                border border-gray-200 text-gray-700
                hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600
                transition flex items-center gap-1
              "
            >
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">History</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* Tags */}
          <div className="flex gap-2 mt-3">
            <span className="px-2 py-1 text-xs rounded-md bg-gray-100 text-gray-600">
              {fileType}
            </span>

            <span className="px-2 py-1 text-xs rounded-md bg-indigo-50 text-indigo-600 flex items-center gap-1">
              <Shield className="w-3 h-3" />v{document.current_version}
            </span>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(document.created_at)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileCard;
