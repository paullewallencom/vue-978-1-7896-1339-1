
const Koa = require('koa')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const websockify = require('koa-websocket')
const route = require('koa-route')
const bodyParser = require('koa-bodyparser')
const cors = require('@koa/cors')
const Database = require('better-sqlite3')

const update = require('../db/update')

const db = new Database('./db/database.db');

const app = new Koa()
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(app.env === 'production')

async function start() {
  let ws = null
  const app2 = websockify(new Koa())
  app2.use(cors());
  app2.ws.use(route.all('/', function (ctx) {
    ws = ctx.websocket
  }));
  app2.listen(9999)

  // Instantiate nuxt.js
  const nuxt = new Nuxt(config)

  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  app.use(bodyParser())

  const feedUpdate = () => {
    update(db);
    if (ws) {
      ws.send(JSON.stringify({
        event: 'feedsUpdated'
      }));
    }
  };

  setInterval(feedUpdate, 60 * 60 * 1000);

  app.use(route.get('/api/update', (ctx) => {
    feedUpdate();
    ctx.body = { ok: true };
  }));

  app.use(route.get('/api/feeds', (ctx) => {
    ctx.body = db
      .prepare('SELECT * FROM feeds')
      .all();
  }));

  app.use(route.post('/api/feeds', (ctx) => {
    const { name, url } = ctx.request.body;

    db
      .prepare('INSERT INTO feeds VALUES (NULL, ?, ?)')
      .run(name, url);

    feedUpdate();

    ctx.body = {
      ok: true,
    };
  }));

  app.use(route.get('/api/feeds/query', (ctx) => {
    const re = new RegExp(ctx.request.query.q, 'i');
    ctx.body = db
      .prepare('SELECT * FROM articles')
      .all()
      .filter(a => {
        return re.test(a.contentSnippet);
      });
  }));

  app.use(route.get('/api/feeds/:id', (ctx) => {
    const found = ctx.request.url.match(/\/(\d+)$/);
    if (found) {
      const [ group, id ] = found;
      ctx.body = db
        .prepare('SELECT * FROM articles WHERE feed_id=?')
        .all(id);
    }
  }));

  app.use(ctx => {
    ctx.status = 200 // koa defaults to 404 when it sees that status is unset

    return new Promise((resolve, reject) => {
      ctx.res.on('close', resolve)
      ctx.res.on('finish', resolve)
      nuxt.render(ctx.req, ctx.res, promise => {
        // nuxt.render passes a rejected promise into callback on error.
        promise.then(resolve).catch(reject)
      })
    })
  })

  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}

start()
