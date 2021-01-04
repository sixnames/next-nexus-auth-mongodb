import { NextApiRequest, NextApiResponse } from 'next';
import { createInitialData } from 'db/createInitialData';

async function createInitialDataHandler(_req: NextApiRequest, res: NextApiResponse) {
  const initialData = await createInitialData();
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(initialData));
}

export default createInitialDataHandler;
