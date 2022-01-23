// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://OneUser:Bigonecode13@globalone.c9k5c.mongodb.net/GlobalOne?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const key = "AAAAB3NzaC1yc2EAAAADAQABAAAAgQDheV5nY0TIudF7WzZ/a/vZ4HprlIQpsLn8newJcbmG4n7Ki0JekYPALT2gKHo1Vw01uf9FhnTapTBin7aSVJqb3zNMxzYfvw3heAMfH7NsowsupwdoGFfuWhNNxQLOipyn3817kpvOoe9FKkrJbcTlBAra3TFXTjpIBfUJtFS2vw=="

export default async (req, res) => {
  await client.connect();
  const coll = client.db("GlobalOne").collection("hadith");
  const { q, p, k} = req.query;

  //#region Validation
  // Validation
  if (k == null || k == '') {
    return res.status(400).send({ title: "Ooops, it's your fault.", message: "We need a key, to make sure you're authorized"});
  }
  if (k !== key){
    return res.status(401).send({ title: "Ooops, it's your fault.", message: "You send wrong key, dont play with us."});
  }
  if (q == null || q == '') {
    return res.status(400).send({ title: "Ooops, it's your fault.", message: "Params query is Required"});
  }

  // Default Params
  var pageNumber = 0;
  var limit = 10;
  var skip = pageNumber*limit;

  if (p != null) {
    try {
      pageNumber = p-1
      if (pageNumber < 0){
        return res.status(400).send({ title: "Ooops, it's your fault.", message: "You should pass page in number and greater than 0"});
      }
      limit = 10;
      skip = pageNumber*limit;
    } catch (error) {
      return res.status(400).send({ title: "Ooops, it's your fault.", message: "You should pass page in number not string or char"});
    }
  }
  //#endregion

  //#region Pipeline
  const pipeline = [
    {
      '$search': {
        'index': 'indo_search',
        'text': {
          'query': q,
          'path': 'terjemah'
        }
      }
    },
    {"$limit": skip + limit},
    {"$skip": skip},
    {
      '$project': {
        "_id": 1,
        "kitab": 1,
        "arab": 1,
        "terjemah": 1,
        "score": { "$meta": "searchScore" }
      }
    }
  ];
  //#region 

  //#region Cursor
  const aggCursor = coll.aggregate(pipeline);
  
  // Loop every cursor
  const results = [];
  for await (const doc of aggCursor) {
    results.push(doc)
  }
  //#endregion 

  // Close connection
  client.close();

  // return response
  res.status(200).json(results);
}
