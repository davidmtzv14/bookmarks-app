const API_TOKEN = "2abbf7c3-245b-404f-9473-ade729ed4653";

// ----- Fetch endpoints -----
function fetchAddBookmark(title, description, url, rating) {
  let reqUrl = "/bookmarks";

  let data = {
    title,
    description,
    url,
    rating,
  };
  let settings = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  let results = document.querySelector(".results");

  results.innerHTML = "";

  fetch(reqUrl, settings)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then((responseJson) => {
      results.innerHTML += `
      <div> Created Bookmark </div>
      <div> id: ${responseJson.id} </div>
      <div> Title: ${responseJson.title} </div>
      <div> Description: ${responseJson.description} </div>
      <div> Url: ${responseJson.url} </div>
      <div> Rating ${responseJson.rating} </div>`;
    })
    .catch((err) => {
      results.innerHTML = err.message;
    });
}

function fetchDeleteBookmark(id) {
  let reqUrl = `/bookmark/${id}`;

  let settings = {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
    },
  };

  let results = document.querySelector(".results");

  results.innerHTML = "";

  fetch(reqUrl, settings)
    .then((response) => {
      if (response.ok) {
        return response;
      }
      throw new Error(response.statusText);
    })
    .then((_) => {
      results.innerHTML += `
        <div> Deleted Bookmark correctly </div>`;
    })
    .catch((err) => {
      console.log(err);
      results.innerHTML = err.message;
    });
}

function fetchUpdateBookmark(id, title, description, url, rating) {
  let reqUrl = `/bookmark/${id}`;

  let data = {
    id,
    title,
    description,
    url,
    rating,
  };

  let settings = {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  let results = document.querySelector(".results");

  results.innerHTML = "";

  fetch(reqUrl, settings)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then((responseJson) => {
      results.innerHTML += `
        <div> Updated Bookmark </div>
        <div> id: ${responseJson.id} </div>
        <div> Title: ${responseJson.title} </div>
        <div> Description: ${responseJson.description} </div>
        <div> Url: ${responseJson.url} </div>
        <div> Rating: ${responseJson.rating} </div>`;
    })
    .catch((err) => {
      results.innerHTML = err.message;
    });
}

function fetchFindBookmarks(title) {
  let reqUrl = `/bookmarksByTitle?title=${title}`;
  let settings = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
    },
  };

  let results = document.querySelector(".results");
  results.innerHTML = "";

  fetch(reqUrl, settings)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then((responseJson) => {
      for (let i = 0; i < responseJson.length; i++) {
        results.innerHTML += `
        <div> Bookmark ${i+1} </div>
        <div> id: ${responseJson[i].id} </div>
        <div> Title: ${responseJson[i].title} </div>
        <div> Description: ${responseJson[i].description} </div>
        <div> Url: ${responseJson[i].url} </div>
        <div> Rating: ${responseJson[i].rating} </div>`;
      }
    })
    .catch((err) => {
      results.innerHTML = err.message;
    });
}

function fetchAllBookmarks() {
  let reqUrl = `/bookmarks`;
  let settings = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
    },
  };

  let results = document.querySelector(".results");
  results.innerHTML = "";

  fetch(reqUrl, settings)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then((responseJson) => {
      for (let i = 0; i < responseJson.length; i++) {
        results.innerHTML += `
          <div> Bookmark ${i+1} </div>
          <div> id: ${responseJson[i].id} </div>
          <div> Title: ${responseJson[i].title} </div>
          <div> Description: ${responseJson[i].description} </div>
          <div> Url: ${responseJson[i].url} </div>
          <div> Rating: ${responseJson[i].rating} </div>`;
      }
    })
    .catch((err) => {
      results.innerHTML = err.message;
    });
}

// ----- Watch forms -----
function watchAddBookmarksForm() {
  let addBookmarkForm = document.querySelector(".form-add-bookmark");

  addBookmarkForm.addEventListener("submit", (event) => {
    event.preventDefault();
    let title = document.getElementById("bookmarkTitle").value;
    let description = document.getElementById("bookmarkDescription").value;
    let url = document.getElementById("bookmarkUrl").value;
    let rating = document.getElementById("bookmarkRating").value;

    fetchAddBookmark(title, description, url, rating);
  });
}

function watchDeleteBookmarksForm() {
  let deleteBookmarkForm = document.querySelector(".form-delete-bookmark");

  deleteBookmarkForm.addEventListener("submit", (event) => {
    event.preventDefault();
    let id = document.getElementById("deleteBookmarkID").value;

    fetchDeleteBookmark(id);
  });
}

function watchUpdateBookmarksForm() {
  let updateBookmarkForm = document.querySelector(".form-update-bookmark");

  updateBookmarkForm.addEventListener("submit", (event) => {
    event.preventDefault();
    let id = document.getElementById("updateBookmarkID").value;
    let title = document.getElementById("updateBookmarkTitle").value;
    let description = document.getElementById("updateBookmarkDescription")
      .value;
    let url = document.getElementById("updateBookmarkUrl").value;
    let rating = document.getElementById("updateBookmarkRating").value;

    fetchUpdateBookmark(id, title, description, url, rating);
  });
}

function watchGetBookmarksForm() {
  let getBookmarkForm = document.querySelector(".form-get-bookmarks");

  getBookmarkForm.addEventListener("submit", (event) => {
    event.preventDefault();
    let title = document.getElementById("findBookmarkTitle").value;

    fetchFindBookmarks(title);
  });
}

function watchGetAllBookmarksForm() {
  let getBookmarkForm = document.querySelector(".form-get-all-bookmarks");

  getBookmarkForm.addEventListener("submit", (event) => {
    event.preventDefault();

    fetchAllBookmarks();
  });
}

function init() {
  watchAddBookmarksForm();
  watchDeleteBookmarksForm();
  watchUpdateBookmarksForm();
  watchGetBookmarksForm();
  watchGetAllBookmarksForm();
  fetchAllBookmarks();
}

init();
