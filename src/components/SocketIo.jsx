import socketIOClient ,{ io } from 'socket.io-client';
import BASE_URL from '../config/api';

const socket = io('https://artflow.onrender.com'); // Replace with your server URL

export default socket;