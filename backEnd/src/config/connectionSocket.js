import { Server } from "socket.io";

export class ConnectionSocket {
  socket;
  io;
  constructor(server) {
    this.io = new Server(server, {
      cors: {
        origin: "http://localhost:5173"
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
