import { Socket } from "socket.io";
import { IUser } from "./models";

export interface ServerToClientEvents {
  userUpdate: (user: IUser) => void;
  error: (error: string) => void;
}

export interface ClientToServerEvents {
  updateStatus: (status: IUser["status"]) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  user: IUser;
}

export type AppSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>; 