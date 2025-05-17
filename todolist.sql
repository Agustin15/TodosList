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


