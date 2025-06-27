import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../storage';
import { moves, collaborators } from '../drizzle/schema';
import { eq, and, desc } from 'drizzle-orm';

export function registerSocketEvents(io: Server) {
  io.on('connection', (socket) => {
    let currentBoardId: string | null = null;
    let currentUserId: string | null = null;

    socket.on('join_room', async ({ boardId, userId, username }) => {
      currentBoardId = boardId;
      currentUserId = userId;
      socket.join(boardId);

      await db.insert(collaborators).values({ boardId, userId }).onConflictDoNothing();

      const boardMoves = await db.select().from(moves).where(eq(moves.boardId, boardId));
      socket.emit('room', { moves: boardMoves });

      socket.broadcast.to(boardId).emit('new_user', userId, username);
    });

    socket.on('draw', async (move) => {
      if (!currentBoardId || !currentUserId) return;
      const moveId = uuidv4();
      const moveObj = {
        id: moveId,
        boardId: currentBoardId,
        userId: currentUserId,
        data: JSON.stringify(move),
      };
      await db.insert(moves).values(moveObj);
      io.to(currentBoardId).emit('user_draw', { ...move, id: moveId }, currentUserId);
    });

    socket.on('undo', async () => {
      if (!currentBoardId || !currentUserId) return;
      const [lastMove] = await db
        .select()
        .from(moves)
        .where(and(eq(moves.boardId, currentBoardId), eq(moves.userId, currentUserId)))
        .orderBy(desc(moves.createdAt))
        .limit(1);
      if (lastMove) {
        await db.delete(moves).where(eq(moves.id, lastMove.id));
        io.to(currentBoardId).emit('user_undo', currentUserId);
      }
    });

    socket.on('mouse_move', (x, y) => {
      if (currentBoardId && currentUserId)
        socket.broadcast.to(currentBoardId).emit('mouse_moved', x, y, currentUserId);
    });

    socket.on('send_msg', (msg) => {
      if (currentBoardId && currentUserId)
        io.to(currentBoardId).emit('new_msg', currentUserId, msg);
    });

    socket.on('leave_room', async () => {
      if (currentBoardId && currentUserId) {
        socket.leave(currentBoardId);
        await db.delete(collaborators).where(and(eq(collaborators.boardId, currentBoardId), eq(collaborators.userId, currentUserId)));
        io.to(currentBoardId).emit('user_disconnected', currentUserId);
      }
    });

    socket.on('disconnecting', async () => {
      if (currentBoardId && currentUserId) {
        await db.delete(collaborators).where(and(eq(collaborators.boardId, currentBoardId), eq(collaborators.userId, currentUserId)));
        io.to(currentBoardId).emit('user_disconnected', currentUserId);
      }
    });
  });
}