import { DataSource } from 'typeorm';

const connectWithRetry = async (
  dataSourceOptions,
  maxRetries = 5,
  retryDelay = 5000,
) => {
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const dataSource = new DataSource(dataSourceOptions);
      await dataSource.initialize();
      console.log('Database connection established');
      return dataSource;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      retries++;
      console.log(
        `Database connection failed, retry ${retries}/${maxRetries}...`,
      );
      await new Promise((res) => setTimeout(res, retryDelay));
    }
  }

  throw new Error('Failed to connect to the database after retries');
};

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      return connectWithRetry({
        type: 'mysql',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT, 10),
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities: [__dirname + '/entities/*.entity{.ts,.js}'],
        //migrations: [__dirname + 'entities/*.entity{.ts,.js}'],
        synchronize: false,
        logging: true,
        logger: 'advanced-console',
      });
    },
  },
];
