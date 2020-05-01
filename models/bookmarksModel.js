const mongoose = require("mongoose");

const bookmarksSchema = mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
});

const bookmarksCollection = mongoose.model("bookmarks", bookmarksSchema);

const Bookmarks = {
  createBookmark: function (newBookmark) {
    return bookmarksCollection
      .create(newBookmark)
      .then((createdBookmark) => {
        return createdBookmark;
      })
      .catch((err) => {
        return err;
      });
  },
  getAllBookmarks: function () {
    return bookmarksCollection
      .find()
      .then((allBookmarks) => {
        return allBookmarks;
      })
      .catch((err) => {
        return err;
      });
  },
  getBookmarkByTitle: function (title) {
    return bookmarksCollection
      .find({ title })
      .then((filteredBookmarks) => {
        return filteredBookmarks;
      })
      .catch((err) => {
        return err;
      });
  },
  updateBookmark: function (id, params) {
    return bookmarksCollection
      .findOneAndUpdate({ id }, params, { new: true })
      .then((updatedBookmark) => {
        return updatedBookmark;
      })
      .catch((err) => {
        return err;
      });
  },
  deleteBookmark: function (id) {
    return bookmarksCollection
      .deleteOne({ id })
      .then((result) => {
        return result;
      })
      .catch((err) => {
        return err;
      });
  },
};

module.exports = { Bookmarks };
