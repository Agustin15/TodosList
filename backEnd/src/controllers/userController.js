import bcrypt from "bcrypt";
import { UserModel } from "../model/userModel.js";
import authRequest from "../auth/auth.js";

export const createUser = async (req, res) => {
  try {
    const userToAdd = req.body;
    const userFoundByEmail = await findUserByEmail(userToAdd.email);

    if (userFoundByEmail.length > 0) {
      throw new Error("Email is already taken");
    }

    const saltRounds = 10;
    bcrypt.hash(userToAdd.password, saltRounds, async (err, hash) => {
      if (err) {
        throw new Error({ messageError: "Internal server error" });
      }

      userToAdd.password = hash;
      const userCreated = await UserModel.addUser(
        userToAdd.name,
        userToAdd.lastname,
        userToAdd.email,
        userToAdd.password
      );
      res.status(201).json(userCreated);
    });
  } catch (error) {
    res.status(500).json({ messageError: error.message });
  }
};

export const getUserByEmail = async (req, res) => {
  try {
    const email = req.params.email;
    const userFound = await UserModel.getUserByEmail(email);
    res.status(200).json(userFound);
  } catch (error) {
    res.status(502).json({ messageError: error.message });
  }
};

export const findUserByEmail = async (email) => {
  try {
    const userFound = await UserModel.getUserByEmail(email);
    return userFound;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const findUserByIdUser = async (idUser) => {
  try {
    const userFound = await UserModel.getUserById(idUser);
    return userFound;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getUserDataByToken = async (req, res) => {
  let errorCodeResponse = 404;
  try {
    const validAuth = await authRequest(req, res);

    if (!validAuth) {
      errorCodeResponse = 401;
      throw new Error("Invalid Authentication");
    }

    let userFound = await findUserByIdUser(validAuth.idUser);
    res.status(200).json(userFound[0]);
  } catch (error) {
    res.status(errorCodeResponse).json({ messageError: error.message });
  }
};

export const updatePasswordUserByEmail = async (req, res) => {
  try {
    const mail = req.params.mail;
    const newPassword = req.body.password;

    if (req.body.currentPassword) {
      const currentPassword = req.body.currentPassword;
      const userFound = await findUserByEmail(mail);
      if (userFound) {
        const passwordVerify = await bcrypt.compare(
          currentPassword,
          userFound.password
        );

        if (!passwordVerify) {
          throw new Error("Invalid current password");
        }
      }
    }

    const decodeTokenAuth = authRequest(req);

    if (decodeTokenAuth) {
      bcrypt.hash(newPassword, 10, async (err, hash) => {
        if (err) {
          throw new Error({ messageError: "Internal server error" });
        }

        const userUpdated = await UserModel.updatePasswordUserByEmail(
          hash,
          mail
        );

        res.status(200).json(userUpdated);
      });
    }
  } catch (error) {
    res.status(502).json({ messageError: error.message });
  }
};

export const updateUserById = async (req, res) => {
  try {
    let result = false;
    const idUser = req.params.id;
    const { name, lastname } = req.body;
    const userFound = await findUserByIdUser(idUser);
    if (!userFound.length > 0) {
      throw new Error("User not found");
    }
    const validAuth = await authRequest(req, res);

    if (!validAuth) {
      throw new Error("Invalid Authentication");
    }

    const userUpdated = await UserModel.updateUser(
      name,
      lastname,
      userFound[0].email,
      userFound[0].passwordUser,
      userFound[0].idUser
    );

    if (userUpdated) {
      result = true;
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(502).json({ messageError: error.message });
  }
};

// export const updateEmailUser = async (req, res) => {
//   const secretTokenKey = process.env.JWT_SECRET_KEY;
//   const emailCurrent = req.params.email;
//   const newEmail = req.body.newEmail;
//   const password = req.body.password;

//   try {
//     const userFoundExisted = await findUserByEmail(newEmail);

//     if (userFoundExisted) {
//       throw new Error("Updated failed, email in use");
//     }

//     const currentUser = await findUserByEmail(emailCurrent);
//     const validAuth = authRequest(req);
//     if (validAuth) {
//       const passwordVerify = await bcrypt.compare(
//         password,
//         currentUser.password
//       );

//       if (!passwordVerify) {
//         throw new Error("Updated failed, invalid password");
//       } else {
//         const userUpdated = await UserModel.updateOne(
//           { email: emailCurrent },
//           {
//             $set: { email: newEmail }
//           }
//         );

//         if (userUpdated) {
//           const tasksOfUserUpdated = await updateUserOfAllTasks(
//             emailCurrent,
//             newEmail
//           );
//           if (tasksOfUserUpdated) {
//             const token = jwt.sign({ email: newEmail }, secretTokenKey, {
//               expiresIn: "1h"
//             });

//             res.status(200).json(token);
//           }
//         }
//       }
//     }
//   } catch (error) {
//     res.status(500).json({ messageError: error.message });
//   }
// };
