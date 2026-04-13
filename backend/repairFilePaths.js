// backend/repairFilePaths.js
import fs from "fs";
import path from "path";
import { pool } from "./db.js";

const uploadsDir = path.join(process.cwd(), "uploads");

async function repair() {
  console.log("🔍 Scanning uploads folder...");

  const fileMap = new Map();

  const dateFolders = fs.readdirSync(uploadsDir);

  for (const folder of dateFolders) {
    const folderPath = path.join(uploadsDir, folder);

    if (!fs.statSync(folderPath).isDirectory()) continue;

    const files = fs.readdirSync(folderPath);

    for (const file of files) {
      const fullPath = `/uploads/${folder}/${file}`;
      fileMap.set(file, fullPath);
    }
  }

  console.log(`📂 Found ${fileMap.size} physical files`);

  const result = await pool.query(`
    SELECT id, file_path
    FROM document_versions
    WHERE file_path NOT LIKE '/uploads/%/%'
  `);

  console.log(`🛠 Fixing ${result.rows.length} DB rows...`);

  for (const row of result.rows) {
    const filename = path.basename(row.file_path);

    if (fileMap.has(filename)) {
      const correctPath = fileMap.get(filename);

      await pool.query(
        `UPDATE document_versions SET file_path = $1 WHERE id = $2`,
        [correctPath, row.id],
      );

      console.log(`✔ Updated: ${filename}`);
    } else {
      console.log(`❌ File not found physically: ${filename}`);
    }
  }

  console.log("✅ Repair complete");
  process.exit();
}

repair();
