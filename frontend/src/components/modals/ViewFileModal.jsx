// src/components/modals/ViewFileModal.jsx
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import ViewFilePreview from "./viewfile/ViewFilePreview";
import ViewCommentsPanel from "./viewfile/ViewCommentsPanel";
import { useDocumentsApi } from "../../api/documentsApi";
import DrawSignatureCanvas from "../signature/DrawSignatureCanvas";
import SignatureAccessModal from "./SignatureAccessModal";

const API_BASE =
  import.meta.env.VITE_API_URL ||
  `${window.location.protocol}//${window.location.hostname}:5000`;

const ViewFileModal = ({ file, projectId, folderId, onClose }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const { signDocument, getDocumentVersions, getSignatureAccess } =
    useDocumentsApi();
  const isDesktop = window.matchMedia("(min-width: 768px)").matches;

  /* ========================= STATE ========================= */
  const [toasts, setToasts] = useState([]);
  const [showSignature, setShowSignature] = useState(false);
  const [signatureData, setSignatureData] = useState(null);
  const [signing, setSigning] = useState(false);
  const [latestSignedInfo, setLatestSignedInfo] = useState(null);
  const [previewFile, setPreviewFile] = useState(file);

  useEffect(() => {
    setPreviewFile(file);
  }, [file?.id]);
  const [showSignatureAccess, setShowSignatureAccess] = useState(false);
  const [signedUsers, setSignedUsers] = useState([]);

  /* ========================= ROLE CHECK ========================= */
  const canAttemptSign =
    user?.role === "admin" ||
    user?.role === "techsales" ||
    (user?.role === "customer" && previewFile?.allow_customer_sign === true) ||
    (user?.role === "department" &&
      previewFile?.allow_department_sign === true);

  const showSignDisabledTooltip =
    (user?.role === "customer" || user?.role === "department") &&
    !canAttemptSign;

  const hasUserAlreadySigned = signedUsers.some((s) => s.userId === user.id);
  const canSign = canAttemptSign && !hasUserAlreadySigned;

  /* ========================= TOAST ========================= */
  const pushToast = (text, type = "info", ttl = 4000) => {
    const id = Date.now();
    setToasts((t) => [...t, { id, text, type }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, ttl);
  };

  /* ========================= PDF SIGN HANDLER ========================= */
  const handlePdfSignRequest = async ({ signatures }) => {
    try {
      if (!Array.isArray(signatures) || signatures.length === 0) {
        pushToast("No signatures to save", "error");
        return;
      }

      setSigning(true);

      const safePayload = signatures.map((s) => ({
        id: s.id,
        page: s.page,
        x: s.x,
        y: s.y,
        width: s.width,
        height: s.height,
        pdfRenderWidth: s.pdfRenderWidth,
        pdfRenderHeight: s.pdfRenderHeight,
        signatureData: s.signatureData,
      }));

      await signDocument(file.id, {
        signatures: safePayload,
      });

      pushToast(
        `Document signed with ${safePayload.length} signature(s). New version created.`,
        "success",
      );

      const res = await getDocumentVersions(file.id);
      const versions = res.data || [];

      const signedVersions = versions.filter((v) => v.is_signed && v.signed_by);

      if (signedVersions.length > 0) {
        const latest = signedVersions.reduce((a, b) =>
          b.version_number > a.version_number ? b : a,
        );

        setLatestSignedInfo({
          signedBy: latest.signed_by_name || "Unknown user",
          signedAt: latest.signed_at,
          signatureType: latest.signature_type,
        });

        setPreviewFile((prev) => ({
          ...prev,
          file_path: latest.file_path,
        }));

        setTimeout(() => {
          const firstPage = document.querySelector('[data-page-number="1"]');
          firstPage?.scrollIntoView({ behavior: "smooth" });
        }, 300);
      }
    } catch (err) {
      const status = err?.response?.status;
      const message = err?.response?.data?.message;

      console.error("Signing error details:", err);

      if (status === 400) {
        pushToast(message || "Invalid signature data", "error");
        return;
      }

      if (status === 409) {
        pushToast("Document was modified by another user", "error");
        return;
      }

      if (status === 500) {
        pushToast(
          "Server error while signing document. Please try again.",
          "error",
        );
        return;
      }

      pushToast(message || "Failed to sign document", "error");
    } finally {
      setSigning(false);
    }
  };

  /* ========================= LOCK BACKGROUND SCROLL ========================= */
  useEffect(() => {
    // ⚠️ Do NOT lock scroll when previewing video (mobile/iOS requirement)
    const isVideo =
      previewFile?.filename &&
      /\.(mp4|webm|ogg|mov)$/i.test(previewFile.filename);

    if (isVideo) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prev;
    };
  }, [previewFile]);

  /* ========================= LOAD VERSIONS ========================= */
  useEffect(() => {
    if (!previewFile?.id) return;

    const loadVersions = async () => {
      try {
        const res = await getDocumentVersions(previewFile.id);
        const versions = res.data || [];

        const signedVersions = versions.filter(
          (v) => v.is_signed && v.signed_by,
        );

        const signers = signedVersions.map((v) => ({
          userId: v.signed_by,
          name: v.signed_by_name,
          at: v.signed_at,
          version: v.version_number,
        }));

        setSignedUsers(signers);

        if (signedVersions.length > 0) {
          const latest = signedVersions.reduce((a, b) =>
            b.version_number > a.version_number ? b : a,
          );

          setLatestSignedInfo({
            signedBy: latest.signed_by_name,
            signedAt: latest.signed_at,
            signatureType: latest.signature_type,
          });
        } else {
          setLatestSignedInfo(null);
        }
      } catch (err) {
        console.error("Failed to load document versions", err);
      }
    };

    loadVersions();
  }, [previewFile.id]);

  /* ========================= SIGNATURE ACCESS POLLING ========================= */
  useEffect(() => {
    if (!previewFile?.id) return;

    if (user.role === "admin" || user.role === "techsales") return;

    let isActive = true;
    let intervalId = null;

    const pollSignatureAccess = async () => {
      try {
        const res = await getSignatureAccess(previewFile.id);
        const data = res.data;

        if (!isActive) return;

        setPreviewFile((prev) => {
          if (!prev) return prev;

          if (
            prev.allow_customer_sign === data.allowCustomerSign &&
            prev.allow_department_sign === data.allowDepartmentSign
          ) {
            return prev;
          }

          return {
            ...prev,
            allow_customer_sign: data.allowCustomerSign,
            allow_department_sign: data.allowDepartmentSign,
          };
        });
      } catch (err) {
        console.warn("Signature access polling failed", err?.message);
      }
    };

    pollSignatureAccess();

    intervalId = setInterval(pollSignatureAccess, 2000);

    return () => {
      isActive = false;
      if (intervalId) clearInterval(intervalId);
    };
  }, [previewFile?.id, user.role]);

  return createPortal(
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900/50 via-blue-900/30 to-indigo-900/40 backdrop-blur-md z-[9999] animate-in fade-in duration-300">
      {/* ===== MODERN TOAST NOTIFICATIONS ===== */}
      <div className="fixed right-3 sm:right-4 md:right-6 top-3 sm:top-4 md:top-6 space-y-2 z-[10000]">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`
              group px-4 py-3 sm:px-5 sm:py-3.5 rounded-2xl shadow-2xl
              text-white text-xs sm:text-sm font-medium
              backdrop-blur-xl border
              animate-in slide-in-from-right duration-300
              hover:scale-105 transition-all
              ${
                t.type === "error"
                  ? "bg-gradient-to-r from-red-500 to-pink-600 border-red-400/50 shadow-red-500/30"
                  : t.type === "success"
                    ? "bg-gradient-to-r from-emerald-500 to-green-600 border-emerald-400/50 shadow-emerald-500/30"
                    : "bg-gradient-to-r from-slate-700 to-slate-800 border-slate-600/50 shadow-slate-500/30"
              }
            `}
          >
            <div className="flex items-center gap-2">
              {t.type === "error" && (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {t.type === "success" && (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {t.type === "info" && (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              <span>{t.text}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ===== MAIN MODAL CONTAINER ===== */}
      <div className="absolute inset-0 flex items-center justify-center p-0 sm:p-3 md:p-6">
        <div className="relative bg-white/95 backdrop-blur-2xl w-full h-full sm:w-[98vw] sm:h-[98vh] md:w-[95vw] md:h-[95vh] lg:w-[90vw] lg:h-[92vh] xl:w-[85vw] xl:h-[90vh] rounded-none sm:rounded-2xl md:rounded-3xl shadow-2xl border border-white/20 flex flex-col md:flex-row overflow-hidden min-w-0 animate-in zoom-in-95 duration-300">
          {/* ===== LEFT PANEL - FILE PREVIEW ===== */}
          <div className="flex-1 min-h-0 min-w-0 order-2 md:order-1 h-[55vh] md:h-full">
            <ViewFilePreview
              file={previewFile}
              projectId={projectId}
              folderId={folderId}
              API_BASE={API_BASE}
              pushToast={pushToast}
              user={user}
              onSignInsidePdf={handlePdfSignRequest}
            />
          </div>

          {/* ===== RIGHT PANEL - SIDEBAR ===== */}
          <div className="w-full md:w-80 lg:w-96 shrink-0 min-w-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 border-t md:border-t-0 md:border-l border-slate-200/50 flex flex-col h-auto md:h-full order-1 md:order-2 backdrop-blur-xl">
            {/* ===== SIGNATURE ACCESS BUTTON (ADMIN / TECHSALES) ===== */}
            {(user.role === "admin" || user.role === "techsales") && (
              <div className="border-b border-slate-200/50 p-4 bg-white/50 backdrop-blur-sm">
                <button
                  onClick={(e) => {
                    console.log("🔐 Signature Access onClick (desktop)", e);
                    setShowSignatureAccess(true);
                  }}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log(
                      "🔐 Signature Access via onTouchEnd (mobile)",
                      e,
                    );
                    setShowSignatureAccess(true);
                  }}
                  onTouchStart={(e) => {
                    console.log("👆 Signature Access onTouchStart", e);
                  }}
                  className="group w-full py-3 text-sm font-semibold rounded-xl
                    bg-gradient-to-r from-blue-500 to-indigo-600 text-white
                    hover:from-blue-600 hover:to-indigo-700
                    shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30
                    transition-all duration-300 hover:scale-[1.02]
                    active:bg-indigo-100"
                  style={{
                    WebkitTapHighlightColor: "transparent",
                    touchAction: "manipulation",
                  }}
                >
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    Signature Access
                  </span>
                </button>
              </div>
            )}

            {/* ===== SIGNING DISABLED NOTICE (CUSTOMER / DEPARTMENT) ===== */}
            {showSignDisabledTooltip && (
              <div className="mx-4 mt-4">
                <div className="group relative flex items-start gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/50 text-amber-900 text-xs font-medium shadow-sm">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                    <svg
                      className="w-5 h-5 text-amber-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>

                  <div className="flex-1">
                    <p className="font-semibold mb-1">Signing Disabled</p>
                    <p className="text-[11px] text-amber-700 leading-relaxed">
                      This document is view-only. Contact your administrator if
                      signing is required.
                    </p>
                  </div>

                  {/* Hover Tooltip */}
                  <div className="absolute right-0 top-full mt-2 w-64 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                    <div className="bg-slate-900 text-white text-xs rounded-xl px-4 py-3 shadow-2xl backdrop-blur-xl">
                      An administrator must enable signing permissions for your
                      role before you can sign this document.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ===== MOBILE COMMENTS NOTICE ===== */}
            {!isDesktop && (
              <div className="md:hidden p-4 text-xs font-medium text-slate-600 text-center border-b border-slate-200/50 bg-white/30 backdrop-blur-sm">
                <div className="flex items-center justify-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Comments available on desktop
                </div>
              </div>
            )}

            {/* ===== COMMENTS PANEL (DESKTOP ONLY) ===== */}
            {isDesktop && (
              <ViewCommentsPanel
                file={previewFile}
                user={user}
                pushToast={pushToast}
              />
            )}

            {/* ===== SIGNATURE SECTION ===== */}
            {canAttemptSign && (
              <div className="border-t border-slate-200/50 p-4 bg-white/50 backdrop-blur-sm">
                {latestSignedInfo && (
                  <div className="mb-4 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200/50 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                        <svg
                          className="w-5 h-5 text-emerald-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-emerald-900 mb-1">
                          Signed Document
                        </div>
                        <div className="text-xs text-slate-700 mb-1">
                          Signed by{" "}
                          <span className="font-semibold text-emerald-700">
                            {latestSignedInfo.signedBy}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {new Date(latestSignedInfo.signedAt).toLocaleString()}
                        </div>
                        {signedUsers.length > 0 && (
                          <div className="text-[11px] text-emerald-600 mt-2 font-medium">
                            {signedUsers.length} signature(s) on document
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {canSign && showSignature && (
                  <div className="space-y-3">
                    <div className="p-4 rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-lg">
                      <DrawSignatureCanvas
                        onSave={(data) => {
                          setSignatureData(data);
                          pushToast("Signature captured", "success");
                        }}
                        onCancel={() => {
                          setShowSignature(false);
                          setSignatureData(null);
                        }}
                      />
                    </div>

                    <button
                      disabled={signing}
                      onClick={() => {
                        pushToast(
                          "Use 'Save All Signatures' inside the PDF preview to sign at specific locations.",
                          "info",
                        );
                      }}
                      className="w-full py-3 text-sm font-semibold rounded-xl
                        bg-gradient-to-r from-slate-600 to-slate-700 text-white
                        hover:from-slate-700 hover:to-slate-800
                        shadow-lg shadow-slate-500/20 hover:shadow-xl hover:shadow-slate-500/30
                        transition-all duration-300 hover:scale-[1.02]
                        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {signing ? "Signing..." : "Use Save All in Preview"}
                    </button>

                    <button
                      onClick={() => setShowSignature(false)}
                      className="w-full py-2 text-xs text-slate-600 hover:text-slate-900 font-medium hover:underline transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ===== CLOSE BUTTON (FLOATING) ===== */}
            <button
              onClick={(e) => {
                console.log("❌ CLOSE onClick FIRED (desktop)", e);
                onClose();
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log("✅ CLOSE via onTouchEnd (mobile)", e);
                onClose();
              }}
              onTouchStart={(e) => {
                console.log("👆 CLOSE onTouchStart FIRED", e);
              }}
              aria-label="Close modal"
              className="fixed top-4 right-4 md:absolute md:top-5 md:right-5 z-[2147483647] w-11 h-11 flex items-center justify-center rounded-full bg-white/95 backdrop-blur-xl text-red-600 hover:text-red-700 shadow-2xl shadow-slate-900/20 hover:shadow-red-500/20 ring-1 ring-slate-900/5 hover:ring-red-500/20 pointer-events-auto transition-all duration-300 hover:scale-110 active:scale-95"
              style={{
                WebkitTapHighlightColor: "transparent",
                touchAction: "manipulation",
              }}
            >
              <svg
                className="w-6 h-6 pointer-events-none"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ===== SIGNATURE ACCESS MODAL ===== */}
      {showSignatureAccess && (
        <SignatureAccessModal
          key={`${previewFile.id}-${previewFile.allow_customer_sign}-${previewFile.allow_department_sign}`}
          documentData={previewFile}
          onClose={() => setShowSignatureAccess(false)}
          onUpdated={(updatedAccess) => {
            setPreviewFile((prev) => ({
              ...prev,
              ...updatedAccess,
            }));
            setShowSignatureAccess(false);
          }}
        />
      )}
    </div>,

    document.getElementById("modal-root"),
  );
};

export default ViewFileModal;
