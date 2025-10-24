import sqlite3 from "sqlite3";
import { open } from "sqlite";

// ✅ Exporta correctamente la función openDb
export async function openDb() {
  return open({
    filename: "./ifn_tasks.db", // nombre del archivo de base de datos
    driver: sqlite3.Database
  });
}
