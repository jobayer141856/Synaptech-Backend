import type { AppRouteHandler } from '@/lib/types';

import { sql } from 'drizzle-orm';
import * as HSCode from 'stoker/http-status-codes';

import db from '@/db';
import { client } from '@/routes/lib/schema';

import type { ValueLabelRoute } from './routes';

export const valueLabel: AppRouteHandler<ValueLabelRoute> = async (c: any) => {
  const resultPromise = db.select({
    value: client.uuid,
    label: sql`client.name || ' (' || client.contact_name || ')'`.as('label'),
  })
    .from(client);

  const data = await resultPromise;

  return c.json(data, HSCode.OK);
};
