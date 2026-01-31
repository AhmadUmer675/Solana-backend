import 'dotenv/config';
import app from './app';
import { sequelize, testDbConnection } from './config/db';
import { Token } from './models/Token';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

async function start(): Promise<void> {
  const dbOk = await testDbConnection();
  if (!dbOk) {
    console.error('Exiting: database connection failed.');
    process.exit(1);
  }

  await Token.sync({ alter: process.env.NODE_ENV !== 'production' });

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
