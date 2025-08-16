import bcrypt from 'bcrypt';
import { db, usuarios, subgrupos } from './connection.js';

async function seed() {
  try {
    console.log('🌱 Creando datos de prueba...');

    // Crear usuario administrador
    const passwordHash = await bcrypt.hash('admin123', 10);
    
    await db.insert(usuarios).values({
      nombre: 'Administrador del Sistema',
      username: 'admin',
      password_hash: passwordHash,
      rol: 'INVENTARIOS',
      estado: 'ACTIVO'
    });

    // Crear los 9 subgrupos SICOIN
    await db.insert(subgrupos).values([
      { codigo: '321', nombre: 'De producción', descripcion: 'Bienes destinados a la producción' },
      { codigo: '322', nombre: 'De oficina y Muebles', descripcion: 'Mobiliario y equipo de oficina' },
      { codigo: '323', nombre: 'Medio, sanitario y laboratorio', descripcion: 'Equipo médico, sanitario y de laboratorio' },
      { codigo: '324', nombre: 'Educacional, cultural y recreativo', descripcion: 'Equipo educativo, cultural y recreativo' },
      { codigo: '325', nombre: 'Transporte, tracción y elevación', descripcion: 'Vehículos y equipo de transporte' },
      { codigo: '326', nombre: 'De comunicaciones', descripcion: 'Equipo de comunicaciones y telecomunicaciones' },
      { codigo: '328', nombre: 'De cómputo', descripcion: 'Equipo de cómputo y tecnología' },
      { codigo: '329', nombre: 'Otros activos', descripcion: 'Otros bienes no clasificados en categorías anteriores' }
    ]);

    console.log('✅ Datos de prueba creados exitosamente');
    console.log('👤 Usuario: admin');
    console.log('🔑 Contraseña: admin123');
    console.log('📋 Subgrupos SICOIN creados: 8 registros');
    
  } catch (error) {
    console.error('❌ Error creando datos de prueba:', error);
  }
}

seed();