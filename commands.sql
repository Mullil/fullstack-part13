CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author TEXT,
    url TEXT NOT NULL,
    title TEXT NOT NULL,
    likes INT DEFAULT 0
);

INSERT INTO blogs (author, url, title) VALUES ('testauthor', 'testurl', 'testtitle');

INSERT INTO blogs (author, url, title, likes) VALUES ('blogauthor', 'url2', 'blogtitle', 200);