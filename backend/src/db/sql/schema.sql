
DROP TABLE IF EXISTS mail;
DROP TABLE IF EXISTS mailbox;
DROP TABLE IF EXISTS usermail;

CREATE TABLE usermail(username VARCHAR(64), email VARCHAR(64) PRIMARY KEY, credword VARCHAR(64));
CREATE TABLE mailbox(boxcode VARCHAR(97) PRIMARY KEY, mailbox VARCHAR(32), email VARCHAR(64) REFERENCES usermail(email));
CREATE TABLE mail(mid UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), boxcode VARCHAR(97) REFERENCES mailbox(boxcode), mail jsonb);
