CREATE DATABASE IF NOT EXISTS TODOLIST;
use TODOLIST;

CREATE TABLE users(
idUser int primary key auto_increment,
nameUser varchar(20) not null check(REGEXP_LIKE(nameUser,'^[A-Za-z]')),
lastname varchar(20) not null,
email varchar(30) not null unique,
passwordUser varchar(60) not null,
CONSTRAINT check_name CHECK(REGEXP_LIKE(nameUser,'^[A-Za-z]')),
CONSTRAINT check_lastname CHECK(REGEXP_LIKE(lastname,'^[A-Za-z]')),
CONSTRAINT check_email CHECK(REGEXP_LIKE(email,'^[A-Za-z0-9]+@[a-z]+\\.[a-zA-Z]'))
);

CREATE TABLE tasks(
idTask int primary key auto_increment,
icon varchar(11) not null,
descriptionTask varchar(130) not null,
datetimeTask datetime not null,
isCompleted tinyint not null,
idUser int not null,
CONSTRAINT fk_idUser FOREIGN KEY(idUser) REFERENCES users(idUser),
CONSTRAINT check_isCompleted CHECK(isCompleted=1 OR isCompleted=0),
CONSTRAINT check_idUserTasks CHECK(idUser>0)
);


CREATE TABLE files(
idFile int primary key auto_increment,
nameFile varchar(50) not null,
typeFile varchar(50) not null,
datetimeUpload datetime not null,
fileTask mediumblob not null,
idTask int not null,
CONSTRAINT fk_idTask FOREIGN KEY(idTask) REFERENCES tasks(idTask) ON DELETE CASCADE,
CONSTRAINT check_idTaskFiles CHECK(idTask>0)
);


CREATE TABLE subscriptions(
endpointURL varchar(200) NOT NULL primary key,
p256dh varchar(100) NOT NULL,
auth varchar(50) NOT NULL,
idUser int NOT NULL,
CONSTRAINT fk_idUserSubscription FOREIGN KEY(idUser) REFERENCES users(idUser) ON DELETE CASCADE,
CONSTRAINT check_idUserSubscriptions CHECK(idUser>0)
);

CREATE TABLE notifications(
idNotification int not null primary key auto_increment,
datetimeSend datetime not null,
state varchar(50) not null,
idTask int not null,
CONSTRAINT fk_idTaskNotification FOREIGN KEY(idTask) REFERENCES tasks(idTask ) ON DELETE CASCADE,
CONSTRAINT check_state CHECK(state LIKE "pending" OR state LIKE "seen" OR state LIKE "sent"),
CONSTRAINT check_idTaskNotifications CHECK(idTask>0)
);

CREATE TABLE scheduled_jobs(
idJob int not null primary key auto_increment,
idNotification int not null,
CONSTRAINT fk_idNotification FOREIGN KEY(idNotification) REFERENCES notifications(idNotification) ON DELETE CASCADE,
CONSTRAINT check_idNotification CHECK(idNotification>0)
);

CREATE TABLE notifications_subscription(
idNotification int not null,
endpointURL varchar(200) not null,
PRIMARY KEY(idNotification,endpointURL),
CONSTRAINT fk_idNotificationSubscription FOREIGN KEY(idNotification) REFERENCES notifications(idNotification) 
ON DELETE CASCADE,
CONSTRAINT fk_endpointUrl FOREIGN KEY(endpointURL) REFERENCES subscriptions(endpointURL) ON DELETE CASCADE,
CONSTRAINT check_idNotificationSubscriptions CHECK(idNotification>0)
);


CREATE TABLE verifications_two_step(
idVerification int not null primary key auto_increment,
enabled tinyint not null,
idUser int not null,
CONSTRAINT fk_idUserVerification FOREIGN KEY(idUser) REFERENCES users(idUser) ON DELETE CASCADE,
CONSTRAINT check_enabled CHECK(enabled=1 OR enabled=0),
CONSTRAINT check_userVerifications CHECK(idUser>0)
);

CREATE TABLE verifications_code(
codeOfVerification varchar(60) not null primary key,
expirationTime bigint not null,
idVerification int not null,
CONSTRAINT fk_idVerification FOREIGN KEY(idVerification) REFERENCES verifications_two_step(idVerification),
CONSTRAINT check_expirationTime CHECK(expirationTime>0),
CONSTRAINT check_idVerification CHECK(idVerification>0)
);

delimiter //
CREATE TRIGGER check_datetimeTask BEFORE INSERT ON tasks 
FOR EACH ROW 
BEGIN
IF NEW.datetimeTask<=CURDATE() THEN
 SIGNAL SQLSTATE '45000'
 SET MESSAGE_TEXT = "La fecha de la tarea debe ser mayor a la actual";
END IF;
END;
// delimiter ;


delimiter //
CREATE TRIGGER check_datetimeSend BEFORE INSERT ON notifications
FOR EACH ROW 
BEGIN
IF NEW.datetimeSend<=CURDATE() THEN
 SIGNAL SQLSTATE '45000'
 SET MESSAGE_TEXT = "La fecha de envio de la notificacion debe ser mayor a la actual";
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