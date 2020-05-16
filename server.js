const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const uuid = require("uuid");
const validateToken = require("./middleware/validateToken");
const cors = require( './middleware/cors' );
const { Bookmarks } = require("./models/bookmarksModel");
const { DATABASE_URL, PORT } = require("./config");

const app = express();
const jsonParser = bodyParser.json();

app.use( cors );
app.use(express.static("public"));
app.use(morgan("dev"));
app.use(validateToken);

app.get("/bookmarks", (_, res) => {
  Bookmarks.getAllBookmarks()
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((err) => {
      res.statusMessage = err;
      return res.status(500).end();
    });
});

app.get("/bookmarksByTitle", (req, res) => {
  let title = req.query.title;

  if (!title) {
    res.statusMessage = "Please send the title in the query params.";
    return res.status(406).end();
  }

  Bookmarks.getBookmarksByTitle(title)
    .then((result) => {
      if (result.length === 0) {
        res.statusMessage = `The title ${title} was not found.`;
        return res.status(404).end();
      }
      return res.status(200).json(result);
    })
    .catch((err) => {
      res.statusMessage = err;
      return res.status(500).end();
    });
});

app.post("/bookmarks", jsonParser, (req, res) => {
  let title = req.body.title;
  let description = req.body.description;
  let url = req.body.url;
  let rating = req.body.rating;

  if (!title || !description || !url || !rating) {
    res.statusMessage = "Please send all the fields in the body.";
    return res.status(406).end();
  }

  let newBookmark = {
    id: uuid.v4(),
    title,
    description,
    url,
    rating,
  };

  Bookmarks.createBookmark(newBookmark)
    .then((result) => {
      return res.status(201).json(result);
    })
    .catch((err) => {
      res.statusMessage = err;
      return res.status(500).end();
    });
});

app.delete("/bookmark/:id", (req, res) => {
  let id = req.params.id;

  Bookmarks.deleteBookmark(id)
    .then((result) => {
      if (result.n === 0) {
        res.statusMessage = "The 'id' was not found.";
        return res.status(404).end();
      }
      return res.status(200).end();
    })
    .catch((err) => {
      res.statusMessage = err;
      return res.status(500).end();
    });
});

app.patch("/bookmark/:id", jsonParser, (req, res) => {
  let paramsId = req.params.id;
  let bodyId = req.body.id;
  let bookmarkParams = req.body;
  let paramFlag = false;

  if (!bodyId) {
    res.statusMessage = "Please send the 'id' in the body of the request.";
    return res.status(406).end();
  }

  if (paramsId !== bodyId) {
    res.statusMessage = "The ids in the path and the body are not the same.";
    return res.status(409).end();
  }

  Object.keys(bookmarkParams).forEach((key) => {
    if (
      key !== "id" &&
      key !== "title" &&
      key !== "description" &&
      key !== "url" &&
      key !== "rating"
    ) {
      paramFlag = true;
    }
  });

  if (paramFlag) {
    res.statusMessage =
      "One or more fields in the Body don't match with the properties of the bookmark";
    return res.status(409).end();
  }

  Bookmarks.updateBookmark(paramsId, bookmarkParams)
    .then((result) => {
      if (!result) {
        res.statusMessage = "The 'id' was not found.";
        return res.status(404).end();
      }
      return res.status(202).json(result);
    })
    .catch((err) => {
      res.statusMessage = err;
      return res.status(500).end();
    });
});

app.listen(PORT, () => {
  console.log("This server is running in port 8080.");

  new Promise((resolve, reject) => {
    const settings = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    };

    mongoose.connect(DATABASE_URL, settings, (err) => {
      if (err) {
        return reject(err);
      } else {
        console.log("Database connected successfully");
        return resolve();
      }
    });
  }).catch((err) => {
    console.log(err);
  });
});
