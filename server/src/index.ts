import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';

// Crear la instancia de Fastify
const fastify = Fastify({
  logger: true // Esto nos ayudará a ver qué está pasando en la consola
});

// Registrar plugins de seguridad
async function registerPlugins() {
  // CORS - permite que el frontend se conecte al backend
  await fastify.register(cors, {
    origin: true // En producción, esto debería ser más específico
  });

  // Helmet - añade headers de seguridad básicos
  await fastify.register(helmet);
}

// Rutas básicas
async function registerRoutes() {
  // Ruta de salud - para verificar que el servidor funciona
  fastify.get('/health', async (request, reply) => {
    return { 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      message: 'Servidor del Hospital funcionando correctamente' 
    };
  });

  // Ruta de bienvenida
  fastify.get('/', async (request, reply) => {
    return { 
      message: 'API del Sistema de Inventario - Hospital Regional de Huehuetenango',
      version: '1.0.0'
    };
  });
}

// Función principal para iniciar el servidor
async function start() {
  try {
    // Registrar plugins y rutas
    await registerPlugins();
    await registerRoutes();

    // Iniciar el servidor en el puerto 3000
    await fastify.listen({ 
      port: 3000, 
      host: '0.0.0.0' // Esto permite conexiones desde cualquier IP (necesario para Docker)
    });

    console.log('🚀 Servidor iniciado en http://localhost:3000');
    console.log('📋 Salud del servidor: http://localhost:3000/health');
    
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

// Iniciar el servidor
start();