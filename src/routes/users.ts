import express from 'express';
import { db } from '../storage';
import { users } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

const router = express.Router();

router.post('/', async (req, res) => {
  const { username } = req.body;
  const user = await db.insert(users).values({ username }).returning();
  res.json(user[0]);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const user = await db.select().from(users).where(eq(users.id, id));
  res.json(user[0]);
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { username } = req.body;
  const updatedUser = await db
    .update(users)
    .set({ username })
    .where(eq(users.id, id))
    .returning();
  res.json(updatedUser[0]);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await db.delete(users).where(eq(users.id, id));
  res.json({ success: true });
});

export default router;
