import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { usuarios, subgrupos } from './schema.js';

// Crear la conexión a SQLite
const sqlite = new Database('./data/hospital.db');

// Habilitar WAL mode para mejor rendimiento
sqlite.pragma('journal_mode = WAL');
sqlite.pragma('synchronous = NORMAL');

// Crear la instancia de Drizzle
export const db = drizzle(sqlite);

// Exportar las tablas para usarlas en otros archivos
export { usuarios, subgrupos };