import express from 'express';
import { db } from '../storage';
import { collaborators } from '../drizzle/schema';
import { eq, and } from 'drizzle-orm';

const router = express.Router();

router.post('/', async (req, res) => {
  const { boardId, userId } = req.body;
  const collab = await db.insert(collaborators).values({ boardId, userId }).returning();
  res.json(collab[0]);
});

router.get('/:boardId', async (req, res) => {
  const { boardId } = req.params;
  const collabs = await db.select().from(collaborators).where(eq(collaborators.boardId, boardId));
  res.json(collabs);
});

router.delete('/:boardId/:userId', async (req, res) => {
  const { boardId, userId } = req.params;
  await db.delete(collaborators).where(and(eq(collaborators.boardId, boardId), eq(collaborators.userId, userId)));
  res.json({ success: true });
});

export default router;
