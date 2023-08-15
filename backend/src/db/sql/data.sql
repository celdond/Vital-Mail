
DELETE FROM usermail;

INSERT INTO usermail(username, email, credword) VALUES ('Abby', 'Abigail', '$2a$10$dReGvO.BCuPiYfwMY722C.gQHQugLjGJJ8YlzthxJoNlo3yWtfGWS');
INSERT INTO mailbox(boxcode, mailbox, email) VALUES ('Inbox@Abigail', 'Inbox', 'Abigail');
INSERT INTO mailbox(boxcode, mailbox, email) VALUES ('Sent@Abigail', 'Sent', 'Abigail');
INSERT INTO mailbox(boxcode, mailbox, email) VALUES ('Trash@Abigail', 'Trash', 'Abigail');

INSERT INTO mail(boxcode, mail) VALUES ('Sent@Abigail','{"to":{"name":"Anny","email":"anny55"},"from":{"name":"Abby","email":"Abigail"},"timestamp":"2021-11-17T23:17:19Z","seen":0, "subject":"Mom", "content":"Is she okay?"}');
INSERT INTO mail(boxcode, mail) VALUES ('Inbox@Abigail','{"to":{"name":"Anny","email":"anny55"},"from":{"name":"Abby","email":"Abigail"},"timestamp":"2021-11-17T23:17:19Z","seen":0, "subject":"Mom", "content":"Is she okay?"}');
INSERT INTO mail(boxcode, mail) VALUES ('Trash@Abigail','{"to":{"name":"Anny","email":"anny55"},"from":{"name":"Abby","email":"Abigail"},"timestamp":"2021-11-17T23:17:19Z","seen":0, "subject":"Mom", "content":"Is she okay?"}');
INSERT INTO mail(boxcode, mail) VALUES ('Sent@Abigail','{"to":{"name":"Anny","email":"anny55"},"from":{"name":"Abby","email":"Abigail"},"timestamp":"2021-11-17T23:17:19Z","seen":0, "subject":"Mom", "content":"Is she okay?"}');
