// // backend/routes/admin.js
// import express from "express";

// import {
//   createCustomer,
//   createProject,
//   createDepartmentUser,
//   getCustomers,
//   getCustomerById,
//   getCompanyProfile,
//   updateCustomerProfile,
//   deleteCompany,
//   deleteProject,
//   getProjects,
//   validateDuplicate,
// } from "../controllers/adminController.js";

// import {
//   authMiddleware,
//   requireAdminOrTechSales,
// } from "../middleware/authMiddleware.js";

// const router = express.Router();

// /* ---------------------------------------------------
//    1️⃣ Create Customer (Admin / TechSales)
// --------------------------------------------------- */
// router.post(
//   "/create-customer",
//   authMiddleware,
//   requireAdminOrTechSales,
//   createCustomer
// );

// /* ---------------------------------------------------
//    2️⃣ Create Project
// --------------------------------------------------- */
// router.post(
//   "/create-project",
//   authMiddleware,
//   requireAdminOrTechSales,
//   createProject
// );

// /* ---------------------------------------------------
//    1️⃣➕ Create Department User (Admin / TechSales)
// --------------------------------------------------- */
// router.post(
//   "/create-department-user",
//   authMiddleware,
//   requireAdminOrTechSales,
//   createDepartmentUser
// );

// /* ---------------------------------------------------
//    3️⃣ 🔍 Validate Duplicate (LIVE CHECK)
//    (Company Name / Email / External ID / Phone)
// --------------------------------------------------- */
// router.post(
//   "/validate-duplicate",
//   authMiddleware,
//   requireAdminOrTechSales,
//   validateDuplicate
// );

// /* ---------------------------------------------------
//    4️⃣ Get All Customers
// --------------------------------------------------- */
// router.get("/customers", authMiddleware, requireAdminOrTechSales, getCustomers);

// /* ---------------------------------------------------
//    5️⃣ Get Customer + Company + Projects
// --------------------------------------------------- */
// router.get(
//   "/customers/:customerId",
//   authMiddleware,
//   requireAdminOrTechSales,
//   getCustomerById
// );

// /* ---------------------------------------------------
//    6️⃣ Get Company Profile
// --------------------------------------------------- */
// router.get(
//   "/company/:companyId",
//   authMiddleware,
//   requireAdminOrTechSales,
//   getCompanyProfile
// );

// /* ---------------------------------------------------
//    7️⃣ Update Company Profile
// --------------------------------------------------- */
// router.put(
//   "/company/:companyId",
//   authMiddleware,
//   requireAdminOrTechSales,
//   updateCustomerProfile
// );

// /* ---------------------------------------------------
//    8️⃣ Delete Entire Company
// --------------------------------------------------- */
// router.delete(
//   "/company/:companyId",
//   authMiddleware,
//   requireAdminOrTechSales,
//   deleteCompany
// );

// /* ---------------------------------------------------
//    9️⃣ Get All Projects
// --------------------------------------------------- */
// router.get("/projects", authMiddleware, requireAdminOrTechSales, getProjects);

// /* ---------------------------------------------------
//    🔟 Delete Single Project
// --------------------------------------------------- */
// router.delete(
//   "/project/:projectId",
//   authMiddleware,
//   requireAdminOrTechSales,
//   deleteProject
// );

// export default router;

// backend/routes/admin.js
import express from "express";

import {
  // ---------------- Customers / Projects ----------------
  createCustomer,
  createProject,
  getCustomers,
  getCustomerById,
  getCompanyProfile,
  updateCustomerProfile,
  deleteCompany,
  deleteProject,
  getProjects,
  validateDuplicate,
  createCollaborator,
  deleteCollaborator,

  // ---------------- Departments ----------------
  createDepartment,
  assignCustomersToDepartment,
  getDeletedDepartments,
  restoreDepartment,
  updateDepartment,
  addDepartmentMember,
  getDepartmentMembers,
  deleteDepartmentMember,
} from "../controllers/adminController.js";

import { assignProjectToDepartment } from "../controllers/projectController.js";

import {
  authMiddleware,
  requireAdminOrTechSales,
} from "../middleware/authMiddleware.js";

const router = express.Router();

/* ===================================================
   CUSTOMERS
=================================================== */

/* 1️⃣ Create Customer */
router.post(
  "/create-customer",
  authMiddleware,
  requireAdminOrTechSales,
  createCustomer,
);

/* 2️⃣ Get All Customers */
router.get("/customers", authMiddleware, requireAdminOrTechSales, getCustomers);

/* 3️⃣ Get Customer + Company + Projects */
router.get(
  "/customers/:customerId",
  authMiddleware,
  requireAdminOrTechSales,
  getCustomerById,
);

/* 4️⃣ Get Company Profile */
router.get(
  "/company/:companyId",
  authMiddleware,
  requireAdminOrTechSales,
  getCompanyProfile,
);

/* 5️⃣ Update Company Profile */
router.put(
  "/company/:companyId",
  authMiddleware,
  requireAdminOrTechSales,
  updateCustomerProfile,
);

/* 6️⃣ Delete Entire Company */
router.delete(
  "/company/:companyId",
  authMiddleware,
  requireAdminOrTechSales,
  deleteCompany,
);

/* ===================================================
   PROJECTS
=================================================== */

/* 7️⃣ Create Project */
router.post(
  "/create-project",
  authMiddleware,
  requireAdminOrTechSales,
  createProject,
);

/* 8️⃣ Get All Projects */
router.get("/projects", authMiddleware, requireAdminOrTechSales, getProjects);

/* 9️⃣ Delete Single Project */
router.delete(
  "/project/:projectId",
  authMiddleware,
  requireAdminOrTechSales,
  deleteProject,
);

/* ===================================================
   DEPARTMENTS
=================================================== */

/* 🔹 Create Department */
router.post(
  "/departments",
  authMiddleware,
  requireAdminOrTechSales,
  createDepartment,
);

/* 🔹 Assign Customers to Department */
router.post(
  "/departments/assign-customers",
  authMiddleware,
  requireAdminOrTechSales,
  assignCustomersToDepartment,
);

router.put(
  "/projects/:projectId/assign-department",
  authMiddleware,
  requireAdminOrTechSales,
  assignProjectToDepartment,
);

/* 🔹 Get Deleted Departments (Recycle Bin) */
router.get(
  "/departments-recycle-bin",
  authMiddleware,
  requireAdminOrTechSales,
  getDeletedDepartments,
);

/* 🔹 Restore Department */
router.put(
  "/departments/:departmentId/restore",
  authMiddleware,
  requireAdminOrTechSales,
  restoreDepartment,
);

/* 🔹 Add Member to Existing Department */
router.post(
  "/departments/members",
  authMiddleware,
  requireAdminOrTechSales,
  addDepartmentMember,
);

/* 🔹 Get Department Members */
router.get(
  "/departments/:departmentId/members",
  authMiddleware,
  requireAdminOrTechSales,
  getDepartmentMembers,
);

/* 🔹 Delete Department Member (Permanent) */
router.delete(
  "/departments/members/:memberId",
  authMiddleware,
  requireAdminOrTechSales,
  deleteDepartmentMember,
);

/* ===================================================
   COLLABORATORS
=================================================== */

/* Create Collaborator */
router.post(
  "/collaborators",
  authMiddleware,
  requireAdminOrTechSales,
  createCollaborator,
);

/* Delete Collaborator */
router.delete(
  "/collaborators/:userId",
  authMiddleware,
  requireAdminOrTechSales,
  deleteCollaborator,
);

/* ===================================================
   UTILITIES
=================================================== */

/* 🔍 Validate Duplicate (LIVE CHECK) */
router.post(
  "/validate-duplicate",
  authMiddleware,
  requireAdminOrTechSales,
  validateDuplicate,
);

/* 🔹 Update Department (Name / Email) */
router.put(
  "/departments/:departmentId",
  authMiddleware,
  requireAdminOrTechSales,
  updateDepartment,
);

export default router;
