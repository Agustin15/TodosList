import { Server } from "socket.io";
export class ConnectionSocket {
  socket;
  io;
  constructor(server) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.LOCALHOST_URL_FRONT
      }
    });
  }

  get propSocket() {
    return this.socket;
  }
  set propSocket(value) {
    this.socket = value;
  }
}
