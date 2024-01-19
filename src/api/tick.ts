import io from 'socket.io-client';

const socket = io('wss://quotes.equidity.io:3000' , {
  transports: ['websocket']
});

socket.on('connect', () => {
  console.log('Connected to external WebSocket server');
  socket.emit('subscribe', 'feeds');
});

socket.on('feeds', (feeds: string[]) => {
  console.log('Received feeds:', feeds);
});

socket.on('error', (err: Error) => {
  console.error('Error:', err.message);
});

socket.on('disconnect', () => {
  console.log('Disconnected from external WebSocket server');
});