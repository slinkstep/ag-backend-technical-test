import { SSM } from '@aws-sdk/client-ssm';
import { ConfigFactory } from '@nestjs/config';

// Load constant parameters into the global config service of the app
// to avoid async operations when we use them

export async function getConstSSMEnvConfig(): Promise<ConfigFactory> {
  const ssm = new SSM({ region: 'us-east-1' });
  const parameters = [
    '/ag-backend-test/firebase/firebaseCredentials',
    '/ag-backend-test/firebase/firebaseApiKey',
    '/ag-backend-test/auth/authSecret',
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

  return fullConfig as ConfigFactory;
}
