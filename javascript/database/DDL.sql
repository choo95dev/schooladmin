CREATE DATABASE IF NOT EXISTS school_administration_system;

USE school_administration_system;

CREATE TABLE teacher(
	id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name varchar(100),
    email varchar(50) UNIQUE,
    updatedAt datetime,
    createdAt datetime
);

CREATE TABLE student(
	id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name varchar(100),
    email varchar(50) UNIQUE,
	updatedAt datetime,
    createdAt datetime
);

CREATE TABLE subject(
	id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name varchar(100),
    code varchar(5) UNIQUE,
	updatedAt datetime,
    createdAt datetime
);

CREATE TABLE class(
	id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name varchar(100),
    code varchar(5) UNIQUE,
	updatedAt datetime,
    createdAt datetime
);

CREATE TABLE studentclass(
	studentId INT UNSIGNED,
    classId INT UNSIGNED,
	updatedAt datetime,
    createdAt datetime,
	CONSTRAINT PK_StudentClass PRIMARY KEY (studentId, classId),
    CONSTRAINT FK_StudentClass_Class FOREIGN KEY (classId) REFERENCES class(id),
	CONSTRAINT FK_StudentClass_Student FOREIGN KEY (studentId) REFERENCES student(id)
);

CREATE TABLE teacherclasssubject(
	id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	teacherId INT UNSIGNED,
    classId INT UNSIGNED,
    subjectId INT UNSIGNED,
	updatedAt datetime,
    createdAt datetime,
    CONSTRAINT FK_TeacherClassSubject_Teacher FOREIGN KEY (teacherid) REFERENCES teacher(id),
	CONSTRAINT FK_TeacherClassSubject_Class FOREIGN KEY (classId) REFERENCES class(id),
	CONSTRAINT FK_TeacherClassSubject_Subject FOREIGN KEY (subjectId) REFERENCES subject(id)
);
