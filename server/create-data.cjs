const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');

async function createData() {
  try {
    console.log('🌱 Creando datos de prueba...');

    // Conectar a la base de datos
    const db = new Database('./data/hospital.db');

    // Crear usuario administrador
    const passwordHash = await bcrypt.hash('admin123', 10);
    
    const insertUser = db.prepare(`
      INSERT INTO usuarios (nombre, username, password_hash, rol, estado) 
      VALUES (?, ?, ?, ?, ?)
    `);
    
    insertUser.run(
      'Administrador del Sistema',
      'admin', 
      passwordHash,
      'INVENTARIOS',
      'ACTIVO'
    );

    // Crear los subgrupos SICOIN
    const insertSubgrupo = db.prepare(`
      INSERT INTO subgrupos (codigo, nombre, descripcion) 
      VALUES (?, ?, ?)
    `);

    const subgrupos = [
      ['321', 'De producción', 'Bienes destinados a la producción'],
      ['322', 'De oficina y Muebles', 'Mobiliario y equipo de oficina'],
      ['323', 'Medio, sanitario y laboratorio', 'Equipo médico, sanitario y de laboratorio'],
      ['324', 'Educacional, cultural y recreativo', 'Equipo educativo, cultural y recreativo'],
      ['325', 'Transporte, tracción y elevación', 'Vehículos y equipo de transporte'],
      ['326', 'De comunicaciones', 'Equipo de comunicaciones y telecomunicaciones'],
      ['328', 'De cómputo', 'Equipo de cómputo y tecnología'],
      ['329', 'Otros activos', 'Otros bienes no clasificados en categorías anteriores']
    ];

    subgrupos.forEach(([codigo, nombre, descripcion]) => {
      insertSubgrupo.run(codigo, nombre, descripcion);
    });

    db.close();

    console.log('✅ Datos de prueba creados exitosamente');
    console.log('👤 Usuario: admin');
    console.log('🔑 Contraseña: admin123');
    console.log('📋 Subgrupos SICOIN creados: 8 registros');
    
  } catch (error) {
    console.error('❌ Error creando datos de prueba:', error);
  }
}

createData();