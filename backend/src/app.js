import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import authRoutes from './routes/authRoutes.js';
import assetRoutes from './routes/assetRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

const openApiSpec = {
	openapi: '3.0.3',
	info: {
		title: 'AssetTrackPro API',
		version: '1.0.0',
		description: 'API documentation for AssetTrackPro backend services.'
	},
	servers: [
		{ url: 'http://localhost:5000' }
	],
	tags: [
		{ name: 'Health' },
		{ name: 'Auth' },
		{ name: 'Assets' },
		{ name: 'Employees' }
	],
	components: {
		securitySchemes: {
			bearerAuth: {
				type: 'http',
				scheme: 'bearer',
				bearerFormat: 'JWT'
			}
		}
	},
	paths: {
		'/': {
			get: {
				tags: ['Health'],
				summary: 'API health check',
				responses: {
					200: {
						description: 'Service is available.'
					}
				}
			}
		},
		'/api/auth/register': {
			post: {
				tags: ['Auth'],
				summary: 'Register a new user'
			}
		},
		'/api/auth/login': {
			post: {
				tags: ['Auth'],
				summary: 'Authenticate user and return tokens'
			}
		},
		'/api/auth/refresh': {
			post: {
				tags: ['Auth'],
				summary: 'Refresh access token'
			}
		},
		'/api/auth/logout': {
			post: {
				tags: ['Auth'],
				summary: 'Invalidate current refresh token'
			}
		},
		'/api/auth/me': {
			get: {
				tags: ['Auth'],
				summary: 'Get current authenticated user',
				security: [{ bearerAuth: [] }]
			}
		},
		'/api/auth/change-password': {
			post: {
				tags: ['Auth'],
				summary: 'Change authenticated user password',
				security: [{ bearerAuth: [] }]
			}
		},
		'/api/assets': {
			get: {
				tags: ['Assets'],
				summary: 'List assets',
				security: [{ bearerAuth: [] }]
			},
			post: {
				tags: ['Assets'],
				summary: 'Create asset',
				security: [{ bearerAuth: [] }]
			}
		},
		'/api/assets/{id}': {
			get: {
				tags: ['Assets'],
				summary: 'Get asset by id',
				security: [{ bearerAuth: [] }]
			},
			put: {
				tags: ['Assets'],
				summary: 'Update asset by id',
				security: [{ bearerAuth: [] }]
			},
			delete: {
				tags: ['Assets'],
				summary: 'Delete asset by id',
				security: [{ bearerAuth: [] }]
			}
		},
		'/api/employees': {
			get: {
				tags: ['Employees'],
				summary: 'List employees',
				security: [{ bearerAuth: [] }]
			}
		},
		'/api/employees/create': {
			post: {
				tags: ['Employees'],
				summary: 'Create employee',
				security: [{ bearerAuth: [] }]
			}
		},
		'/api/employees/organizations': {
			get: {
				tags: ['Employees'],
				summary: 'List organizations for employee form',
				security: [{ bearerAuth: [] }]
			}
		}
	}
};

// --- CORS ---------------------------------------------------------------------
app.use(cors());

// --- Body parsers -------------------------------------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- API docs ----------------------------------------------------------------
app.get('/api-docs.json', (_req, res) => res.json(openApiSpec));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));

// --- Routes -------------------------------------------------------------------
app.get('/', (_req, res) => res.json({ message: 'AssetTrackPro API v2' }));
app.use('/api/auth', authRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/employees', employeeRoutes);

// --- Global error handler -----------------------------------------------------
app.use(errorHandler);

export default app;
