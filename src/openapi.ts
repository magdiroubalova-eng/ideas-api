import { STATUSES } from './schemas';

export const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Ideas API',
    version: '1.0.0',
    description: 'A small REST API for storing and managing ideas.',
  },
  servers: [{ url: 'http://localhost:3000' }],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer' },
    },
    schemas: {
      Idea: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          title: { type: 'string', example: 'Build my own API' },
          description: { type: 'string', nullable: true, example: 'A portfolio project' },
          status: { type: 'string', enum: STATUSES, example: STATUSES[0] },
          created_at: { type: 'string', format: 'date-time' },
        },
      },
      IdeaInput: {
        type: 'object',
        required: ['title'],
        properties: {
          title: { type: 'string', minLength: 1, maxLength: 200 },
          description: { type: 'string', maxLength: 2000 },
          status: { type: 'string', enum: STATUSES },
        },
      },
      Error: {
        type: 'object',
        properties: {
          error: { type: 'string' },
          details: {
            type: 'array',
            items: {
              type: 'object',
              properties: { field: { type: 'string' }, message: { type: 'string' } },
            },
          },
        },
      },
    },
  },
  paths: {
    '/health': {
      get: { summary: 'Health check', responses: { '200': { description: 'API is alive' } } },
    },
    '/ideas': {
      get: {
        summary: 'List ideas',
        parameters: [
          { name: 'status', in: 'query', schema: { type: 'string', enum: STATUSES } },
          { name: 'sort', in: 'query', schema: { type: 'string', enum: ['id', 'title', 'created_at'], default: 'id' } },
          { name: 'order', in: 'query', schema: { type: 'string', enum: ['asc', 'desc'], default: 'asc' } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10, maximum: 100 } },
          { name: 'offset', in: 'query', schema: { type: 'integer', default: 0 } },
        ],
        responses: {
          '200': { description: 'A list of ideas', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Idea' } } } } },
          '400': { description: 'Invalid query', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
      post: {
        summary: 'Create an idea',
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/IdeaInput' } } } },
        responses: {
          '201': { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Idea' } } } },
          '400': { description: 'Validation failed', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          '401': { description: 'Authentication required' },
        },
      },
    },
    '/ideas/{id}': {
      get: {
        summary: 'Get one idea',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          '200': { description: 'The idea', content: { 'application/json': { schema: { $ref: '#/components/schemas/Idea' } } } },
          '400': { description: 'Invalid id' },
          '404': { description: 'Not found' },
        },
      },
      put: {
        summary: 'Update an idea',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/IdeaInput' } } } },
        responses: {
          '200': { description: 'Updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/Idea' } } } },
          '400': { description: 'Validation failed' },
          '401': { description: 'Authentication required' },
          '404': { description: 'Not found' },
        },
      },
      delete: {
        summary: 'Delete an idea',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          '204': { description: 'Deleted' },
          '400': { description: 'Invalid id' },
          '401': { description: 'Authentication required' },
          '404': { description: 'Not found' },
        },
      },
    },
  },
};