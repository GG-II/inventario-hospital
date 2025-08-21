import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import { authRoutes } from './routes/auth.js';
import { apiRoutes } from './routes/api.js';
import { authMiddleware } from './middleware/auth.js';

// Crear la instancia de Fastify
const fastify = Fastify({
  logger: true
});

// Función principal para iniciar el servidor
async function start() {
  try {
    // Registrar plugins de seguridad
    await fastify.register(cors, {
      origin: true
    });

    await fastify.register(helmet);

    // Rutas públicas básicas
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
            'GET /auth/verify',
            'GET /api/test'
          ]
        }
      };
    });

    fastify.get('/health', async (request, reply) => {
      return { 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        message: 'Servidor del Hospital funcionando correctamente' 
      };
    });

    // Registrar rutas de autenticación
    await fastify.register(authRoutes, { prefix: '/auth' });
    await fastify.register(apiRoutes, { prefix: '/api' });

    // Middleware para rutas protegidas
    fastify.addHook('preHandler', async (request, reply) => {
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

    // Iniciar el servidor
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