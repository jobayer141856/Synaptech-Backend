import type { AppRouteHandler } from '@/lib/types';

import * as HSCode from 'stoker/http-status-codes';

import db from '@/db';
import { loan } from '@/routes/lib/schema';

import type { ValueLabelRoute } from './routes';

export const valueLabel: AppRouteHandler<ValueLabelRoute> = async (c: any) => {
  const resultPromise = db.select({
    value: loan.uuid,
    label: loan.lender_name,
  })
    .from(loan);

  const data = await resultPromise;

  return c.json(data, HSCode.OK);
};
