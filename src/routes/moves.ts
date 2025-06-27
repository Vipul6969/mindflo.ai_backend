import express from 'express';
import { db } from '../storage';
import { moves } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

const router = express.Router();

router.post('/', async (req, res) => {
  const { boardId, userId, data } = req.body;
  const move = await db.insert(moves).values({ boardId, userId, data: JSON.stringify(data) }).returning();
  res.json(move[0]);
});

router.get('/:boardId', async (req, res) => {
  const { boardId } = req.params;
  const boardMoves = await db.select().from(moves).where(eq(moves.boardId, boardId));
  res.json(boardMoves);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await db.delete(moves).where(eq(moves.id, id));
  res.json({ success: true });
});

export default router;
