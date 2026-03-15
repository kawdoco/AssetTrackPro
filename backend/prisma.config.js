module.exports = {
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/assettrackpro_dev?schema=public',
    },
  },
};
