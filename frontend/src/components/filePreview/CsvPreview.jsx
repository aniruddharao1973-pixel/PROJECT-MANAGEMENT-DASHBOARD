// // CsvPreview.jsx
// import React, { useEffect, useState } from "react";
// import Papa from "papaparse";

// const CsvPreview = ({ fileUrl }) => {
//   const [rows, setRows] = useState([]);

//   useEffect(() => {
//     Papa.parse(fileUrl, {
//       download: true,
//       skipEmptyLines: true,
//       complete: (result) => {
//         setRows(result.data.slice(0, 300)); // safety limit
//       },
//     });
//   }, [fileUrl]);

//   return (
//     <div className="overflow-auto border rounded-lg bg-white shadow">
//       <table className="min-w-full text-xs border-collapse">
//         <tbody>
//           {rows.map((row, i) => (
//             <tr key={i} className="border-b">
//               {row.map((cell, j) => (
//                 <td key={j} className="px-2 py-1 border-r whitespace-nowrap">
//                   {cell}
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default CsvPreview;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// src/components/filepreview/CsvPreview.jsx
// import React, { useEffect, useState } from "react";
// import Papa from "papaparse";

// const MAX_ROWS = 500; // <- adjusted per your request

// const CsvPreview = ({ fileUrl }) => {
//   const [rows, setRows] = useState([]);
//   const [tooMany, setTooMany] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (!fileUrl) return;

//     let collected = [];
//     let exceeded = false; // local flag (not React state)
//     let stopped = false; // unmount flag

//     setLoading(true);
//     setError(null);
//     setRows([]);
//     setTooMany(false);

//     try {
//       Papa.parse(fileUrl, {
//         download: true,
//         skipEmptyLines: true,

//         step: (result, parser) => {
//           if (stopped) {
//             // component unmounted — stop parser if possible
//             try {
//               parser.abort();
//             } catch (e) {}
//             return;
//           }

//           // `result.data` is an array for the row's fields
//           collected.push(result.data);

//           if (collected.length >= MAX_ROWS) {
//             exceeded = true;
//             // stop parsing immediately
//             try {
//               parser.abort();
//             } catch (e) {
//               /* ignore abort errors */
//             }
//           }
//         },

//         complete: () => {
//           if (stopped) return;

//           if (exceeded) {
//             setTooMany(true);
//             setRows([]); // ensure rows are empty when blocked
//           } else {
//             setRows(collected);
//           }
//           setLoading(false);
//         },

//         error: (err) => {
//           if (stopped) return;
//           console.error("CSV parse error:", err);
//           setError("Failed to parse CSV");
//           setLoading(false);
//         },
//       });
//     } catch (err) {
//       console.error("Papa.parse threw:", err);
//       setError("Failed to parse CSV");
//       setLoading(false);
//     }

//     return () => {
//       // mark stopped so callbacks do nothing after unmount
//       stopped = true;
//     };
//   }, [fileUrl]);

//   // ---- UI: blocked for too many rows ----
//   if (tooMany) {
//     return (
//       <div className="h-full flex flex-col items-center justify-center text-center p-6">
//         <p className="text-lg font-semibold text-gray-800">
//           CSV file has more than {MAX_ROWS} rows
//         </p>
//         <p className="text-sm text-gray-500 mb-4">
//           Preview disabled for large files — please download to view the full
//           file
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

//   // ---- UI: error ----
//   if (error) {
//     return (
//       <div className="h-full flex flex-col items-center justify-center text-center p-6">
//         <p className="text-lg font-semibold text-red-600">Error</p>
//         <p className="text-sm text-gray-500 mb-4">{error}</p>
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

//   // ---- UI: loading ----
//   if (loading) {
//     return (
//       <div className="h-full flex items-center justify-center">
//         <div className="text-center">
//           <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin mb-2" />
//           <div className="text-sm text-gray-500">Loading preview…</div>
//         </div>
//       </div>
//     );
//   }

//   // ---- TABLE (vertical scroll inside, horizontal scroll across outer) ----
//   return (
//     <div className="w-full h-full min-w-0 overflow-x-auto overflow-y-hidden border rounded-lg bg-white shadow">
//       {/* vertical scroll area inside; min-w-max allows table to grow horizontally */}
//       <div className="h-full overflow-y-auto min-w-max p-2">
//         {/* optional row counter */}
//         <div className="text-xs text-gray-500 mb-2">
//           Showing {rows.length} row{rows.length !== 1 ? "s" : ""}
//         </div>

//         <table className="text-xs border-collapse">
//           <tbody>
//             {rows.map((row, i) => (
//               <tr key={i} className="border-b">
//                 {row.map((cell, j) => (
//                   <td
//                     key={j}
//                     className="px-2 py-1 border-r whitespace-nowrap align-top"
//                   >
//                     {String(cell ?? "")}
//                   </td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default CsvPreview;

// // Updated CsvPreview.jsx with better UI and performance optimizations
// import React, { useEffect, useState } from "react";
// import Papa from "papaparse";

// const MAX_ROWS = 500; // <- adjusted per your request

// const CsvPreview = ({ fileUrl }) => {
//   const [rows, setRows] = useState([]);
//   const [tooMany, setTooMany] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (!fileUrl) return;

//     let collected = [];
//     let exceeded = false; // local flag (not React state)
//     let stopped = false; // unmount flag

//     setLoading(true);
//     setError(null);
//     setRows([]);
//     setTooMany(false);

//     try {
//       Papa.parse(fileUrl, {
//         download: true,
//         skipEmptyLines: true,

//         step: (result, parser) => {
//           if (stopped) {
//             // component unmounted — stop parser if possible
//             try {
//               parser.abort();
//             } catch (e) {}
//             return;
//           }

//           // `result.data` is an array for the row's fields
//           collected.push(result.data);

//           if (collected.length >= MAX_ROWS) {
//             exceeded = true;
//             // stop parsing immediately
//             try {
//               parser.abort();
//             } catch (e) {
//               /* ignore abort errors */
//             }
//           }
//         },

//         complete: () => {
//           if (stopped) return;

//           if (exceeded) {
//             setTooMany(true);
//             setRows([]); // ensure rows are empty when blocked
//           } else {
//             setRows(collected);
//           }
//           setLoading(false);
//         },

//         error: (err) => {
//           if (stopped) return;
//           console.error("CSV parse error:", err);
//           setError("Failed to parse CSV");
//           setLoading(false);
//         },
//       });
//     } catch (err) {
//       console.error("Papa.parse threw:", err);
//       setError("Failed to parse CSV");
//       setLoading(false);
//     }

//     return () => {
//       // mark stopped so callbacks do nothing after unmount
//       stopped = true;
//     };
//   }, [fileUrl]);

//   // ---- UI: blocked for too many rows ----
//   if (tooMany) {
//     return (
//       <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-white">
//         <p className="text-lg font-semibold text-gray-800">
//           CSV file has more than {MAX_ROWS} rows
//         </p>
//         <p className="text-sm text-gray-500 mb-4">
//           Preview disabled for large files — please download to view the full
//           file
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

//   // ---- UI: error ----
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

//   // ---- UI: loading ----
//   if (loading) {
//     return (
//       <div className="h-full flex items-center justify-center bg-white">
//         <div className="text-center">
//           <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-2" />
//           <div className="text-sm text-gray-500">Loading preview…</div>
//         </div>
//       </div>
//     );
//   }

//   // Get max columns
//   const maxCols = Math.max(...rows.map((row) => row.length));

//   // ---- EXCEL-LIKE TABLE ----
//   return (
//     <div className="w-full h-full overflow-auto bg-gray-100">
//       <div className="inline-block min-w-full">
//         <table className="border-collapse" style={{ borderSpacing: 0 }}>
//           <thead className="sticky top-0 z-10">
//             <tr>
//               {rows[0]?.map((_, colIndex) => (
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
//                   {rows[0]?.[colIndex] ?? ""}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {rows.slice(1).map((row, rowIndex) => (
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
//     </div>
//   );
// };

// export default CsvPreview;

// CsvPreview.jsx
import React, { useEffect, useState } from "react";
import Papa from "papaparse";

const MAX_DISPLAY_ROWS = 1000; // Display limit for performance

// Format cell value - handles dates, numbers, booleans, and text
const formatCellValue = (value) => {
  // Handle null/undefined/empty
  if (value === null || value === undefined || value === "") {
    return "";
  }

  // CSV values come as strings, so we need to detect dates
  const str = String(value).trim();

  // Try to detect if it's a date string
  // Common date patterns: YYYY-MM-DD, MM/DD/YYYY, DD-MM-YYYY, etc.
  const datePatterns = [
    /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
    /^\d{2}\/\d{2}\/\d{4}$/, // MM/DD/YYYY
    /^\d{2}-\d{2}-\d{4}$/, // DD-MM-YYYY
    /^\d{4}\/\d{2}\/\d{2}$/, // YYYY/MM/DD
  ];

  const isDateLike = datePatterns.some((pattern) => pattern.test(str));

  if (isDateLike) {
    try {
      const date = new Date(str);

      // Check if valid date
      if (!isNaN(date.getTime())) {
        // Format as DD-Mon (same as Excel)
        const day = String(date.getDate()).padStart(2, "0");
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
        const month = monthNames[date.getMonth()];

        return `${day}-${month}`;
      }
    } catch (e) {
      // Not a valid date, return as-is
    }
  }

  // For Excel serial date numbers (if CSV contains numeric date values)
  const numValue = Number(str);
  if (!isNaN(numValue) && numValue > 40000 && numValue < 60000) {
    try {
      // Excel epoch: Jan 1, 1900 is day 1 (with 1900 leap year bug adjustment)
      const excelEpoch = new Date(1900, 0, 1);
      const daysOffset = numValue - 2; // -2 accounts for Excel's 1900 leap year bug
      const date = new Date(
        excelEpoch.getTime() + daysOffset * 24 * 60 * 60 * 1000,
      );

      if (!isNaN(date.getTime())) {
        const day = String(date.getDate()).padStart(2, "0");
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
        const month = monthNames[date.getMonth()];

        return `${day}-${month}`;
      }
    } catch (e) {
      // Not a date, return as-is
    }
  }

  // Return as string
  return str;
};

const CsvPreview = ({ fileUrl }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalRows, setTotalRows] = useState(0);

  useEffect(() => {
    if (!fileUrl) return;

    let collected = [];
    let stopped = false;

    setLoading(true);
    setError(null);
    setRows([]);

    try {
      Papa.parse(fileUrl, {
        download: true,
        skipEmptyLines: true,

        step: (result, parser) => {
          if (stopped) {
            try {
              parser.abort();
            } catch (e) {}
            return;
          }

          collected.push(result.data);

          // For display, only keep first MAX_DISPLAY_ROWS
          if (collected.length > MAX_DISPLAY_ROWS) {
            try {
              parser.abort();
            } catch (e) {}
          }
        },

        complete: () => {
          if (stopped) return;
          setTotalRows(collected.length);
          setRows(collected);
          setLoading(false);
        },

        error: (err) => {
          if (stopped) return;
          console.error("CSV parse error:", err);
          setError("Failed to parse CSV");
          setLoading(false);
        },
      });
    } catch (err) {
      console.error("Papa.parse threw:", err);
      setError("Failed to parse CSV");
      setLoading(false);
    }

    return () => {
      stopped = true;
    };
  }, [fileUrl]);

  // ---- UI: error ----
  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-white">
        <p className="text-lg font-semibold text-red-600">Error</p>
        <p className="text-sm text-gray-500 mb-4">{error}</p>
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

  // ---- UI: loading ----
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-2" />
          <div className="text-sm text-gray-500">Loading preview…</div>
        </div>
      </div>
    );
  }

  // Get max columns
  const maxCols = Math.max(...rows.map((row) => row.length), 0);
  const headerRow = rows[0] || [];
  const dataRows = rows.slice(1);

  // ---- EXCEL-LIKE TABLE ----
  return (
    <div className="w-full h-full overflow-auto bg-gray-100">
      <div className="inline-block min-w-full">
        <table className="border-collapse" style={{ borderSpacing: 0 }}>
          <thead className="sticky top-0 z-10">
            <tr>
              {headerRow.map((cell, colIndex) => (
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
                  {formatCellValue(cell)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataRows.map((row, rowIndex) => (
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
                    {formatCellValue(row[colIndex])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Row count at bottom */}
      {totalRows > MAX_DISPLAY_ROWS && (
        <div className="sticky bottom-0 px-3 py-2 bg-yellow-100 border-t border-yellow-300">
          <div className="text-xs text-yellow-800">
            ⚠️ Showing first {MAX_DISPLAY_ROWS.toLocaleString()} of{" "}
            {totalRows.toLocaleString()} rows
          </div>
        </div>
      )}
      {totalRows <= MAX_DISPLAY_ROWS && (
        <div className="sticky bottom-0 px-3 py-2 bg-white border-t border-gray-300">
          <div className="text-xs text-gray-600">
            Total: {totalRows.toLocaleString()} rows
          </div>
        </div>
      )}
    </div>
  );
};

export default CsvPreview;

// // CsvPreview.jsx - Paginated version for unlimited rows
// import React, { useEffect, useState } from "react";
// import Papa from "papaparse";

// const ROWS_PER_PAGE = 1000;

// const CsvPreview = ({ fileUrl }) => {
//   const [rows, setRows] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);

//   useEffect(() => {
//     if (!fileUrl) return;

//     let collected = [];
//     let stopped = false;
//     let rowCount = 0;

//     setLoading(true);
//     setError(null);
//     setRows([]);
//     setCurrentPage(1);

//     try {
//       Papa.parse(fileUrl, {
//         download: true,
//         skipEmptyLines: true,
//         chunkSize: undefined,

//         step: (result, parser) => {
//           if (stopped) {
//             try {
//               parser.abort();
//             } catch (e) {}
//             return;
//           }

//           collected.push(result.data);
//           rowCount++;

//           // Log progress every 10k rows
//           if (rowCount % 10000 === 0) {
//             console.log(`📊 Loaded ${rowCount} rows...`);
//           }
//         },

//         complete: () => {
//           if (stopped) return;
//           console.log(`✅ Total rows loaded: ${collected.length}`);
//           setRows(collected);
//           setLoading(false);
//         },

//         error: (err) => {
//           if (stopped) return;
//           console.error("CSV parse error:", err);
//           setError("Failed to parse CSV");
//           setLoading(false);
//         },
//       });
//     } catch (err) {
//       console.error("Papa.parse threw:", err);
//       setError("Failed to parse CSV");
//       setLoading(false);
//     }

//     return () => {
//       stopped = true;
//     };
//   }, [fileUrl]);

//   // ---- UI: error ----
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

//   // ---- UI: loading ----
//   if (loading) {
//     return (
//       <div className="h-full flex items-center justify-center bg-white">
//         <div className="text-center">
//           <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-2" />
//           <div className="text-sm text-gray-500">Loading CSV preview…</div>
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
//   const totalDataRows = totalRows - 1; // Exclude header
//   const totalPages = Math.ceil(totalDataRows / ROWS_PER_PAGE);

//   // Calculate page slice
//   const startIdx = 1 + (currentPage - 1) * ROWS_PER_PAGE; // Skip header row (index 0)
//   const endIdx = Math.min(startIdx + ROWS_PER_PAGE, totalRows);
//   const pageRows = rows.slice(startIdx, endIdx);

//   const startRowNumber = (currentPage - 1) * ROWS_PER_PAGE + 1;
//   const endRowNumber = startRowNumber + pageRows.length - 1;

//   // ---- EXCEL-LIKE TABLE WITH PAGINATION ----
//   return (
//     <div className="w-full h-full flex flex-col bg-gray-100">
//       {/* Pagination Controls - Top */}
//       <div className="flex-shrink-0 px-3 py-2 bg-white border-b border-gray-300 flex items-center justify-between">
//         <div className="text-xs text-gray-600">
//           Showing rows {startRowNumber.toLocaleString()} -{" "}
//           {endRowNumber.toLocaleString()} of {totalDataRows.toLocaleString()}
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
//             onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//             disabled={currentPage === 1}
//             className="px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             ← Prev
//           </button>
//           <span className="text-xs text-gray-600">
//             Page {currentPage} of {totalPages}
//           </span>
//           <button
//             onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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
//             onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//             disabled={currentPage === 1}
//             className="px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             ← Prev
//           </button>
//           <span className="text-xs text-gray-600">
//             Page {currentPage} of {totalPages}
//           </span>
//           <button
//             onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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

// export default CsvPreview;
