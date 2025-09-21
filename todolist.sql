CREATE DATABASE IF NOT EXISTS todolist;
use todolist;

CREATE TABLE rols(
idRol int primary key auto_increment, 
rol varchar(5) not null unique,
CONSTRAINT check_rol CHECK(rol in ("Admin","User"))
);

CREATE TABLE users(
idUser int primary key auto_increment,
nameUser varchar(20) not null,
lastname varchar(20) not null,
email varchar(30) not null unique,
passwordUser varchar(60) not null,
created datetime default current_timestamp not null,
lastModified  datetime default current_timestamp on update current_timestamp,
CONSTRAINT check_name CHECK(REGEXP_LIKE(nameUser,'^[A-Za-z]')),
CONSTRAINT check_lastname CHECK(REGEXP_LIKE(lastname,'^[A-Za-z]')),
CONSTRAINT check_email CHECK(REGEXP_LIKE(email,'^[A-Za-z0-9]+@[a-z]+\\.[a-zA-Z]'))
);

CREATE TABLE rols_users(
idRolUser int primary key auto_increment,
idRol int, 
idUser int,
CONSTRAINT fk_rol FOREIGN KEY(idRol) REFERENCES rols(idRol),
CONSTRAINT fk_userRol FOREIGN KEY(idUser) REFERENCES users(idUser)
);

CREATE TABLE tasks(
idTask int primary key auto_increment,
icon varchar(11) not null,
descriptionTask varchar(130) not null,
datetimeTask datetime not null,
isCompleted tinyint not null,
idUser int not null,
CONSTRAINT fk_idUser FOREIGN KEY(idUser) REFERENCES users(idUser) ON DELETE CASCADE,
CONSTRAINT check_isCompleted CHECK(isCompleted=1 OR isCompleted=0)
);

CREATE TABLE files(
idFile int primary key auto_increment,
nameFile varchar(50) not null,
typeFile varchar(50) not null,
datetimeUpload datetime default current_timestamp not null,
fileTask mediumblob not null,
idTask int not null,
CONSTRAINT fk_idTask FOREIGN KEY(idTask) REFERENCES tasks(idTask) ON DELETE CASCADE
);


CREATE TABLE subscriptions(
endpointURL varchar(200) NOT NULL primary key,
p256dh varchar(100) NOT NULL,
auth varchar(50) NOT NULL,
created datetime default current_timestamp NOT NULL,
idUser int NOT NULL,
CONSTRAINT fk_idUserSubscription FOREIGN KEY(idUser) REFERENCES users(idUser) ON DELETE CASCADE
);

CREATE TABLE notifications(
idNotification int primary key auto_increment,
datetimeSend datetime not null,
state varchar(7) not null,
idTask int not null,
CONSTRAINT fk_idTaskNotification FOREIGN KEY(idTask) REFERENCES tasks(idTask ) ON DELETE CASCADE,
CONSTRAINT check_state CHECK(state in("pending","seen","sent"))
);

CREATE TABLE scheduled_jobs(
idJob int primary key auto_increment,
idNotification int not null,
CONSTRAINT fk_idNotification FOREIGN KEY(idNotification) REFERENCES notifications(idNotification) ON DELETE CASCADE
);

CREATE TABLE notifications_subscription(
idNotification int,
endpointURL varchar(200),
PRIMARY KEY(idNotification,endpointURL),
CONSTRAINT fk_idNotificationSubscription FOREIGN KEY(idNotification) REFERENCES notifications(idNotification) 
ON DELETE CASCADE,
CONSTRAINT fk_endpointUrl FOREIGN KEY(endpointURL) REFERENCES subscriptions(endpointURL) ON DELETE CASCADE
);

CREATE TABLE verifications_two_step(
idVerification int primary key auto_increment,
enabled tinyint not null,
idRolUser int not null,
CONSTRAINT fk_idRolUser FOREIGN KEY(idRolUser) REFERENCES rols_users(idRolUser) ON DELETE CASCADE,
CONSTRAINT check_enabled CHECK(enabled=1 OR enabled=0)
);

CREATE TABLE verifications_code(
codeOfVerification varchar(60) primary key,
expirationTime bigint not null,
idVerification int not null,
CONSTRAINT fk_idVerification FOREIGN KEY(idVerification) REFERENCES verifications_two_step(idVerification)
);

/*PROCEDURES*/
delimiter // 
CREATE PROCEDURE AddRol(IN nameRol VARCHAR(5))
BEGIN
DECLARE errorFound INT default 0;
IF EXISTS (select * from rols where rol=nameRol) THEN
 SIGNAL SQLSTATE '45000'
 SET MESSAGE_TEXT = "Ya existe un rol con este nombre";
END IF;

INSERT INTO rols VALUES(nameRol);
SELECT COUNT(*) INTO errorFound FROM Errors;

IF @errorFound!=0 THEN
 SIGNAL SQLSTATE '45000'
 SET MESSAGE_TEXT = "Error inesperado al agregar rol";
END IF;
END
//delimiter ;

delimiter // 
CREATE PROCEDURE AddUser(IN paramNameUser VARCHAR(20),IN paramLastname VARCHAR(20),IN parmaEmail VARCHAR(30),
paramPasswordUser VARCHAR(60))
BEGIN
DECLARE errorFound INT default 0;

IF EXISTS (select * from users where email=paramEmail) THEN
SIGNAL SQLSTATE '45000'
 SET MESSAGE_TEXT = "Ya existe un usuario con este correo";
END IF;

INSERT INTO users VALUES(paramNameUser,paramLastname,paramEmail,paramPasswordUser);
SELECT COUNT(*) INTO errorFound FROM Errors;

IF @errorFound!=0 THEN
SIGNAL SQLSTATE '45000'
 SET MESSAGE_TEXT = "Error inesperado al agregar usuario";
END IF;
END
// delimiter ;


delimiter // 
CREATE PROCEDURE AddUserRol(IN paramIdRol INT,IN paramIdUser INT)
BEGIN
DECLARE errorFound INT default 0;

IF NOT EXISTS (select * from users where idUser=paramIdUser) THEN
 SIGNAL SQLSTATE '45000'
 SET MESSAGE_TEXT = "No se encontro el usuario ingresado";
END IF;

IF NOT EXISTS (select * from rols where idRol=paramIdRol) THEN
SIGNAL SQLSTATE '45000'
 SET MESSAGE_TEXT = "No se encontro el rol ingresado";
END IF;

IF EXISTS (select * from rols_users where idUser=paramIdUser and idRol=paramIdRol) THEN
SIGNAL SQLSTATE '45000'
 SET MESSAGE_TEXT = "El usuario ingresado ya tiene este rol";
END IF;

INSERT INTO rols_users VALUES(paramIdRol,paramIdUser);
SELECT COUNT(*) INTO errorFound FROM Errors;

IF @errorFound!=0 THEN
 SIGNAL SQLSTATE '45000'
 SET MESSAGE_TEXT = "Error inesperado al agregar rol del usuario";
END IF;
END
// delimiter ;

delimiter //
CREATE PROCEDURE checkDatetimeTask(IN datetimeTask DATETIME)
BEGIN
IF datetimeTask<=NOW() THEN
 SIGNAL SQLSTATE '45000'
 SET MESSAGE_TEXT = "La fecha de la tarea debe ser mayor a la fecha actual";
END IF;
END//
// delimiter ;

delimiter //
CREATE PROCEDURE checkDatetimeSend(IN datetimeSend DATETIME,IN idTask INT)
BEGIN
IF datetimeSend<=NOW() OR datetimeSend>(select datetimeTask from tasks where tasks.idTask=idTask) THEN
 SIGNAL SQLSTATE '45000'
 SET MESSAGE_TEXT = "La fecha de envio de la notificacion debe ser mayor a la fecha actual y no debe ser mayor a la 
 fecha de la tarea";
END IF;
END//
// delimiter ;

/*TRIGGERS*/

delimiter //
CREATE TRIGGER check_datetimeTask BEFORE INSERT ON tasks 
FOR EACH ROW CALL checkDatetimeTask(NEW.datetimeTask);
// delimiter ;

delimiter //
CREATE TRIGGER check_datetimeTaskUpdate BEFORE UPDATE ON tasks 
FOR EACH ROW 
BEGIN
IF OLD.datetimeTask!=NEW.datetimeTask THEN
CALL checkDatetimeTask(NEW.datetimeTask);
END IF;
END;
// delimiter ;

delimiter //
CREATE TRIGGER check_datetimeSend BEFORE INSERT ON notifications
FOR EACH ROW CALL checkDatetimeSend(NEW.datetimeSend,NEW.idTask);
// delimiter;

delimiter //
CREATE TRIGGER check_datetimeSendUpdate BEFORE UPDATE ON notifications
FOR EACH ROW 
BEGIN
IF OLD.datetimeSend!=NEW.datetimeSend THEN
CALL checkDatetimeSend(NEW.datetimeSend,OLD.idTask);
END IF;
END;
// delimiter ;

delimiter //
CREATE TRIGGER check_expirationTime BEFORE INSERT ON verifications_code
FOR EACH ROW
BEGIN
IF NEW.expirationTime<=(UNIX_TIMESTAMP(NOW())*1000)THEN
 SIGNAL SQLSTATE '45000'
 SET MESSAGE_TEXT = "La fecha en milisegundos de la expiracion del codigo de verificacion 
 debe ser mayor  a la fecha actual";
END IF;
END
// delimiter ;

CALL AddRol("Admin");
CALL AddRol("User");

