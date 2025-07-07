import type { AppRouteHandler } from '@/lib/types';

import { desc, eq } from 'drizzle-orm';
import * as HSCode from 'stoker/http-status-codes';

import db from '@/db';
import * as hrSchema from '@/routes/hr/schema';
import { createToast, DataNotFound, ObjectNotFound } from '@/utils/return';

import type { CreateRoute, GetOneRoute, ListRoute, PatchRoute, RemoveRoute } from './routes';

import { vendor } from '../schema';

export const create: AppRouteHandler<CreateRoute> = async (c: any) => {
  const value = c.req.valid('json');

  const [data] = await db.insert(vendor).values(value).returning({
    name: vendor.name,
  });

  return c.json(createToast('create', data.name), HSCode.OK);
};

export const patch: AppRouteHandler<PatchRoute> = async (c: any) => {
  const { uuid } = c.req.valid('param');
  const updates = c.req.valid('json');

  if (Object.keys(updates).length === 0)
    return ObjectNotFound(c);

  const [data] = await db.update(vendor)
    .set(updates)
    .where(eq(vendor.uuid, uuid))
    .returning({
      name: vendor.name,
    });

  if (!data)
    return DataNotFound(c);

  return c.json(createToast('update', data.name), HSCode.OK);
};

export const remove: AppRouteHandler<RemoveRoute> = async (c: any) => {
  const { uuid } = c.req.valid('param');

  const [data] = await db.delete(vendor)
    .where(eq(vendor.uuid, uuid))
    .returning({
      name: vendor.name,
    });

  if (!data)
    return DataNotFound(c);

  return c.json(createToast('delete', data.name), HSCode.OK);
};

export const list: AppRouteHandler<ListRoute> = async (c: any) => {
  const resultPromise = db.select({
    uuid: vendor.uuid,
    id: vendor.id,
    name: vendor.name,
    phone: vendor.phone,
    address: vendor.address,
    purpose: vendor.purpose,
    starting_date: vendor.starting_date,
    ending_date: vendor.ending_date,
    product_type: vendor.product_type,
    created_by: vendor.created_by,
    created_by_name: hrSchema.users.name,
    created_at: vendor.created_at,
    updated_at: vendor.updated_at,
    remarks: vendor.remarks,
  })
    .from(vendor)
    .leftJoin(hrSchema.users, eq(vendor.created_by, hrSchema.users.uuid))
    .orderBy(desc(vendor.created_at));

  const data = await resultPromise;

  if (!data)
    return DataNotFound(c);

  return c.json(data || [], HSCode.OK);
};

export const getOne: AppRouteHandler<GetOneRoute> = async (c: any) => {
  const { uuid } = c.req.valid('param');

  // const data = await db.query.vendor.findFirst({
  //   where(fields, operators) {
  //     return operators.eq(fields.uuid, uuid);
  //   },
  // });

  const resultPromise = db.select({
    uuid: vendor.uuid,
    id: vendor.id,
    name: vendor.name,
    phone: vendor.phone,
    address: vendor.address,
    purpose: vendor.purpose,
    starting_date: vendor.starting_date,
    ending_date: vendor.ending_date,
    product_type: vendor.product_type,
    created_by: vendor.created_by,
    created_by_name: hrSchema.users.name,
    created_at: vendor.created_at,
    updated_at: vendor.updated_at,
    remarks: vendor.remarks,
  })
    .from(vendor)
    .leftJoin(hrSchema.users, eq(vendor.created_by, hrSchema.users.uuid))
    .where(eq(vendor.uuid, uuid));

  const data = await resultPromise;

  if (!data)
    return DataNotFound(c);

  return c.json(data || {}, HSCode.OK);
};
