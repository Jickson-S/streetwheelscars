import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req,res)=> res.send('API running'));

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

io.on('connection', socket => {
  console.log('socket connected:', socket.id);
  socket.on('disconnect', ()=> console.log('socket disconnected'));
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, ()=> console.log('Server on', PORT));
