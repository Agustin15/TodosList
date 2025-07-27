export class Storage {
  static limitStorage = 8 * Math.pow(10, 9); //8GB, 8 billones de bytes;
  #idUser;
  #limitStorageUser;
  #files = [];

  constructor(idUser, files) {
    this.propIdUser = idUser;
    this.propFiles = files;
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

  set propFiles(value) {
    if (!Array.isArray(value))
      throw new Error("Invalid list files,it must be a list");
    this.#files = value;
  }
  get propFiles() {
    return this.#files;
  }

  async calculateStorageFilesUsedByUser() {
    let bytesUsed = 0;

    try {
      if (this.propFiles.length > 0) {
        bytesUsed = this.propFiles.reduce((ac, file) => {
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
}
