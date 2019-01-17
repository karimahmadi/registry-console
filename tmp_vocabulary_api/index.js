const express = require("express");
const bodyParser = require("body-parser");
const low = require("lowdb");
const _ = require("lodash");
const FileSync = require("lowdb/adapters/FileSync");
const app = express();
const adapter = new FileSync("db.json");
const db = low(adapter);
const uuidv1 = require('uuid/v1');

app.use(bodyParser.json());

// Set some defaults
db.defaults({
  vocab: [{
    key: uuidv1(),
    namespace: 'gbif.org',
    name: 'BasisOfRecord',
    label: {
      eng: 'Basis of record',
      dan: 'Evidens'
    },
    definition: {
      eng: 'What is the type of evidence for the record',
      dan: 'hvilken type evidens er der for observationen'
    },
    externalDefinitionUrl: ['https://github.com/tdwg/website/issues/128'],
    editorialNotes: ['#lorem ipsum\nsomething goes here']
  }],
  terms: [
    {
      key: uuidv1(),
      vocabularyKey: "234",
      parentKey: undefined,
      replacedByKey: undefined,
      name: 'HumanObservation',
      label: {
        eng: 'Human observation',
        dan: 'Menneskelig observation'
      },
      definition: {
        eng: 'A human being observed the species at the time and place it occurred and recorded it.',
      },
      alternativeLabel: {
        dan: ['msk observation'],
        shared: ['Human obs']
      },
      misspeltLabel: {
        dan: ['mensklig observation'],
        shared: ['Humane observatoin']
      }
    }
]
}).write();

// Add a post
// db.get("posts")
//   .push({ id: 1, title: "lowdb is awesome" })
//   .write();

// Set a user using Lodash shorthand syntax
//db.set("user.name", "typicode").write();

app.get("/vocabulary/:key", function (req, res) {
  const vocab = db
    .get("vocab")
    .find({ name: req.params.key })
    .value();
  if (vocab) {
    res.json(filterLocales(vocab, req.query.locales));
  } else {
    res.sendStatus(404);
  }
});

app.get("/vocabulary", function (req, res) {
  const q = (req.query.q || "").toLowerCase();
  const offset = _.toNumber(req.query.offset || 0);
  const limit = _.toNumber(req.query.limit || 5);
  const results = db
    .get("vocab")
    .filter(item => {
      return (
        _.includes(item.name.toLowerCase(), q) ||
        _.includes(_.get(item, 'label.eng', '').toLowerCase(), q)
      );
    })
    .cloneDeep()
    .value();

  res.json({
    count: results.length,
    offset: offset,
    limit: limit,
    results: _.map(results.slice(offset, limit), x => filterLocales(x, req.query.locales))
  });
});

app.post("/vocabulary", function (req, res) {
  db.get("vocab")
    .push(req.body)
    .write()
  res.json(req.body);
});

function filterLocales(obj, locales) {
  let item = _.cloneDeep(obj);
  locales = locales ? locales.split(",") : ["eng"];
  item.label = _.pickBy(item.label, (v, k) => locales.includes(k));
  item.definition = _.pickBy(item.definition, (v, k) =>
    locales.includes(k)
  );
  return item;
}

app.listen(3000);
