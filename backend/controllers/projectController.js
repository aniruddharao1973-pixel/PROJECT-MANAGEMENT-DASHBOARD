// backend/controllers/projectController.js
import { pool } from "../db.js";
import { seedDefaultFolders } from "../services/folderSeeder.js";

/* ---------------------------------------------------
   ⭐ Get projects for logged-in user
   Roles supported:
   - admin / techsales → all projects
   - customer → company projects
   - department → department projects
--------------------------------------------------- */

export const getMyProjects = async (req, res) => {
  try {
    const { id: userId, role, departmentId, department_id } = req.user;

    // Normalize department id from JWT
    const resolvedDepartmentId = departmentId || department_id || null;

    // ✅ STRICT & SAFE department-projects route detection
    const isDepartmentProjectsRoute =
      req.method === "GET" &&
      typeof req.params?.departmentId === "string" &&
      req.params.departmentId !== "" &&
      req.params.departmentId !== "null";

    let result;

    /* =====================================================
       DEPARTMENT PROJECTS PAGE (STRICT — ALL ROLES)
       URL: /api/projects/department/:departmentId/projects
    ===================================================== */
    if (isDepartmentProjectsRoute) {
      const routeDepartmentId = req.params.departmentId;

      if (!routeDepartmentId) {
        return res.json([]);
      }

      result = await pool.query(
        `
        SELECT DISTINCT
          p.*,
          c.name AS company_name
        FROM projects p
        JOIN project_departments pd
          ON pd.project_id = p.id
        LEFT JOIN companies c
          ON c.id = p.company_id
        WHERE pd.department_id = $1
          AND p.deleted_at IS NULL
        ORDER BY p.created_at DESC
        `,
        [routeDepartmentId],
      );

      return res.json(result.rows);
    }

    /* =====================================================
       NORMAL PROJECT LIST (GLOBAL BEHAVIOR)
       URL: /api/projects
    ===================================================== */

    /* =========================
       ADMIN / TECHSALES → ALL
    ========================= */
    if (role === "admin" || role === "techsales") {
      result = await pool.query(
        `
  SELECT
    p.*,
    c.name AS company_name,

    COALESCE(
      ARRAY_AGG(pd.department_id)
        FILTER (WHERE pd.department_id IS NOT NULL),
      '{}'
    ) AS department_ids,

    COALESCE(
      json_agg(
        json_build_object(
          'id', d.id,
          'name', d.name
        )
      ) FILTER (WHERE d.id IS NOT NULL),
      '[]'
    ) AS departments

  FROM projects p
  LEFT JOIN project_departments pd 
    ON pd.project_id = p.id
  LEFT JOIN departments d 
    ON d.id = pd.department_id
  LEFT JOIN companies c 
    ON c.id = p.company_id

  WHERE p.deleted_at IS NULL

  GROUP BY p.id, c.name
  ORDER BY p.created_at DESC
  `,
      );

      /* =========================
       CUSTOMER → COMPANY PROJECTS
    ========================= */
    } else if (role === "customer" || role === "collaborator") {
      const companyRes = await pool.query(
        `
  SELECT company_id
  FROM user_companies
  WHERE user_id = $1
`,
        [userId],
      );

      if (companyRes.rowCount === 0) {
        return res.json([]);
      }

      result = await pool.query(
        `
        SELECT
          p.*,
          COALESCE(
            ARRAY_AGG(pd.department_id)
              FILTER (WHERE pd.department_id IS NOT NULL),
            '{}'
          ) AS department_ids
        FROM projects p
        LEFT JOIN project_departments pd
          ON pd.project_id = p.id
        WHERE p.company_id = ANY($1)

          AND p.deleted_at IS NULL
        GROUP BY p.id
        ORDER BY p.created_at DESC
        `,
        [companyRes.rows.map((r) => r.company_id)],
      );

      /* =========================
       DEPARTMENT → ASSIGNED PROJECTS
       (Dashboard + /projects page)
    ========================= */
    } else if (role === "department") {
      if (!resolvedDepartmentId) {
        return res.json([]);
      }

      result = await pool.query(
        `
        SELECT DISTINCT
          p.*,
          c.name AS company_name
        FROM projects p
        JOIN project_departments pd
          ON pd.project_id = p.id
        LEFT JOIN companies c
          ON c.id = p.company_id
        WHERE pd.department_id = $1
          AND p.deleted_at IS NULL
        ORDER BY p.created_at DESC
        `,
        [resolvedDepartmentId],
      );

      /* =========================
       UNKNOWN ROLE → EMPTY
    ========================= */
    } else {
      return res.json([]);
    }

    return res.json(result.rows);
  } catch (error) {
    console.error("❌ Get My Projects Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ---------------------------------------------------
   ⭐ NEW — Get a single project by ID (Folders + Breadcrumb FIX)
--------------------------------------------------- */
export const getProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { role, departmentId, id: userId } = req.user;

    let query;
    let params = [projectId];

    /* =========================
       ADMIN / TECHSALES
    ========================= */
    if (role === "admin" || role === "techsales") {
      query = `
        SELECT
          p.*,
          c.name AS company_name,

          -- ✅ PRIMARY department for Teams breadcrumb
          pd.department_id,
          d.name AS department_name,

          COALESCE(
            ARRAY_AGG(pd.department_id)
              FILTER (WHERE pd.department_id IS NOT NULL),
            '{}'
          ) AS department_ids

        FROM projects p
        LEFT JOIN project_departments pd ON pd.project_id = p.id
        LEFT JOIN departments d ON d.id = pd.department_id
        LEFT JOIN companies c ON c.id = p.company_id
        WHERE p.id = $1
        GROUP BY p.id, c.name, pd.department_id, d.name
      `;
    } else if (role === "customer" || role === "collaborator") {
      /* =========================
       CUSTOMER
    ========================= */
      query = `
        SELECT
          p.*,
          c.name AS company_name,

          pd.department_id,
          d.name AS department_name,

          COALESCE(
            ARRAY_AGG(pd.department_id)
              FILTER (WHERE pd.department_id IS NOT NULL),
            '{}'
          ) AS department_ids

        FROM projects p
        JOIN user_companies uc ON uc.company_id = p.company_id
        LEFT JOIN project_departments pd ON pd.project_id = p.id
        LEFT JOIN departments d ON d.id = pd.department_id
        LEFT JOIN companies c ON c.id = p.company_id
        WHERE p.id = $1
          AND uc.user_id = $2
        GROUP BY p.id, c.name, pd.department_id, d.name
      `;
      params.push(userId);
    } else if (role === "department") {
      query = `
    SELECT
      p.*,
      c.name AS company_name,

      /* ALL departments for this project */
      COALESCE(
        json_agg(
          json_build_object(
            'id', d.id,
            'name', d.name,
            'email', d.email
          )
        ) FILTER (WHERE d.id IS NOT NULL),
        '[]'
      ) AS departments,

      /* keep legacy array for compatibility */
      COALESCE(
        ARRAY_AGG(pd.department_id)
          FILTER (WHERE pd.department_id IS NOT NULL),
        '{}'
      ) AS department_ids

    FROM projects p

    /* SECURITY: department can see ONLY its mapped projects */
    JOIN project_departments pd_sec
      ON pd_sec.project_id = p.id
     AND pd_sec.department_id = $2

    /* load ALL departments of that project */
    LEFT JOIN project_departments pd
      ON pd.project_id = p.id

    LEFT JOIN departments d
      ON d.id = pd.department_id

    LEFT JOIN companies c
      ON c.id = p.company_id

    WHERE p.id = $1
      AND p.deleted_at IS NULL

    GROUP BY p.id, c.name
  `;

      params.push(departmentId);
    } else {
      return res.status(403).json({ message: "Access denied" });
    }

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(403).json({ message: "Project access denied" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Get Project By ID Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ---------------------------------------------------
   2️⃣ Create Project (Admin / TechSales)
--------------------------------------------------- */
// export const createProject = async (req, res) => {
//   const { name, customerId, departmentId } = req.body;

//   if (!name || !customerId || !departmentId) {
//     return res.status(400).json({
//       message: "Project name, companyId and departmentId are required",
//     });
//   }

//   console.log("\n=== Create Project Called ===");
//   console.log("Incoming:", { name, customerId, departmentId });

//   const client = await pool.connect();

//   try {
//     await client.query("BEGIN");

//     /* ---------------------------------------------------
//        1️⃣ Validate company
//     --------------------------------------------------- */
//     const comp = await client.query(`SELECT id FROM companies WHERE id = $1`, [
//       customerId,
//     ]);

//     if (comp.rowCount === 0) {
//       await client.query("ROLLBACK");
//       return res.status(404).json({ message: "Company not found" });
//     }

//     /* ---------------------------------------------------
//        2️⃣ Validate department
//     --------------------------------------------------- */
//     const dept = await client.query(
//       `
//       SELECT id
//       FROM departments
//       WHERE id = $1
//         AND deleted_at IS NULL
//         AND is_active = true
//       `,
//       [departmentId]
//     );

//     if (dept.rowCount === 0) {
//       await client.query("ROLLBACK");
//       return res.status(404).json({ message: "Department not found" });
//     }

//     /* ---------------------------------------------------
//        3️⃣ Create project WITH department
//     --------------------------------------------------- */
//     const projectRes = await client.query(
//       `
//       INSERT INTO projects (
//         name,
//         company_id,
//         department_id,
//         created_by
//       )
//       VALUES ($1, $2, $3, $4)
//       RETURNING *
//       `,
//       [name, customerId, departmentId, req.user.id]
//     );

//     const project = projectRes.rows[0];
//     console.log("✔ Project created:", project.id);

//     /* ---------------------------------------------------
//        4️⃣ AUTO-GRANT department ↔ customer access
//     --------------------------------------------------- */
//     await client.query(
//       `
//       INSERT INTO department_customer_access (
//         department_id,
//         company_id,
//         created_at
//       )
//       VALUES ($1, $2, now())
//       ON CONFLICT (department_id, company_id)
//       DO NOTHING
//       `,
//       [departmentId, customerId]
//     );

//     console.log("✔ Department customer access ensured");

//     /* ---------------------------------------------------
//        5️⃣ Seed default folders
//     --------------------------------------------------- */
//     await seedDefaultFolders(project.id, client);

//     await client.query("COMMIT");

//     res.status(201).json({
//       message: "Project created successfully",
//       project,
//     });
//   } catch (err) {
//     await client.query("ROLLBACK");
//     console.error("CreateProject Error:", err);
//     res.status(500).json({ message: "Server error" });
//   } finally {
//     client.release();
//   }
// };

/* ---------------------------------------------------
   3️⃣ Assign Project to Department (Admin / TechSales)
--------------------------------------------------- */
export const assignProjectToDepartment = async (req, res) => {
  const { projectId } = req.params;
  const { departmentId } = req.body;

  console.log("➡️ Assign Project To Department called", {
    projectId,
    departmentId,
    user: req.user.id,
    role: req.user.role,
  });

  // 🔒 Role guard
  if (!["admin", "techsales"].includes(req.user.role)) {
    console.log("❌ Access denied: invalid role", req.user.role);
    return res.status(403).json({ message: "Access denied" });
  }

  if (!departmentId) {
    return res.status(400).json({ message: "departmentId is required" });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    console.log("🟡 Transaction started");

    /* ---------------------------------------------------
       1️⃣ Validate project
    --------------------------------------------------- */
    const projectRes = await client.query(
      `
      SELECT id, company_id
      FROM projects
      WHERE id = $1
        AND deleted_at IS NULL
      `,
      [projectId],
    );

    if (projectRes.rowCount === 0) {
      await client.query("ROLLBACK");
      console.log("❌ Project not found:", projectId);
      return res.status(404).json({ message: "Project not found" });
    }

    const { company_id } = projectRes.rows[0];
    console.log("✅ Project validated", { projectId, company_id });

    /* ---------------------------------------------------
       2️⃣ Validate department
    --------------------------------------------------- */
    const deptRes = await client.query(
      `
      SELECT id
      FROM departments
      WHERE id = $1
        AND deleted_at IS NULL
        AND is_active = true
      `,
      [departmentId],
    );

    if (deptRes.rowCount === 0) {
      await client.query("ROLLBACK");
      console.log("❌ Department not found:", departmentId);
      return res.status(404).json({ message: "Department not found" });
    }

    console.log("✅ Department validated", departmentId);

    /* ---------------------------------------------------
       3️⃣ Assign department to project
    --------------------------------------------------- */
    await client.query(
      `
  INSERT INTO project_departments (project_id, department_id)
  VALUES ($1, $2)
  ON CONFLICT DO NOTHING
  `,
      [projectId, departmentId],
    );

    console.log("✅ Project assigned to department", {
      projectId,
      departmentId,
    });

    /* ---------------------------------------------------
   4️⃣ AUTO-GRANT department ↔ customer access
--------------------------------------------------- */
    await client.query(
      `
  INSERT INTO department_customer_access (
    department_id,
    company_id,
    created_at
  )
  VALUES ($1, $2, now())
  ON CONFLICT (department_id, company_id)
  DO NOTHING
  `,
      [departmentId, company_id],
    );

    console.log("✅ Department customer access ensured", {
      departmentId,
      company_id,
    });

    /* ---------------------------------------------------
   5️⃣ 🔥 ENSURE FOLDERS EXIST (CRITICAL FIX)
--------------------------------------------------- */
    console.log("📁 Ensuring folders for project:", projectId);
    await seedDefaultFolders(projectId, client);
    console.log("📁 Folder seeding ensured for project:", projectId);

    await client.query("COMMIT");
    console.log("🟢 Transaction committed");

    res.json({
      message: "Project assigned to department successfully",
      projectId,
      departmentId,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Assign Project To Department Error:", err);
    res.status(500).json({ message: "Server error" });
  } finally {
    client.release();
    console.log("🔚 DB client released");
  }
};

/* ---------------------------------------------------
   4️⃣ Unassign Project from Department (Admin / TechSales)
--------------------------------------------------- */
export const unassignProjectFromDepartment = async (req, res) => {
  const { projectId } = req.params;
  const departmentId = req.body?.departmentId || req.query?.departmentId;

  console.log("➡️ [UNASSIGN] Request received", {
    projectId,
    departmentId,
    user: req.user.id,
    role: req.user.role,
  });

  /* -------------------------------
     Role guard
  -------------------------------- */
  if (!["admin", "techsales"].includes(req.user.role)) {
    console.log("❌ [UNASSIGN] Access denied (role)", req.user.role);
    return res.status(403).json({ message: "Access denied" });
  }

  if (!departmentId) {
    console.log("❌ [UNASSIGN] departmentId missing");
    return res.status(400).json({
      message: "departmentId is required to unassign",
    });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    console.log("🟡 [UNASSIGN] Transaction started");

    /* -------------------------------
       1️⃣ Validate project
    -------------------------------- */
    const projectRes = await client.query(
      `
      SELECT id
      FROM projects
      WHERE id = $1
        AND deleted_at IS NULL
      `,
      [projectId],
    );

    if (projectRes.rowCount === 0) {
      await client.query("ROLLBACK");
      console.log("❌ [UNASSIGN] Project not found", projectId);
      return res.status(404).json({ message: "Project not found" });
    }

    /* -------------------------------
       2️⃣ Ensure mapping exists
    -------------------------------- */
    const mappingRes = await client.query(
      `
      SELECT 1
      FROM project_departments
      WHERE project_id = $1
        AND department_id = $2
      `,
      [projectId, departmentId],
    );

    if (mappingRes.rowCount === 0) {
      await client.query("ROLLBACK");
      console.log("⚠️ [UNASSIGN] Mapping not found (noop)", {
        projectId,
        departmentId,
      });
      return res.status(404).json({
        message: "Department is not assigned to this project",
      });
    }

    /* -------------------------------
       3️⃣ Remove mapping
       (NO minimum department restriction)
    -------------------------------- */
    await client.query(
      `
      DELETE FROM project_departments
      WHERE project_id = $1
        AND department_id = $2
      `,
      [projectId, departmentId],
    );

    await client.query("COMMIT");
    console.log("✅ [UNASSIGN] Project unassigned successfully", {
      projectId,
      departmentId,
    });

    return res.json({
      message: "Project unassigned from department successfully",
      projectId,
      departmentId,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ [UNASSIGN] Server error:", err);
    return res.status(500).json({ message: "Server error" });
  } finally {
    client.release();
  }
};

/* ---------------------------------------------------
   ✏️ Rename Project (Admin / TechSales)
--------------------------------------------------- */
export const renameProject = async (req, res) => {
  const { projectId } = req.params;
  const { name } = req.body;

  console.log("➡️ Rename Project called", {
    projectId,
    name,
    user: req.user.id,
    role: req.user.role,
  });

  /* 🔒 Role Guard */
  if (!["admin", "techsales"].includes(req.user.role)) {
    return res.status(403).json({ message: "Access denied" });
  }

  /* 🧹 Validation */
  if (!name || !name.trim()) {
    return res.status(400).json({ message: "Project name is required" });
  }

  const trimmedName = name.trim();

  try {
    /* ---------------------------------------------------
       1️⃣ Get existing project (for validation)
    --------------------------------------------------- */
    const existing = await pool.query(
      `
      SELECT id, name
      FROM projects
      WHERE id = $1
        AND deleted_at IS NULL
      `,
      [projectId],
    );

    if (existing.rowCount === 0) {
      return res.status(404).json({ message: "Project not found" });
    }

    const currentName = existing.rows[0].name;

    /* 🚫 Prevent unnecessary update */
    if (currentName === trimmedName) {
      return res.status(400).json({
        message: "Project name is unchanged",
      });
    }

    /* ---------------------------------------------------
       2️⃣ Update project
    --------------------------------------------------- */
    const result = await pool.query(
      `
      UPDATE projects
      SET name = $1,
          updated_at = now()
      WHERE id = $2
      RETURNING *
      `,
      [trimmedName, projectId],
    );

    console.log("✅ Project renamed:", {
      projectId,
      oldName: currentName,
      newName: trimmedName,
    });

    return res.json({
      message: "Project renamed successfully",
      project: result.rows[0],
    });
  } catch (error) {
    console.error("❌ Rename Project Error FULL:", error);

    return res.status(500).json({
      message: error.message || "Server error",
    });
  }
};
