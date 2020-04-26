const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const uuid = require("uuid");
const validateToken = require("./middleware/validateToken");

const app = express();
const jsonParser = bodyParser.json();

app.use(morgan("dev"));
app.use(validateToken);

let bookmarks = [
  {
    id: uuid.v4(),
    title: "Bookmark 1",
    description: "First Bookmark",
    url: "www",
    rating: 10,
  },
  {
    id: uuid.v4(),
    title: "Bookmark 2",
    description: "Second Bookmark",
    url: "www",
    rating: 8,
  },
  {
    id: uuid.v4(),
    title: "Bookmark 3",
    description: "Third Bookmark",
    url: "www",
    rating: 9,
  },
];

app.get("/bookmarks", (_, res) => {
  return res.status(200).json(bookmarks);
});

app.get("/bookmark", (req, res) => {
  let title = req.query.title;

  if (!title) {
    res.statusMessage = "Please send the title in the query params.";
    return res.status(406).end();
  }

  let filteredBookmarks = bookmarks.filter((bookmark) => bookmark.title == title);

  if (filteredBookmarks.length === 0) {
    res.statusMessage = `The title ${title} was not found.`;
    return res.status(404).end();
  }

  return res.status(200).json(filteredBookmarks);
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

  bookmarks.push(newBookmark);

  return res.status(201).json(newBookmark);
});

app.delete("/bookmark/:id", (req, res) => {
  let id = req.params.id;

  let bookmark = bookmarks.findIndex((bookmark) => {
    if (bookmark.id === id) {
      return true;
    }
  });

  if (bookmark < 0) {
    res.statusMessage = "The 'id' was not found.";
    return res.status(404).end();
  }

  bookmarks.splice(bookmark, 1);

  return res.status(200).end();
});

app.patch("/bookmark/:id", jsonParser, (req, res) => {
  let paramsId = req.params.id;
  let bodyId = req.body.id;
  let bookmarkParams = req.body;
  let paramFlag = true;

  if (!bodyId) {
    res.statusMessage = "Please send the 'id' in the body or the request.";
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
      paramFlag = false;
    }
  });

  let bookmark = bookmarks.find((bookmark) => bookmark.id === paramsId);

  if (!bookmark) {
    res.statusMessage = "The 'id' was not found.";
    return res.status(404).end();
  }

  if (paramFlag) {
    Object.assign(bookmark, bookmarkParams);

    return res.status(202).json(bookmark);
  } else {
    res.statusMessage =
      "One or more fields in the Body don't match with the properties of the bookmark";
    return res.status(409).end();
  }
});

app.listen(8080, () => {
  console.log("This server is running in port 8080.");
});
