const Database = require('better-sqlite3');

const db = new Database('./db/database.db');

db.prepare(`CREATE TABLE feeds (
  id INTEGER NOT NULL PRIMARY KEY,
  name STRING,
  url STRING
)`).run();

[
  {
    name: 'Arts & Culture',
    url: 'http://feeds.reuters.com/news/artsculture'
  },
  {
    name: 'Business',
    url: 'http://feeds.reuters.com/reuters/businessNews'
  },
  {
    name: 'Entertainment',
    url: 'http://feeds.reuters.com/reuters/entertainment'
  }
].forEach(({ name, url }) => {
  db
  .prepare('INSERT INTO feeds VALUES (NULL, ?, ?)')
  .run(name, url);
});

db.prepare(`CREATE TABLE articles (
  id INTEGER NOT NULL PRIMARY KEY,
  feed_id INTEGER NOT NULL,
  title STRING,
  link STRING,
  pubDate STRING,
  creator STRING,
  content TEXT,
  contentSnippet TEXT,
  guid STRING
)`).run();

db.close();
