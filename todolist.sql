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
created datetime not null,
lastModified datetime,
CONSTRAINT check_name CHECK(REGEXP_LIKE(nameUser,'^[A-Za-z]')),
CONSTRAINT check_lastname CHECK(REGEXP_LIKE(lastname,'^[A-Za-z]')),
CONSTRAINT check_email CHECK(REGEXP_LIKE(email,'^[A-Za-z0-9]+@[a-z]+\\.[a-zA-Z]'))
);

CREATE TABLE rols_users(
idRol int, 
idUser int,
PRIMARY KEY(idRol,idUser),
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
datetimeUpload datetime not null,
fileTask mediumblob not null,
idTask int not null,
CONSTRAINT fk_idTask FOREIGN KEY(idTask) REFERENCES tasks(idTask) ON DELETE CASCADE
);


CREATE TABLE subscriptions(
endpointURL varchar(200) NOT NULL primary key,
p256dh varchar(100) NOT NULL,
auth varchar(50) NOT NULL,
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
idUser int not null,
CONSTRAINT fk_idUserVerification FOREIGN KEY(idUser) REFERENCES users(idUser) ON DELETE CASCADE,
CONSTRAINT check_enabled CHECK(enabled=1 OR enabled=0)
);

CREATE TABLE verifications_code(
codeOfVerification varchar(60) primary key,
expirationTime bigint not null,
idVerification int not null,
CONSTRAINT fk_idVerification FOREIGN KEY(idVerification) REFERENCES verifications_two_step(idVerification)
);

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

CREATE TRIGGER check_datetimeUpload BEFORE INSERT ON files
FOR EACH ROW 
BEGIN
IF NEW.datetimeUpload<CURDATE() or NEW.datetimeUpload>CURDATE() THEN
 SIGNAL SQLSTATE '45000'
 SET MESSAGE_TEXT = "La fecha de subida del archivo debe ser igual a la fecha actual";
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

INSERT INTO rols (rol) VALUE("Admin");
INSERT INTO rols (rol) VALUE("User");
