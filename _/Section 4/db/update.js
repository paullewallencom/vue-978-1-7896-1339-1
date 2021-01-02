const Parser = require('rss-parser');
const parser = new Parser();

module.exports = (db) => {
  db.prepare('SELECT id, url FROM feeds').all().forEach(async ({
    id,
    url
  }) => {
    let feed = await parser.parseURL(url);
    feed.items.forEach((item) => {
      const found = db
        .prepare('SELECT id FROM articles WHERE feed_id=? AND guid=?')
        .get(id, item.guid);
      if (!found) {
        db
          .prepare('INSERT INTO articles VALUES(NULL, ?, ?, ?, ?, ?, ?, ?, ?)')
          .run(id,
            item.title,
            item.link,
            item.pubDate,
            item.creator,
            item.content,
            item.contentSnippet,
            item.guid
          );
      }
    });
  });
};
