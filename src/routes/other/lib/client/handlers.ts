import type { AppRouteHandler } from '@/lib/types';

import * as HSCode from 'stoker/http-status-codes';

import db from '@/db';
import { client } from '@/routes/lib/schema';

import type { ValueLabelRoute } from './routes';

export const valueLabel: AppRouteHandler<ValueLabelRoute> = async (c: any) => {
  const resultPromise = db.select({
    value: client.uuid,
    label: client.name,
  })
    .from(client);

  const data = await resultPromise;

  return c.json(data, HSCode.OK);
};
