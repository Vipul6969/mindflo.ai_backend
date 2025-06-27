import express from 'express';
import { db } from '../storage';
import { boards } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

const router = express.Router();

router.post('/', async (req, res) => {
  const { name, createdBy } = req.body;
  const board = await db.insert(boards).values({ name, createdBy }).returning();
  res.json(board[0]);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const board = await db.select().from(boards).where(eq(boards.id, id));
  res.json(board[0]);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await db.delete(boards).where(eq(boards.id, id));
  res.json({ success: true });
});

export default router;
