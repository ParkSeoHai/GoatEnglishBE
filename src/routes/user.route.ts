import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c, next) => {
    return c.json('USER API');
})

export default app