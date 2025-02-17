import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { poweredBy } from 'hono/powered-by';
import { secureHeaders } from 'hono/secure-headers';
import { compress } from 'hono/compress';

import routers from './routes/index.js';

import instanceMongoDb from './db/mongo.js';

const app = new Hono();

// Middleware
app.use('*', poweredBy()); // Tương tự helmet (thêm header X-Powered-By)
app.use('*', logger()); // Thay thế morgan
app.use('*', secureHeaders()); // Tương tự helmet
app.use('*', compress()); // Tương tự compression
app.use('*', cors()); // CORS

// connect db
instanceMongoDb.getConnection();

// router
app.route('/api', routers);

export default app;
