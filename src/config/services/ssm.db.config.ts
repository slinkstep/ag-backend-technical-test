import { SSM } from '@aws-sdk/client-ssm';
import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { Admin, User, Campaign, Bet, Transaction } from 'sequelize/models';

// Loads DB connection parameters from SSM

export async function getDatabaseConfigFromSSM(): Promise<SequelizeModuleOptions> {
  // const ssm = new SSM({ region: 'us-east-1' });

  const ssm = new SSM();

  const parameters = [
    '/ag-backend-test/db/endpoint',
    '/ag-backend-test/db/name',
    '/ag-backend-test/db/password',
    '/ag-backend-test/db/port',
    '/ag-backend-test/db/username',
  ];

  const BATCH_SIZE = 10;
  const fullConfig = {};

  const batches = [];
  for (let i = 0; i < parameters.length; i += BATCH_SIZE) {
    batches.push(parameters.slice(i, i + BATCH_SIZE));
  }

  for (const batch of batches) {
    const response = await ssm.getParameters({
      Names: batch,
      WithDecryption: true,
    });

    response.Parameters?.forEach((param) => {
      const key = param.Name.split('/').pop() || param.Name;
      if (param.Value !== undefined) {
        fullConfig[key] = param.Value;
      }
    });
  }

  return {
    dialect: 'mysql',
    host: process.env['DB_HOST'] || fullConfig['endpoint'],
    port: parseInt(process.env['DB_PORT']) || parseInt(fullConfig['port'], 10),
    username: process.env['DB_USERNAME'] || fullConfig['username'],
    password: process.env['DB_PASSWORD'] || fullConfig['password'],
    database: process.env['DB_DATABASE'] || fullConfig['name'],
    models: [Admin, User, Campaign, Bet, Transaction],
    autoLoadModels: true,
    synchronize: false,
    logging: false,
  };
}
