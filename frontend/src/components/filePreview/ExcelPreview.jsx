// // ExcelPreview.jsx
// import React, { useEffect, useState } from "react";
// import * as XLSX from "xlsx";

// const ExcelPreview = ({ fileUrl }) => {
//   const [rows, setRows] = useState([]);

//   useEffect(() => {
//     const load = async () => {
//       const res = await fetch(fileUrl);
//       const buffer = await res.arrayBuffer();
//       const wb = XLSX.read(buffer);
//       const sheet = wb.Sheets[wb.SheetNames[0]];
//       const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
//       setRows(data.slice(0, 300));
//     };
//     load();
//   }, [fileUrl]);

//   return (
//     <div className="overflow-auto border rounded-lg bg-white shadow">
//       <table className="min-w-full text-xs border-collapse">
//         <tbody>
//           {rows.map((row, i) => (
//             <tr key={i} className="border-b">
//               {row.map((cell, j) => (
//                 <td key={j} className="px-2 py-1 border-r whitespace-nowrap">
//                   {String(cell ?? "")}
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default ExcelPreview;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ExcelPreview.jsx
// import React, { useEffect, useState } from "react";
// import * as XLSX from "xlsx";

// const MAX_ROWS = 1000;
// const MAX_SHEETS = 10;
// const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB safety limit

// const ExcelPreview = ({ fileUrl }) => {
//   const [rows, setRows] = useState([]);
//   const [tooLargeFile, setTooLargeFile] = useState(false);
//   const [tooManyRows, setTooManyRows] = useState(false);
//   const [tooManySheets, setTooManySheets] = useState(false);

//   useEffect(() => {
//     const load = async () => {
//       try {
//         // ---------- CHECK FILE SIZE FIRST ----------
//         const head = await fetch(fileUrl, { method: "HEAD" });
//         const size = parseInt(head.headers.get("Content-Length") || "0");

//         if (size > MAX_FILE_SIZE) {
//           setTooLargeFile(true);
//           return;
//         }

//         // ---------- FETCH FILE ----------
//         const res = await fetch(fileUrl);
//         const buffer = await res.arrayBuffer();

//         // ---------- READ WORKBOOK ----------
//         const wb = XLSX.read(buffer, { dense: true });

//         // ---------- SHEET LIMIT ----------
//         if (wb.SheetNames.length > MAX_SHEETS) {
//           setTooManySheets(true);
//           return;
//         }

//         const sheet = wb.Sheets[wb.SheetNames[0]];

//         // ---------- ROW COUNT CHECK (FAST) ----------
//         if (!sheet["!ref"]) {
//           setRows([]);
//           return;
//         }

//         const range = XLSX.utils.decode_range(sheet["!ref"]);
//         const rowCount = range.e.r + 1;

//         if (rowCount > MAX_ROWS) {
//           setTooManyRows(true);
//           return;
//         }

//         // ---------- SAFE PARSE ----------
//         const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
//         setRows(data);
//       } catch (err) {
//         console.error("Excel preview failed:", err);
//       }
//     };

//     load();
//   }, [fileUrl]);

//   // ---------- FILE TOO LARGE ----------
//   if (tooLargeFile) {
//     return (
//       <div className="h-full flex flex-col items-center justify-center text-center p-6">
//         <p className="text-lg font-semibold text-gray-800">
//           Excel file is too large to preview
//         </p>
//         <p className="text-sm text-gray-500 mb-4">
//           Please download to view this file
//         </p>
//         <a
//           href={fileUrl}
//           download
//           className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow"
//         >
//           Download File
//         </a>
//       </div>
//     );
//   }

//   // ---------- SHEETS LIMIT ----------
//   if (tooManySheets) {
//     return (
//       <div className="h-full flex flex-col items-center justify-center text-center p-6">
//         <p className="text-lg font-semibold text-gray-800">
//           Excel file has more than {MAX_SHEETS} sheets
//         </p>
//         <p className="text-sm text-gray-500 mb-4">
//           Preview not supported for many sheets
//         </p>
//         <a
//           href={fileUrl}
//           download
//           className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow"
//         >
//           Download File
//         </a>
//       </div>
//     );
//   }

//   // ---------- ROW LIMIT ----------
//   if (tooManyRows) {
//     return (
//       <div className="h-full flex flex-col items-center justify-center text-center p-6">
//         <p className="text-lg font-semibold text-gray-800">
//           Sheet contains more than {MAX_ROWS} rows
//         </p>
//         <p className="text-sm text-gray-500 mb-4">
//           Preview disabled for large sheets
//         </p>
//         <a
//           href={fileUrl}
//           download
//           className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow"
//         >
//           Download File
//         </a>
//       </div>
//     );
//   }

//   // ---------- TABLE ----------
//   return (
//     <div className="w-full h-full overflow-scroll border rounded-lg bg-white shadow">
//       <table className="min-w-full text-xs border-collapse">
//         <tbody>
//           {rows.map((row, i) => (
//             <tr key={i} className="border-b">
//               {row.map((cell, j) => (
//                 <td key={j} className="px-2 py-1 border-r whitespace-nowrap">
//                   {String(cell ?? "")}
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default ExcelPreview;

// ExcelPreview.jsx
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";

const MAX_ROWS = 1000;
const MAX_SHEETS = 10;
const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB safety limit

const formatCellValue = (value, rowIndex, colIndex) => {
  // Handle null/undefined
  if (value === null || value === undefined) {
    return "";
  }

  // Handle Date objects from XLSX (cellDates: true)
  if (value instanceof Date && !isNaN(value)) {
    // console.log(`📅 Date detected at row ${rowIndex}, col ${colIndex}:`, {
    //   rawValue: value,
    //   toString: value.toString(),
    //   toISOString: value.toISOString(),
    //   getDate: value.getDate(),
    //   getUTCDate: value.getUTCDate(),
    //   getMonth: value.getMonth(),
    //   getUTCMonth: value.getUTCMonth(),
    //   getFullYear: value.getFullYear(),
    //   getUTCFullYear: value.getUTCFullYear(),
    //   getTimezoneOffset: value.getTimezoneOffset(),
    // });

    // CRITICAL FIX: XLSX.js creates dates near midnight but not exactly at midnight
    // (e.g., 23:59:50 in local time). When converted to UTC, this can shift to the previous day.
    // Solution: Add 12 hours to ensure we're solidly in the middle of the correct day in UTC
    const adjustedDate = new Date(value.getTime() + 12 * 60 * 60 * 1000);

    // console.log(`   🔧 Adjusted date:`, {
    //   original: value.toISOString(),
    //   adjusted: adjustedDate.toISOString(),
    // });

    // Now extract UTC components from the adjusted date
    const day = adjustedDate.getUTCDate();
    const month = adjustedDate.getUTCMonth(); // 0-indexed

    const dayStr = String(day).padStart(2, "0");
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthStr = monthNames[month];

    const formatted = `${dayStr}-${monthStr}`;
    // console.log(`   ✅ Formatted as: ${formatted}`);

    return formatted;
  }

  // Handle numbers that might be Excel serial dates
  if (typeof value === "number") {
    // Check if it's likely a date (Excel dates are typically 40000-60000)
    if (value > 40000 && value < 60000) {
      // console.log(
      //   `🔢 Number (possible date) at row ${rowIndex}, col ${colIndex}:`,
      //   value,
      // );
      try {
        const parsed = XLSX.SSF.parse_date_code(value);
        // console.log(`   Parsed:`, parsed);
        if (parsed && parsed.d && parsed.m && parsed.y) {
          const day = String(parsed.d).padStart(2, "0");
          const monthNames = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ];
          const month = monthNames[parsed.m - 1];
          const formatted = `${day}-${month}`;
          // console.log(`   ✅ Formatted as: ${formatted}`);
          return formatted;
        }
      } catch (e) {
        console.log(`   ❌ Parse failed:`, e);
        // Not a date, fall through to return as number
      }
    }
    return String(value);
  }

  // Handle booleans
  if (typeof value === "boolean") {
    return value ? "TRUE" : "FALSE";
  }

  // Everything else - convert to string
  return String(value);
};

const ExcelPreview = ({ fileUrl }) => {
  const [rows, setRows] = useState([]);
  const [tooLargeFile, setTooLargeFile] = useState(false);
  const [tooManyRows, setTooManyRows] = useState(false);
  const [tooManySheets, setTooManySheets] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        // console.log("🔍 Starting Excel file load...");
        // console.log("📂 File URL:", fileUrl);

        // ---------- CHECK FILE SIZE FIRST ----------
        const head = await fetch(fileUrl, { method: "HEAD" });
        const size = parseInt(head.headers.get("Content-Length") || "0");
        // console.log("📏 File size:", size, "bytes");

        if (size > MAX_FILE_SIZE) {
          console.log("❌ File too large");
          setTooLargeFile(true);
          return;
        }

        // ---------- FETCH FILE ----------
        // console.log("⬇️ Fetching file...");
        const res = await fetch(fileUrl);
        const buffer = await res.arrayBuffer();
        // console.log("✅ File fetched, buffer size:", buffer.byteLength);

        // ---------- READ WORKBOOK ----------
        // console.log("📖 Reading workbook with cellDates: true...");
        const wb = XLSX.read(buffer, {
          dense: true,
          cellDates: true, // Convert Excel dates to JS Date objects
        });
        // console.log("✅ Workbook loaded");
        // console.log("📊 Sheet names:", wb.SheetNames);

        // ---------- SHEET LIMIT ----------
        if (wb.SheetNames.length > MAX_SHEETS) {
          console.log("❌ Too many sheets");
          setTooManySheets(true);
          return;
        }

        const sheet = wb.Sheets[wb.SheetNames[0]];
        // console.log("📄 Using first sheet:", wb.SheetNames[0]);

        // ---------- ROW COUNT CHECK (FAST) ----------
        if (!sheet["!ref"]) {
          console.log("⚠️ Sheet has no range reference");
          setRows([]);
          return;
        }

        const range = XLSX.utils.decode_range(sheet["!ref"]);
        const rowCount = range.e.r + 1;
        // console.log("📏 Row count:", rowCount);

        if (rowCount > MAX_ROWS) {
          console.log("❌ Too many rows");
          setTooManyRows(true);
          return;
        }

        // ---------- SAFE PARSE ----------
        // console.log("🔄 Converting sheet to JSON array...");
        const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        // console.log("✅ Conversion complete");
        // console.log("📊 Data rows:", data.length);
        // console.log("📊 First 3 rows:", data.slice(0, 3));

        // Log some date cells specifically
        // console.log("\n🔍 Checking date values in column 12 (Final Date):");
        for (let i = 0; i < Math.min(20, data.length); i++) {
          if (data[i] && data[i][12]) {
            // console.log(`Row ${i}:`, typeof data[i][12], data[i][12]);
          }
        }

        setRows(data);
      } catch (err) {
        console.error("❌ Excel preview failed:", err);
      }
    };

    load();
  }, [fileUrl]);

  // ---------- FILE TOO LARGE ----------
  if (tooLargeFile) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-white">
        <p className="text-lg font-semibold text-gray-800">
          Excel file is too large to preview
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Please download to view this file
        </p>
        <a
          href={fileUrl}
          download
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
        >
          Download File
        </a>
      </div>
    );
  }

  // ---------- SHEETS LIMIT ----------
  if (tooManySheets) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-white">
        <p className="text-lg font-semibold text-gray-800">
          Excel file has more than {MAX_SHEETS} sheets
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Preview not supported for many sheets
        </p>
        <a
          href={fileUrl}
          download
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
        >
          Download File
        </a>
      </div>
    );
  }

  // ---------- ROW LIMIT ----------
  if (tooManyRows) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-white">
        <p className="text-lg font-semibold text-gray-800">
          Sheet contains more than {MAX_ROWS} rows
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Preview disabled for large sheets
        </p>
        <a
          href={fileUrl}
          download
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
        >
          Download File
        </a>
      </div>
    );
  }

  // Get max columns
  const maxCols = Math.max(...rows.map((row) => row.length));

  // console.log(
  //   "🎨 Rendering table with",
  //   rows.length,
  //   "rows and",
  //   maxCols,
  //   "columns",
  // );

  // ---------- EXCEL-LIKE TABLE ----------
  return (
    <div className="w-full h-full overflow-auto bg-gray-100">
      <div className="inline-block min-w-full">
        <table className="border-collapse" style={{ borderSpacing: 0 }}>
          <thead className="sticky top-0 z-10">
            <tr>
              {rows[0]?.map((_, colIndex) => (
                <th
                  key={colIndex}
                  className="border border-gray-300 bg-gray-200 font-semibold text-left text-xs px-2 py-1.5"
                  style={{
                    minWidth: "100px",
                    maxWidth: "300px",
                    borderColor: "#d0d0d0",
                    backgroundColor: "#f0f0f0",
                    color: "#333",
                    fontWeight: 600,
                  }}
                >
                  {formatCellValue(rows[0]?.[colIndex], 0, colIndex)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.slice(1).map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-blue-50">
                {Array.from({ length: maxCols }).map((_, colIndex) => (
                  <td
                    key={colIndex}
                    className="border border-gray-300 px-2 py-1 text-xs bg-white"
                    style={{
                      minWidth: "100px",
                      maxWidth: "300px",
                      borderColor: "#d0d0d0",
                      color: "#000",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {formatCellValue(row[colIndex], rowIndex + 1, colIndex)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExcelPreview;

// // ExcelPreview.jsx - Practical version with row limit
// import React, { useEffect, useState } from "react";
// import * as XLSX from "xlsx";

// const ROWS_PER_PAGE = 1000;
// const MAX_PREVIEW_ROWS = 50000; // Limit preview to 50K rows
// const MAX_SHEETS = 50;
// const MAX_FILE_SIZE = 100 * 1024 * 1024;

// const ExcelPreview = ({ fileUrl }) => {
//   const [rows, setRows] = useState([]);
//   const [totalFileRows, setTotalFileRows] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [tooLargeFile, setTooLargeFile] = useState(false);
//   const [tooManySheets, setTooManySheets] = useState(false);
//   const [tooManyRows, setTooManyRows] = useState(false);
//   const [error, setError] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);

//   useEffect(() => {
//     const load = async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         setRows([]);
//         setCurrentPage(1);

//         // ---------- CHECK FILE SIZE ----------
//         const head = await fetch(fileUrl, { method: "HEAD" });
//         const size = parseInt(head.headers.get("Content-Length") || "0");

//         if (size > MAX_FILE_SIZE) {
//           console.log(`❌ File too large: ${(size / 1024 / 1024).toFixed(2)}MB`);
//           setTooLargeFile(true);
//           setLoading(false);
//           return;
//         }

//         // ---------- FETCH FILE ----------
//         console.log("📥 Fetching Excel file...");
//         const res = await fetch(fileUrl);
//         const buffer = await res.arrayBuffer();

//         // ---------- READ WORKBOOK ----------
//         console.log("📊 Reading workbook...");
//         const wb = XLSX.read(buffer, { dense: true });

//         // ---------- SHEET LIMIT ----------
//         if (wb.SheetNames.length > MAX_SHEETS) {
//           setTooManySheets(true);
//           setLoading(false);
//           return;
//         }

//         const sheet = wb.Sheets[wb.SheetNames[0]];

//         if (!sheet["!ref"]) {
//           setRows([]);
//           setLoading(false);
//           return;
//         }

//         // Get total row count
//         const range = XLSX.utils.decode_range(sheet["!ref"]);
//         const totalRows = range.e.r + 1;
//         setTotalFileRows(totalRows);
//         console.log(`📊 Total rows in file: ${totalRows.toLocaleString()}`);

//         // Check if too many rows
//         if (totalRows > MAX_PREVIEW_ROWS) {
//           setTooManyRows(true);
//           setLoading(false);
//           return;
//         }

//         // ---------- LOAD ALL ROWS (with date formatting) ----------
//         const data = XLSX.utils.sheet_to_json(sheet, {
//           header: 1,
//           raw: false, // This formats dates as strings
//           dateNF: 'dd-mm-yyyy' // Date format
//         });

//         console.log(`✅ Loaded ${data.length.toLocaleString()} rows`);
//         setRows(data);
//         setLoading(false);
//       } catch (err) {
//         console.error("Excel preview failed:", err);
//         setError("Failed to load Excel file");
//         setLoading(false);
//       }
//     };

//     load();
//   }, [fileUrl]);

//   // ---------- FILE TOO LARGE ----------
//   if (tooLargeFile) {
//     return (
//       <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-white">
//         <p className="text-lg font-semibold text-gray-800">
//           Excel file is too large to preview
//         </p>
//         <p className="text-sm text-gray-500 mb-4">
//           File exceeds {MAX_FILE_SIZE / 1024 / 1024}MB. Please download to view.
//         </p>
//         <a
//           href={fileUrl}
//           download
//           className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
//         >
//           Download File
//         </a>
//       </div>
//     );
//   }

//   // ---------- TOO MANY ROWS ----------
//   if (tooManyRows) {
//     return (
//       <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-white">
//         <p className="text-lg font-semibold text-gray-800">
//           Excel file has {totalFileRows.toLocaleString()} rows
//         </p>
//         <p className="text-sm text-gray-500 mb-4">
//           Preview is limited to {MAX_PREVIEW_ROWS.toLocaleString()} rows. Please download to view the full file.
//         </p>
//         <a
//           href={fileUrl}
//           download
//           className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
//         >
//           Download File ({totalFileRows.toLocaleString()} rows)
//         </a>
//       </div>
//     );
//   }

//   // ---------- SHEETS LIMIT ----------
//   if (tooManySheets) {
//     return (
//       <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-white">
//         <p className="text-lg font-semibold text-gray-800">
//           Excel file has more than {MAX_SHEETS} sheets
//         </p>
//         <p className="text-sm text-gray-500 mb-4">
//           Preview not supported. Please download to view.
//         </p>
//         <a
//           href={fileUrl}
//           download
//           className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
//         >
//           Download File
//         </a>
//       </div>
//     );
//   }

//   // ---------- ERROR ----------
//   if (error) {
//     return (
//       <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-white">
//         <p className="text-lg font-semibold text-red-600">Error</p>
//         <p className="text-sm text-gray-500 mb-4">{error}</p>
//         <a
//           href={fileUrl}
//           download
//           className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
//         >
//           Download File
//         </a>
//       </div>
//     );
//   }

//   // ---------- LOADING ----------
//   if (loading) {
//     return (
//       <div className="h-full flex items-center justify-center bg-white">
//         <div className="text-center">
//           <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-2" />
//           <div className="text-sm text-gray-500">Loading Excel preview…</div>
//         </div>
//       </div>
//     );
//   }

//   // Get max columns - avoid stack overflow
//   let maxCols = 0;
//   for (const row of rows) {
//     if (row.length > maxCols) {
//       maxCols = row.length;
//     }
//   }

//   const headerRow = rows[0] || [];
//   const totalRows = rows.length;
//   const totalDataRows = totalRows - 1;
//   const totalPages = Math.ceil(totalDataRows / ROWS_PER_PAGE);

//   // Calculate page slice
//   const startIdx = 1 + (currentPage - 1) * ROWS_PER_PAGE;
//   const endIdx = Math.min(startIdx + ROWS_PER_PAGE, totalRows);
//   const pageRows = rows.slice(startIdx, endIdx);

//   const startRowNumber = (currentPage - 1) * ROWS_PER_PAGE + 1;
//   const endRowNumber = startRowNumber + pageRows.length - 1;

//   // ---------- EXCEL-LIKE TABLE WITH PAGINATION ----------
//   return (
//     <div className="w-full h-full flex flex-col bg-gray-100">
//       {/* Pagination Controls - Top */}
//       <div className="flex-shrink-0 px-3 py-2 bg-white border-b border-gray-300 flex items-center justify-between">
//         <div className="text-xs text-gray-600">
//           Showing rows {startRowNumber.toLocaleString()} - {endRowNumber.toLocaleString()} of {totalDataRows.toLocaleString()}
//         </div>
//         <div className="flex items-center gap-2">
//           <button
//             onClick={() => setCurrentPage(1)}
//             disabled={currentPage === 1}
//             className="px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             First
//           </button>
//           <button
//             onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
//             disabled={currentPage === 1}
//             className="px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             ← Prev
//           </button>
//           <span className="text-xs text-gray-600">
//             Page {currentPage} of {totalPages}
//           </span>
//           <button
//             onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
//             disabled={currentPage === totalPages}
//             className="px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             Next →
//           </button>
//           <button
//             onClick={() => setCurrentPage(totalPages)}
//             disabled={currentPage === totalPages}
//             className="px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             Last
//           </button>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="flex-1 overflow-auto">
//         <table className="border-collapse w-full" style={{ borderSpacing: 0 }}>
//           <thead className="sticky top-0 z-10">
//             <tr>
//               {headerRow.map((cell, colIndex) => (
//                 <th
//                   key={colIndex}
//                   className="border border-gray-300 bg-gray-200 font-semibold text-left text-xs px-2 py-1.5"
//                   style={{
//                     minWidth: "100px",
//                     maxWidth: "300px",
//                     borderColor: "#d0d0d0",
//                     backgroundColor: "#f0f0f0",
//                     color: "#333",
//                     fontWeight: 600,
//                   }}
//                 >
//                   {cell ?? ""}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {pageRows.map((row, rowIndex) => (
//               <tr key={rowIndex} className="hover:bg-blue-50">
//                 {Array.from({ length: maxCols }).map((_, colIndex) => (
//                   <td
//                     key={colIndex}
//                     className="border border-gray-300 px-2 py-1 text-xs bg-white"
//                     style={{
//                       minWidth: "100px",
//                       maxWidth: "300px",
//                       borderColor: "#d0d0d0",
//                       color: "#000",
//                       whiteSpace: "nowrap",
//                       overflow: "hidden",
//                       textOverflow: "ellipsis",
//                     }}
//                   >
//                     {row[colIndex] !== undefined && row[colIndex] !== null
//                       ? String(row[colIndex])
//                       : ""}
//                   </td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination Controls - Bottom */}
//       <div className="flex-shrink-0 px-3 py-2 bg-white border-t border-gray-300 flex items-center justify-between">
//         <div className="text-xs text-gray-600">
//           Total: {totalDataRows.toLocaleString()} rows
//         </div>
//         <div className="flex items-center gap-2">
//           <button
//             onClick={() => setCurrentPage(1)}
//             disabled={currentPage === 1}
//             className="px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             First
//           </button>
//           <button
//             onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
//             disabled={currentPage === 1}
//             className="px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             ← Prev
//           </button>
//           <span className="text-xs text-gray-600">
//             Page {currentPage} of {totalPages}
//           </span>
//           <button
//             onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
//             disabled={currentPage === totalPages}
//             className="px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             Next →
//           </button>
//           <button
//             onClick={() => setCurrentPage(totalPages)}
//             disabled={currentPage === totalPages}
//             className="px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             Last
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ExcelPreview;
