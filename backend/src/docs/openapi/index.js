import { components } from './components.js';
import { paths } from './paths.js';

export const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'AssetTrackPro API',
    version: '1.0.0',
    description: 'API documentation for AssetTrackPro backend services.'
  },
  servers: [{ url: 'http://localhost:5000' }],
  tags: [
    { name: 'Health' },
    { name: 'Auth' },
    { name: 'Assets' },
    { name: 'Organizations' },
    { name: 'Branches' },
    { name: 'Employees' }
  ],
  components,
  paths
};
