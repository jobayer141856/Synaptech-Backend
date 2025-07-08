import { createRouter } from '@/lib/create_app';

import * as handlers from './handlers';
import * as routes from './routes';

const router = createRouter()
  .openapi(routes.profitSummary, handlers.profitSummary);

export default router;
