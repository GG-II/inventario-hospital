import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db, usuarios } from '../db/connection.js';
import { eq } from 'drizzle-orm';

// Clave secreta para JWT (en producción debería estar en variables de entorno)
const JWT_SECRET = 'hospital-inventario-secret-key-2025';

// Tipos para las requests
interface LoginRequest {
  username: string;
  password: string;
}

interface AuthenticatedRequest extends FastifyRequest {
  user?: {
    id: number;
    username: string;
    nombre: string;
    rol: string;
  };
}

export async function authRoutes(fastify: FastifyInstance) {
  
  // POST /auth/login - Iniciar sesión
  fastify.post<{ Body: LoginRequest }>('/login', async (request, reply) => {
    try {
      const { username, password } = request.body;

      // Validar que se enviaron los datos
      if (!username || !password) {
        return reply.status(400).send({
          error: 'Username y password son requeridos'
        });
      }

      // Buscar usuario en la base de datos
      const user = await db.select().from(usuarios).where(eq(usuarios.username, username)).limit(1);
      
      if (user.length === 0) {
        return reply.status(401).send({
          error: 'Credenciales inválidas'
        });
      }

      const userData = user[0];

      // Verificar contraseña
      const isValidPassword = await bcrypt.compare(password, userData.password_hash);
      
      if (!isValidPassword) {
        return reply.status(401).send({
          error: 'Credenciales inválidas'
        });
      }

      // Verificar que el usuario esté activo
      if (userData.estado !== 'ACTIVO') {
        return reply.status(401).send({
          error: 'Usuario inactivo'
        });
      }

      // Generar token JWT
      const token = jwt.sign(
        {
          id: userData.id,
          username: userData.username,
          nombre: userData.nombre,
          rol: userData.rol
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Respuesta exitosa
      return reply.send({
        message: 'Login exitoso',
        token,
        user: {
          id: userData.id,
          username: userData.username,
          nombre: userData.nombre,
          rol: userData.rol
        }
      });

    } catch (error) {
      console.error('Error en login:', error);
      return reply.status(500).send({
        error: 'Error interno del servidor'
      });
    }
  });

  // GET /auth/me - Obtener información del usuario actual
  fastify.get('/me', async (request: AuthenticatedRequest, reply) => {
    try {
      // El middleware de autenticación ya validó el token y agregó user al request
      if (!request.user) {
        return reply.status(401).send({
          error: 'Token no válido'
        });
      }

      return reply.send({
        user: request.user
      });

    } catch (error) {
      console.error('Error en /auth/me:', error);
      return reply.status(500).send({
        error: 'Error interno del servidor'
      });
    }
  });

  // POST /auth/logout - Cerrar sesión
  fastify.post('/logout', async (request, reply) => {
    // Con JWT stateless, el logout se maneja en el frontend eliminando el token
    // Aquí solo confirmamos que se recibió la petición
    return reply.send({
      message: 'Logout exitoso'
    });
  });

  // GET /auth/verify - Verificar si el token es válido
  fastify.get('/verify', async (request: AuthenticatedRequest, reply) => {
    // Si llegamos aquí, el middleware ya validó el token
    return reply.send({
      valid: true,
      user: request.user
    });
  });
}

// Exportar la clave secreta para usar en el middleware
export { JWT_SECRET };