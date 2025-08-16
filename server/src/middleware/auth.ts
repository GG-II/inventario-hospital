import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../routes/auth.js';

interface AuthenticatedRequest extends FastifyRequest {
  user?: {
    id: number;
    username: string;
    nombre: string;
    rol: string;
  };
}

interface JWTPayload {
  id: number;
  username: string;
  nombre: string;
  rol: string;
  iat: number;
  exp: number;
}

export async function authMiddleware(request: AuthenticatedRequest, reply: FastifyReply) {
  try {
    // Obtener el token del header Authorization
    const authHeader = request.headers.authorization;
    
    if (!authHeader) {
      return reply.status(401).send({
        error: 'Token de autorización requerido'
      });
    }

    // El formato esperado es: "Bearer TOKEN"
    const token = authHeader.replace('Bearer ', '');
    
    if (!token) {
      return reply.status(401).send({
        error: 'Token de autorización requerido'
      });
    }

    // Verificar y decodificar el token
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    
    // Agregar la información del usuario al request
    request.user = {
      id: decoded.id,
      username: decoded.username,
      nombre: decoded.nombre,
      rol: decoded.rol
    };

    // Continuar con la siguiente función
    return;

  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return reply.status(401).send({
        error: 'Token inválido'
      });
    }
    
    if (error instanceof jwt.TokenExpiredError) {
      return reply.status(401).send({
        error: 'Token expirado'
      });
    }

    console.error('Error en middleware de autenticación:', error);
    return reply.status(500).send({
      error: 'Error interno del servidor'
    });
  }
}