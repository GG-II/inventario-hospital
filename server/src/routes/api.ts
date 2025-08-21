import { FastifyInstance, FastifyRequest } from 'fastify';
import { db, usuarios, subgrupos } from '../db/connection.js';
import { eq } from 'drizzle-orm';

interface AuthenticatedRequest extends FastifyRequest {
    user?: {
        id: number;
        username: string;
        nombre: string;
        rol: string;
    };
}

export async function apiRoutes(fastify: FastifyInstance) {

    // GET /api/subgrupos - Listar todos los subgrupos SICOIN
    fastify.get('/subgrupos', async (request: AuthenticatedRequest, reply) => {
        try {
            console.log('📊 Consultando subgrupos SICOIN...');

            const allSubgrupos = await db.select().from(subgrupos);

            console.log(`✅ Encontrados ${allSubgrupos.length} subgrupos`);

            return {
                success: true,
                message: 'Subgrupos SICOIN obtenidos exitosamente',
                data: allSubgrupos,
                total: allSubgrupos.length,
                user: request.user?.username || 'unknown'
            };

        } catch (error) {
            console.error('❌ Error consultando subgrupos:', error);

            return reply.status(500).send({
                success: false,
                error: 'Error interno del servidor'
            });
        }
    });

    // GET /api/subgrupos/:id - Obtener un subgrupo específico
    fastify.get<{ Params: { id: string } }>('/subgrupos/:id', async (request: AuthenticatedRequest, reply) => {
        try {
            const { id } = request.params;
            const subgrupoId = parseInt(id);

            if (isNaN(subgrupoId)) {
                return reply.status(400).send({
                    success: false,
                    error: 'ID de subgrupo inválido'
                });
            }

            const subgrupo = await db.select().from(subgrupos).where(eq(subgrupos.id, subgrupoId)).limit(1);

            if (subgrupo.length === 0) {
                return reply.status(404).send({
                    success: false,
                    error: 'Subgrupo no encontrado'
                });
            }

            return {
                success: true,
                data: subgrupo[0]
            };

        } catch (error) {
            console.error('❌ Error consultando subgrupo:', error);
            return reply.status(500).send({
                success: false,
                error: 'Error interno del servidor'
            });
        }
    });

    // GET /api/usuarios - Listar usuarios (solo admin)
    fastify.get('/usuarios', async (request: AuthenticatedRequest, reply) => {
        try {
            if (request.user?.rol !== 'INVENTARIOS') {
                return reply.status(403).send({
                    success: false,
                    error: 'Acceso denegado'
                });
            }

            const allUsuarios = await db.select({
                id: usuarios.id,
                nombre: usuarios.nombre,
                username: usuarios.username,
                rol: usuarios.rol,
                estado: usuarios.estado,
                created_at: usuarios.created_at
            }).from(usuarios);

            return {
                success: true,
                data: allUsuarios,
                total: allUsuarios.length
            };

        } catch (error) {
            console.error('❌ Error consultando usuarios:', error);
            return reply.status(500).send({
                success: false,
                error: 'Error interno del servidor'
            });
        }
    });
}