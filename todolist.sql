CREATE DATABASE TODOLIST;
use TODOLIST;

CREATE TABLE users(
idUser int primary key auto_increment,
nameUser varchar(50) not null,
lastname varchar(50) not null,
email varchar(50) not null,
passwordUser varchar(200) not null
);

CREATE TABLE tasks(
idTask int primary key auto_increment,
idUser int not null,
icon varchar(11) not null,
descriptionTask varchar(130) not null,
datetimeTask datetime not null,
isCompleted tinyint not null,

constraint fk_idUser foreign key(idUser) references users(idUser)
);
CREATE TABLE files(
idFile int primary key auto_increment,
idTask int not null  ,
nameFile varchar(50) not null,
typeFile varchar(50) not null,
datetimeUpload datetime not null,
fileTask mediumblob not null,
constraint fk_idTask foreign key(idTask) references tasks(idTask) on delete cascade
);


CREATE TABLE subscription(
idUser int NOT NULL,
endpointURL varchar(200) NOT NULL primary key,
p256dh varchar(100) NOT NULL,
auth varchar(50) NOT NULL,
constraint fk_idUserSubscription foreign key(idUser) references users(idUser) on delete cascade

);

CREATE TABLE notifications(
idNotification int not null primary key auto_increment,
idTask int not null,
datetimeSend datetime not null,
state varchar(50) not null,
constraint fk_idTaskNotification foreign key(idTask) references tasks(idTask )on delete cascade
);
CREATE TABLE scheduledJob(
idJob int not null primary key auto_increment,
idNotification int not null,
constraint fk_idNotification foreign key(idNotification) references notifications(idNotification) on delete cascade
);

CREATE TABLE notifications_subscription(
idNotification int not null,
endpointURL varchar(200) not null,
constraint fk_idNotificationSubscription foreign key(idNotification) references notifications(idNotification) on delete cascade,
constraint fk_endpointUrl foreign key(endpointURL) references subscription(endpointURL) on delete cascade,
primary key(idNotification,endpointURL)
);


/*alter table notifications_subscription drop constraint fk_endpointUrl;
alter table notifications_subscription add constraint fk_endpointUrl foreign key(endpointURL) 
references subscription(endpointURL) on delete cascade;