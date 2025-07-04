import connection from "../config/database.js";

export class SubscriptionPush {
  async post(idUser, endpointURL, p256dh, auth) {
    try {
      const [result] = await connection.execute(
        "INSERT INTO subscription (idUser,endpointURL,p256dh,auth) values (?,?,?,?)",
        [idUser, endpointURL, p256dh, auth]
      );

      return result.affectedRows;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  async delete(endpointURL) {
    try {
      const [result] = await connection.execute(
        "delete from subscription where endpointURL=?",
        [endpointURL]
      );

      return result.affectedRows;
    } catch (error) {
      throw new Error(error);
    }
  }
  async getSubscriptionsByIdUser(idUser) {
    try {
      const [results] = await connection.execute(
        "select * from subscription where idUser=?",
        [idUser]
      );
      return results;
    } catch (error) {
      throw new Error(error);
    }
  }
  

  async getSubscriptionByEndpoint(endpointURL) {
    try {
      const [results] = await connection.execute(
        "select * from subscription where endpointURL=?",
        [endpointURL]
      );
      return results;
    } catch (error) {
      throw new Error(error);
    }
  }
}
