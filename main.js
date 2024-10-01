const imagesHolder = document.querySelector(".images"),
  loadMore = document.querySelector(".load-more"),
  searchInput = document.querySelector(".search-box input"),
  searchIcon = document.querySelector(".uil-search"),
  lightBox = document.querySelector(".light-box"),
  apiKey = "whpeAmJTnk8fEb2sNWbaLOB7B7n3x6iQ2JxHY0xCXRPzDI9t8c7Jmx1G",
  perPage = 15;
let currentPage = 1,
  searchTerm = null;

const getImages = (apiURL) => {
  loadMore.innerHTML = "Loading ..";
  loadMore.classList.add("loading");
  fetch(apiURL, {
    headers: { Authorization: apiKey },
  })
    .then((response) => response.json())
    .then((data) => {
      genrateHtml(data.photos);
      loadMore.innerHTML = "Load More";
      loadMore.classList.remove("loading");
    })
    .catch(() => {
      alert("Faild to load images!");
      window.location.reload();
    });
};
getImages(
  `https://api.pexels.com/v1/curated?page=${currentPage}per_page=${perPage}`
);

const genrateHtml = (images) => {
  images.map((img) => {
    imagesHolder.innerHTML += `
          <li class="card"> <img src="${img.src.large2x}" alt="search-result">
                <div class="details">
                    <div class="photographer">
                        <i class="uil uil-camera"></i>
                        <span>${img.photographer}</span>
                    </div>
                    <button>
                        <i onclick="downloadImg('${img.src.large2x}')" class="uil uil-import"></i>
                    </button>
                </div>
            </li>
        `;
  });
};

const loadMoreImages = () => {
  currentPage++;
  if (searchInput.value.trim("") !== "") {
    getImages(
      `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}per_page=${perPage}`
    );
  } else {
    getImages(
      `https://api.pexels.com/v1/curated?page=${currentPage}per_page=${perPage}`
    );
  }
};
loadMore.addEventListener("click", loadMoreImages);

const loadSearchImages = (e) => {
  if (e && e.key === "Enter" && e.target.value.trim("") !== "") {
    searchTerm = e.target.value;
  } else if (!e) {
    searchTerm = searchInput.value;
  } else {
    return;
  }
  currentPage = 1;
  imagesHolder.innerHTML = "";
  getImages(
    `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}per_page=${perPage}`
  );
};
searchInput.addEventListener("keyup", loadSearchImages);
searchInput.addEventListener("keyup", () => {
  if (searchInput.value === "") {
    imagesHolder.innerHTML = "";
    getImages(
      `https://api.pexels.com/v1/curated?page=${currentPage}per_page=${perPage}`
    );
  }
});
searchIcon.onclick = () => {
  loadSearchImages();
};

const downloadImg = (imageUrl) => {
  fetch(imageUrl)
    .then((response) => response.blob())
    .then((blob) => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = new Date().getTime();
      a.click();
    })
    .catch((error) => console.error("Error downloading image:", error));
};

window.addEventListener("click", (e) => {
  if (e.target.tagName.toLowerCase() === "img") {
    if (e.target.alt === "search-result") {
      document.body.style.overflow = "hidden";

      console.log(e.target.parentNode);
      let parentEle = e.target.parentNode;
      let photoGrapherName =
        parentEle.querySelector(".photographer span").textContent;
      lightBox.innerHTML = `
    <div class="container">
            <div class="wrapper">
                <header>
                    <div class="photographer">
                        <i class="uil uil-camera"></i>
                        <span>${photoGrapherName}</span>
                    </div>
                    <div class="buttons">
                        <i onclick="downloadImg('${e.target.src}')" class="uil uil-import"></i>
                        <i onclick="closeLightBox()" class="uil uil-times"></i>
                    </div>
                </header>
                <div class="preview-img">
                    <div class="img">
                       <img src="${e.target.src}" alt="">
                    </div>
                </div>
            </div>
        </div>`;
      lightBox.style.display = "block";
    }
  }
});

const closeLightBox = () => {
  lightBox.style.display = "none";
  document.body.style.overflow = "auto";
};
