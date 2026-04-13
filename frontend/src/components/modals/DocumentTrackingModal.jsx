// src/components/modals/DocumentTrackingModal.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useDocumentsApi } from "../../api/documentsApi";
import TrackingTimeline from "./TrackingTimeline";

/**
 * DocumentTrackingModal
 *
 * Props:
 *  - document: document object (required)
 *  - version: optional version object — when provided the modal shows single-version tracking
 *  - open: boolean
 *  - onClose: fn
 *
 * Behaviour notes:
 *  - Loads timeline via getDocumentVersions(document.id)
 *  - If `version` prop is provided, timeline is filtered client-side to that version_number
 *  - Customers only see 'version' items (approval items are filtered out)
 *  - Sorted ascending (oldest → newest) for stepper/progress flow
 *  - The TrackingTimeline receives `version` so it can render a compact progress bar + vertical log
 */
const DocumentTrackingModal = ({ document, version = null, open, onClose }) => {
  const { getDocumentVersions } = useDocumentsApi();

  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isCustomer = ["customer", "collaborator"].includes(user?.role);

  const loadTimeline = useCallback(async () => {
    if (!document?.id) return;

    setLoading(true);
    setError(null);

    try {
      const res = await getDocumentVersions(document.id);
      let rows = Array.isArray(res?.data) ? res.data.slice() : [];

      // If a specific version was requested -> filter to only that version
      if (version && (version.version_number || version.version_number === 0)) {
        rows = rows.filter(
          (r) => Number(r.version_number) === Number(version.version_number),
        );
      }

      // Security: customers only see 'version' items
      if (isCustomer) {
        rows = rows.filter((r) => r.item_type === "version");
      }

      // Sort chronologically (old -> new) for stepper feel
      rows.sort(
        (a, b) =>
          new Date(a.event_time).getTime() - new Date(b.event_time).getTime(),
      );

      setTimeline(rows);
    } catch (err) {
      console.error("Timeline load failed", err);
      setError("Failed to load tracking history.");
      setTimeline([]);
    } finally {
      setLoading(false);
    }
  }, [
    document?.id,
    getDocumentVersions,
    isCustomer,
    version?.version_number, // primitive only
  ]);

  // Load when modal opens or document/version changes
  useEffect(() => {
    if (!open) return;
    loadTimeline();
  }, [open, document?.id, version?.version_number]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="document-tracking-title"
    >
      <div className="w-full max-w-4xl bg-gradient-to-br from-white to-indigo-50/40 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <h2
              id="document-tracking-title"
              className="text-white font-bold text-lg truncate"
            >
              Tracking – {document?.title}
            </h2>

            {version && (
              <span className="ml-2 inline-block px-3 py-1 text-xs bg-indigo-500/20 text-white border border-indigo-300/30 rounded shrink-0">
                Version {version.version_number}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadTimeline}
              disabled={loading}
              className={`text-white text-sm px-3 py-1 rounded transition ${
                loading
                  ? "bg-white/20 cursor-wait"
                  : "bg-white/10 hover:bg-indigo-400/20"
              }`}
              title="Reload tracking"
            >
              {loading ? "Refreshing…" : "Reload"}
            </button>

            <button
              onClick={onClose}
              className="text-white font-bold text-xl w-9 h-9 flex items-center justify-center rounded hover:bg-gradient-to-br from-white to-indigo-50/40/10 transition"
              aria-label="Close tracking modal"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 max-h-[72vh] overflow-y-auto overscroll-contain">
          {loading ? (
            <div className="space-y-4 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-indigo-50 rounded-xl" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-red-600 font-semibold mb-2">{error}</div>

              <button
                onClick={loadTimeline}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
              >
                Retry
              </button>
            </div>
          ) : (
            <TrackingTimeline
              key={`${document?.id}-${version ? version.version_number : "all"}`}
              document={document}
              timeline={timeline}
              version={version}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentTrackingModal;
