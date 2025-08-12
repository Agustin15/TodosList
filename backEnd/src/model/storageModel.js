export class Storage {
  static limitStorage = 2 * Math.pow(10, 9); //8GB, 8 billones de bytes;
  #idUser;
  #limitStorageUser;
  #file;

  constructor(idUser, file) {
    this.propIdUser = idUser;
    this.propFile = file;
    this.#limitStorageUser = Storage.limitStorage;
  }
  set propIdUser(value) {
    if (typeof value != "number")
      throw new Error("Invalid idUser,it must be a number");
    this.#idUser = value;
  }
  get propIdUser() {
    return this.#idUser;
  }

  set propFile(value) {
    if (value == null) throw new Error("Invalid list files,it must be a list");
    this.#file = value;
  }
  get propFile() {
    return this.#file;
  }

  async calculateStorageFilesUsedByUser() {
    let bytesUsed = 0;

    try {
      const files = await this.#getFilesByIdUser();
      if (files.length > 0) {
        bytesUsed = files.reduce((ac, file) => {
          return (ac += file.fileTask.length);
        }, 0);
      }

      return {
        bytesUsed: bytesUsed,
        limitSize: this.#limitStorageUser
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async #getFilesByIdUser() {
    try {
      const filesUser = await this.propFile.getAllFilesUser(this.propIdUser);
      return filesUser;
    } catch (error) {
      throw new Error(error);
    }
  }
}
