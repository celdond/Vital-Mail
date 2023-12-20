
DELETE FROM usermail;

INSERT INTO usermail(username, email, credword) VALUES ('Abby', 'Abigail', '$2a$10$EPqtzN6SWuqb1p5hWDHMHe.Oyq3o.1ofCLpJ0fMMctANXjUbN.k8e');
INSERT INTO usermail(username, email, credword) VALUES ('Anny', 'anny55', '$2a$10$T.PqbjsUiJZE3tmayGwOvefW.e1ECP8y/M0RR3SiD5b8yOSUEN662');
INSERT INTO mailbox(boxcode, mailbox, email) VALUES ('Inbox@Abigail', 'Inbox', 'Abigail');
INSERT INTO mailbox(boxcode, mailbox, email) VALUES ('Sent@Abigail', 'Sent', 'Abigail');
INSERT INTO mailbox(boxcode, mailbox, email) VALUES ('Trash@Abigail', 'Trash', 'Abigail');
INSERT INTO mailbox(boxcode, mailbox, email) VALUES ('Inbox@anny55', 'Inbox', 'anny55');
INSERT INTO mailbox(boxcode, mailbox, email) VALUES ('Sent@anny55', 'Sent', 'anny55');
INSERT INTO mailbox(boxcode, mailbox, email) VALUES ('Trash@anny55', 'Trash', 'anny55');

INSERT INTO mail(boxcode, mail) VALUES ('Sent@Abigail','{"to":{"name":"Anny","email":"anny55"},"from":{"name":"Abby","email":"Abigail"},"timestamp":"2021-11-17T23:47:19Z","seen":0, "subject":"Mom", "content":"Is she okay?"}');
INSERT INTO mail(boxcode, mail) VALUES ('Inbox@Abigail','{"to":{"name":"Abby","email":"Abigail"},"from":{"name":"Anny","email":"anny55"},"timestamp":"2021-11-17T23:27:19Z","seen":0, "subject":"Mom", "content":"Is she okay?"}');
INSERT INTO mail(boxcode, mail) VALUES ('Inbox@Abigail','{"to":{"name":"Abby","email":"Abigail"},"from":{"name":"Anny","email":"anny55"},"timestamp":"2020-12-17T23:32:19Z","seen":0, "subject":"Banana Banana Bread", "content":"Banana, Banana Bread.  Banana, Banana Bread.  Banana Banana bread."}');
INSERT INTO mail(boxcode, mail) VALUES ('Inbox@Abigail','{"to":{"name":"Abby","email":"Abigail"},"from":{"name":"Anny","email":"anny55"},"timestamp":"2022-11-17T23:18:19Z","seen":0, "subject":"Mom", "content":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"}');
INSERT INTO mail(boxcode, mail) VALUES ('Trash@Abigail','{"to":{"name":"Anny","email":"anny55"},"from":{"name":"Abby","email":"Abigail"},"timestamp":"2021-10-17T23:17:19Z","seen":0, "subject":"Mom", "content":"Is she okay?"}');
INSERT INTO mail(boxcode, mail) VALUES ('Sent@Abigail','{"to":{"name":"Anny","email":"anny55"},"from":{"name":"Abby","email":"Abigail"},"timestamp":"2022-11-17T23:16:19Z","seen":0, "subject":"Mom", "content":"Is she okay?"}');
