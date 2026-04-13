// src/api/documentsApi.js
import { useAxios } from "./axios";

export const useDocumentsApi = () => {
  const api = useAxios();

  // 🔥 Azure VM + IIS friendly upload configuration
  const uploadDocument = async (formData, config = {}) => {
    return api.post("/documents/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        ...(config.headers || {}),
      },

      // 🔥 Critical for large uploads behind IIS
      maxBodyLength: Infinity,
      maxContentLength: Infinity,

      // 🔥 Prevent axios timeout during IIS buffering
      timeout: 10 * 60 * 1000, // 10 minutes

      // 🔥 Disable compression for upload requests
      decompress: false,

      ...config,
    });
  };

  const getDocumentsByFolder = (folderId) =>
    api.get(`/documents/folder/${folderId}`);

  const getDocumentVersions = (documentId) =>
    api.get(`/documents/${documentId}/versions`);

  const deleteDocument = (documentId) => api.delete(`/documents/${documentId}`);

  const toggleDownload = (documentId, canDownload) =>
    api.patch(`/documents/${documentId}/toggle-download`, { canDownload });

  /*
=========================================
 SIGNATURE ACCESS (ADMIN / TECHSALES)
=========================================
*/
  const updateSignatureAccess = (
    documentId,
    { allow_customer_sign, allow_department_sign },
  ) =>
    api.patch(`/documents/${documentId}/signature-access`, {
      allow_customer_sign,
      allow_department_sign,
    });

  const downloadDocumentVersion = (versionId) =>
    api.get(`/documents/download/${versionId}`, {
      responseType: "blob", // ⭐ REQUIRED for file download
    });

  /*
  =========================================
    COMMENTS (Real-Time Chat)
  =========================================
  */
  const getComments = (documentId) =>
    api.get(`/documents/${documentId}/comments`);

  const addComment = (documentId, message) =>
    api.post(`/documents/${documentId}/comments`, { message });

  /*
  =========================================
    NOTES API
  =========================================
  */
  const getDocumentNotes = (documentId) =>
    api.get(`/documents/${documentId}/notes`);

  const updateDocumentNotes = (documentId, notes) =>
    api.put(`/documents/${documentId}/notes`, { notes });

  /*
=========================================
 RECYCLE BIN / RESTORE
=========================================
*/
  const getAdminRecycleBinDocuments = () => api.get("/documents/recycle-bin");

  const getCustomerRecycleBinDocuments = () =>
    api.get("/documents/recycle-bin/customer");

  // ✅ UNIFIED — Document + Folder
  const requestRestore = ({ id, type }) =>
    api.post("/documents/request-restore", { id, type });

  // Admin / TechSales → restore document only
  const restoreDocument = (documentId) =>
    api.post(`/documents/${documentId}/restore`);

  /*
=========================================
 SIGN DOCUMENT (DRAWN SIGNATURE)
=========================================
*/
  const signDocument = (documentId, payload) =>
    api.post(`/documents/${documentId}/sign`, payload);

  // REVIEW ACTIONS (Admin / TechSales)
  const approveDocument = (documentId, payload = {}) =>
    api.post(`/documents/${documentId}/approve`, payload);

  const rejectDocument = (documentId, payload = {}) =>
    api.post(`/documents/${documentId}/reject`, payload);

  // Timeline alias – same API but clearer intent
  const getDocumentTimeline = (documentId) =>
    api.get(`/documents/${documentId}/versions`);

  /*
=========================================
 SIGNATURE ACCESS (POLLING - READ ONLY)
=========================================
*/
  const getSignatureAccess = (documentId) =>
    api.get(`/documents/${documentId}/signature-access`);

  return {
    uploadDocument,
    getDocumentsByFolder,
    getDocumentVersions,
    deleteDocument,
    toggleDownload,
    updateSignatureAccess,
    downloadDocumentVersion,

    // 🔐 SIGNATURE
    signDocument,

    // RECYCLE BIN
    getAdminRecycleBinDocuments,
    getCustomerRecycleBinDocuments,
    requestRestore,
    restoreDocument,

    // COMMENTS
    getComments,
    addComment,
    getSignatureAccess,

    // REVIEW

    approveDocument,
    rejectDocument,

    // ➕ new alias
    getDocumentTimeline,

    // NOTES
    getDocumentNotes,
    updateDocumentNotes,
  };
};
