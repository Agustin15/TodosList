CREATE DATABASE TODOLIST;
use TODOLIST;

CREATE TABLE users(
idUser int primary key auto_increment,
nameUser varchar(50) not null,
lastname varchar(50) not null,
email varchar(50) not null,
passwordUser varchar(60) not null
);

CREATE TABLE tasks(
idTask int primary key auto_increment,
icon varchar(11) not null,
descriptionTask varchar(130) not null,
datetimeTask datetime not null,
isCompleted tinyint not null,
idUser int not null,

constraint fk_idUser foreign key(idUser) references users(idUser)
);
CREATE TABLE files(
idFile int primary key auto_increment,
nameFile varchar(50) not null,
typeFile varchar(50) not null,
datetimeUpload datetime not null,
fileTask mediumblob not null,
idTask int not null,
constraint fk_idTask foreign key(idTask) references tasks(idTask) on delete cascade
);


CREATE TABLE subscriptions(
endpointURL varchar(200) NOT NULL primary key,
p256dh varchar(100) NOT NULL,
auth varchar(50) NOT NULL,
idUser int NOT NULL,
constraint fk_idUserSubscription foreign key(idUser) references users(idUser) on delete cascade

);

CREATE TABLE notifications(
idNotification int not null primary key auto_increment,
datetimeSend datetime not null,
state varchar(50) not null,
idTask int not null,
constraint fk_idTaskNotification foreign key(idTask) references tasks(idTask )on delete cascade
);
CREATE TABLE scheduled_jobs(
idJob int not null primary key auto_increment,
idNotification int not null,
constraint fk_idNotification foreign key(idNotification) references notifications(idNotification) on delete cascade
);

CREATE TABLE notifications_subscription(
idNotification int not null,
endpointURL varchar(200) not null,
constraint fk_idNotificationSubscription foreign key(idNotification) references notifications(idNotification) on delete cascade,
constraint fk_endpointUrl foreign key(endpointURL) references subscriptions(endpointURL) on delete cascade,
primary key(idNotification,endpointURL)
);


CREATE TABLE verifications_two_step(
idVerification int not null primary key auto_increment,
enabled tinyint not null,
idUser int not null,
constraint fk_idUserVerification foreign key(idUser) references users(idUser) on delete cascade
);

CREATE TABLE verifications_code(
codeOfVerification varchar(60) not null primary key,
expirationTime bigint not null,
idVerification int not null,
constraint fk_idVerification foreign key(idVerification) references verifications_two_step(idVerification) 
);
