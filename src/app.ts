import express from 'express';
import usersRouter from './routes/users';
import boardsRouter from './routes/boards';
import movesRouter from './routes/moves';
import collaboratorsRouter from './routes/collaborators';

const app = express();
app.use(express.json());

app.use('/api/users', usersRouter);
app.use('/api/boards', boardsRouter);
app.use('/api/moves', movesRouter);
app.use('/api/collaborators', collaboratorsRouter);

export default app;
