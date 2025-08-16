import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// Tabla de usuarios
export const usuarios = sqliteTable('usuarios', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  nombre: text('nombre').notNull(),
  username: text('username').notNull().unique(),
  password_hash: text('password_hash').notNull(),
  rol: text('rol').notNull(), // INVENTARIOS, JEFE_SERVICIO, INFORMATICA, MANTENIMIENTO, LECTURA
  estado: text('estado').notNull().default('ACTIVO'), // ACTIVO, INACTIVO
  created_at: text('created_at').default(sql`CURRENT_TIMESTAMP`)
});

// Tabla de subgrupos SICOIN (para el demo)
export const subgrupos = sqliteTable('subgrupos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  codigo: text('codigo').notNull().unique(), // 321, 322, etc.
  nombre: text('nombre').notNull(),
  descripcion: text('descripcion'),
  created_at: text('created_at').default(sql`CURRENT_TIMESTAMP`)
});