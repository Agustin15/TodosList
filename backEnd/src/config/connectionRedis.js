import { Queue } from "bullmq";

class ConnectionRedis {
  #host;
  #port;
  #password;
  #notificationQueue;

  constructor() {
    this.#host = process.env.HOST_REDIS;
    this.#port = process.env.PORT_REDIS;
    this.#password = process.env.PASSWORD_REDIS;
  }

  get propHost() {
    return this.#host;
  }
  set propHost(value) {
    if (!value || value.length == 0)
      throw new Error("Redis host can not be empty");
    this.#host = value;
  }

  get propPort() {
    return this.#port;
  }

  set propPort(value) {
    if (!value) throw new Error("Redis port can not be empty");
    this.#port = value;
  }

  get propPassword() {
    return this.#password;
  }

  set propPassword(value) {
    if (!value || value.length == 0)
      throw new Error("Redis password can not be empty");
    this.#password = value;
  }

  get propNotificationQueue() {
    return this.#notificationQueue;
  }
  set propNotificationQueue(value) {
    this.#notificationQueue = value;
  }

  createQueue = () => {
    try {
      this.propNotificationQueue = new Queue("notifications", {
        connection: {
          host: this.propHost,
          port: this.propPort,
          password: this.propPassword
        }
      });
    } catch (error) {
      throw error;
    }
  };
}

export const redisConnection = new ConnectionRedis();
redisConnection.createQueue();
