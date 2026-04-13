// src/utils/fileIcons.js
import {
  FileText,
  FileSpreadsheet,
  FileVideo,
  FileArchive,
  FileImage,
  File,
} from "lucide-react";

export const getFileIcon = (type) => {
  const fileType = type?.toLowerCase();

  switch (fileType) {
    case "pdf":
      return <FileText className="h-full w-full" />;

    case "doc":
    case "docx":
      return <FileText className="h-full w-full" />;

    case "xls":
    case "xlsx":
      return <FileSpreadsheet className="h-full w-full" />;

    case "csv":
      return <FileSpreadsheet className="h-full w-full" />;

    case "mp4":
    case "avi":
    case "mov":
    case "mkv":
      return <FileVideo className="h-full w-full" />;

    case "jpg":
    case "jpeg":
    case "png":
    case "webp":
      return <FileImage className="h-full w-full" />;

    case "zip":
    case "rar":
    case "7z":
      return <FileArchive className="h-full w-full" />;

    default:
      // ✅ Fallback icon (CRITICAL)
      return <File className="h-full w-full" />;
  }
};
