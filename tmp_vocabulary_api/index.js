const express = require("express");
const bodyParser = require("body-parser");
const low = require("lowdb");
const _ = require("lodash");
const FileSync = require("lowdb/adapters/FileSync");
const app = express();
const adapter = new FileSync("db.json");
const db = low(adapter);

app.use(bodyParser.json());

// Set some defaults
// db.defaults({ vocab: [{
// 	key: 'BASIS_OF_RECORD',
// 	title: {
// 		en: 'Basis of record',
// 		da: 'Evidens'
// 	},
// 	description: {
// 		en: 'What is the type of evidence for the record',
// 		da: 'hvilken type evidens er der for observationen'
// 	}
// }] }).write();

// Add a post
// db.get("posts")
//   .push({ id: 1, title: "lowdb is awesome" })
//   .write();

// Set a user using Lodash shorthand syntax
//db.set("user.name", "typicode").write();

app.get("/vocabulary/:key", function(req, res) {
  const locales = req.query.locales ? req.query.locales.split(",") : ["en"];
  const vocab = db
    .get("vocab")
    .find({ key: req.params.key })
    .cloneDeep()
    .value();

  if (vocab) {
    vocab.title = _.pickBy(vocab.title, (v, k) => locales.includes(k));
    vocab.description = _.pickBy(vocab.description, (v, k) =>
      locales.includes(k)
    );
    res.json(vocab);
  } else {
    res.sendStatus(404);
  }
});

app.get("/vocabulary", function(req, res) {
  const q = (req.query.q || "").toLowerCase();
  const offset = _.toNumber(req.query.offset || 0);
  const limit = _.toNumber(req.query.limit || 5);
  const results = db
    .get("vocab")
    .filter(item => {
      return (
        _.includes(item.key.toLowerCase(), q) ||
        _.includes(item.title.en.toLowerCase(), q)
      );
    })
    .cloneDeep()
    .value();

  res.json({
    count: results.length,
    offset: offset,
    limit: limit,
    results: results.slice(offset, limit)
  });
});

app.post("/vocabulary", function(req, res) {
  db.get("vocab")
		.push(req.body)
		.write()
	res.json(req.body);
});

app.listen(3000);
