import sqlite3 from "sqlite3";
import { open } from "sqlite";

async function crearTablaYUsuario() {
  const db = await open({
    filename: "./database.sqlite",
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      codigo_conglomerado TEXT,
      codigo_brigada TEXT,
      password TEXT,
      rol TEXT
    )
  `);

  await db.run(`
    INSERT INTO usuarios (codigo_conglomerado, codigo_brigada, password, rol)
    VALUES ('IFN-001', 'BRG-01', '1234', 'brigadista')
  `);

  console.log("✅ Usuario creado con éxito");
  await db.close();
}

crearTablaYUsuario().catch(err => console.error("❌ Error:", err));
