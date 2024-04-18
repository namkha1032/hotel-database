DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS notes;
DROP TABLE IF EXISTS roles;
-- CREATE TABLE
CREATE TABLE "users" (
	"id"	INTEGER,
	"username"	TEXT UNIQUE,
	"password"	TEXT,
	"roleid" INTEGER,
	PRIMARY KEY("id"),
	FOREIGN KEY ("roleid") REFERENCES "roles"("id")
);
CREATE TABLE "notes" (
	"id"	INTEGER,
	"content"	TEXT,
	"important"	BOOLEAN,
	"date"	DATETIME DEFAULT CURRENT_TIMESTAMP,
	"userid"	INTEGER,
	PRIMARY KEY("id"),
	FOREIGN KEY("userid") REFERENCES "users"("id") ON DELETE CASCADE
);
CREATE TABLE "roles" (
	"id"	INTEGER,
	"rolename"	TEXT,
	PRIMARY KEY("id")
);

-- INSERT roles
INSERT INTO roles (rolename) VALUES ("admin");
INSERT INTO roles (rolename) VALUES ("recruiter");
INSERT INTO roles (rolename) VALUES ("interviewer");
INSERT INTO roles (rolename) VALUES ("candidate");