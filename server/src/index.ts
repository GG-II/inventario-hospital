import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import { authRoutes } from './routes/auth.js';
import { authMiddleware } from './middleware/auth.js';

// Crear la instancia de Fastify
const fastify = Fastify({
  logger: true
});

// Registrar plugins de seguridad
async function registerPlugins() {
  // CORS - permite que el frontend se conecte al backend
  await fastify.register(cors, {
    origin: true
  });

  // Helmet - añade headers de seguridad básicos
  await fastify.register(helmet);
}

// Rutas públicas (sin autenticación)
async function registerPublicRoutes() {
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
      version: '1.0.0',
      endpoints: {
        public: [
          'GET /',
          'GET /health',
          'POST /auth/login'
        ],
        protected: [
          'GET /auth/me',
          'POST /auth/logout',
          'GET /auth/verify'
        ]
      }
    };
  });

  // Registrar rutas de autenticación
  await fastify.register(authRoutes, { prefix: '/auth' });
}

// Rutas protegidas (requieren autenticación)
async function registerProtectedRoutes() {
  // Aplicar middleware de autenticación a todas las rutas que empiecen con /api
  fastify.addHook('preHandler', async (request, reply) => {
    // Solo aplicar autenticación a rutas que empiecen con /api o ciertas rutas de /auth
    const protectedPaths = ['/api', '/auth/me', '/auth/verify', '/auth/logout'];
    const needsAuth = protectedPaths.some(path => request.url.startsWith(path));
    
    if (needsAuth) {
      await authMiddleware(request, reply);
    }
  });

  // Ruta de prueba protegida
  fastify.get('/api/test', async (request: any, reply) => {
    return {
      message: 'Esta es una ruta protegida',
      user: request.user,
      timestamp: new Date().toISOString()
    };
  });
}

// Función principal para iniciar el servidor
async function start() {
  try {
    // Registrar plugins y rutas
    await registerPlugins();
    await registerPublicRoutes();
    await registerProtectedRoutes();

    // Iniciar el servidor en el puerto 3000
    await fastify.listen({ 
      port: 3000, 
      host: '0.0.0.0'
    });

    console.log('🚀 Servidor iniciado en http://localhost:3000');
    console.log('📋 Salud del servidor: http://localhost:3000/health');
    console.log('🔐 Login: POST http://localhost:3000/auth/login');
    console.log('👤 Usuario de prueba: admin / admin123');
    
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

// Iniciar el servidor
start();