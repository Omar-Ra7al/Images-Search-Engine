const imagesHolder = document.querySelector(".images"),
  loadMore = document.querySelector(".load-more"),
  searchInput = document.querySelector(".search-box input"),
  searchIcon = document.querySelector(".uil-search");

let lightBox = document.querySelector(".light-box");

// API >>
const apiKey = "whpeAmJTnk8fEb2sNWbaLOB7B7n3x6iQ2JxHY0xCXRPzDI9t8c7Jmx1G";
// Count Of IMAGES on Evrey API Call
const perPage = 15;
// We Will Increment the current page on load more button click
let currentPage = 1;
let searchTerm = null; // عشان ميجبش حاجه متحدده

// ${img.src.large2x} عشان نحطها ك ارجيومنت للفانكشن لازم نحط قبلها نقطتين >>>>> ''
const genrateHtml = (images) => {
  images.map((img) => {
    imagesHolder.innerHTML += `
          <li class="card"> <img src="${img.src.large2x}" alt="">
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
const getImages = (apiURL) => {
  loadMore.innerHTML = "Loading .."; // اول ميتعمل فيتش ويتنده على الريسبونس هيعمل كدا
  loadMore.classList.add("loading");
  // Featching images by API call with the authoriztion header
  fetch(apiURL, {
    headers: { Authorization: apiKey },
  })
    .then((response) => response.json())
    .then((data) => {
      // We will make Funcition here pramiter will take the data.potos as argument
      genrateHtml(data.photos);
      // Change the name of load more after fetch data لما الريسبونس يخلص بالبلدي
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

const loadMoreImages = () => {
  currentPage++; //انت كدا كل كليك بتروح للريبونس وتقوله زودلي عدد الصفحات يعني هاتلي 15 صوره كمان احطهم في الصفحه
  // لو حطينال كرنت بيج تحت هيكرر الصور تمام عشان هنكون عملنا الفيتش وملقناش مكان نحط فيه الصور
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

// loadMore.addEventListener("click", () => loadMore.innerHTML = "Loading ..."); دي تنفع عادي برضو
loadMore.addEventListener("click", loadMoreImages); //لوعاوزين الزرار لما نتكا عليه نغيرالكلمه يبقا نروح لاصل الحوارالي هو ايه
// الفيتش الاساسي اللي قبل ما نعمل فيتش اصلا يبقا اسمه العادي لكن لما يحصل ريسبون ويعمل فيتش نروح نغير الي عاوزينه فيه

const loadSearchImages = (e) => {
  if (e && e.key === "Enter" && e.target.value.trim("") !== "") {
    searchTerm = e.target.value; // === searchinput.value
  } else if (!e) {
    // Handle the case when the function is called without an event object
    searchTerm = searchInput.value;
  } else {
    return; // Exit the function if there's no searchTerm or invalid event
  }
  currentPage = 1; // هنرجعها لاسسساسها عشان لو عندنا اكتر ن صفحه تشيلهم وتعمل واحده جديده
  imagesHolder.innerHTML = "";
  getImages(
    `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}per_page=${perPage}`
  );
};
searchInput.addEventListener("keyup", loadSearchImages);

searchIcon.onclick = () => {
  loadSearchImages(); // Call the function here without an event object
};

const downloadImg = (imageUrl) => {
  fetch(imageUrl)
    .then((response) => response.blob()) // blob()>> give you details of img
    .then((blob) => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = new Date().getTime(); // Set the filename to the extracted photo name
      a.click();
    })
    .catch((error) => console.error("Error downloading image:", error));
};

window.addEventListener("click", (e) => {
  // هو عملها فوق في الكارد لي شايل اكلونتيرنر
  // عمل فانكشن شوا لايت بوكس لما اليوزى يعمل كليك على ال لايت بوككس يشغلها
  //  وحط الصوره واسم الفوتجرافر ك ارجيومينت للفانكشن
  // والحته بتاعت تنزيل الصوره راح للايت بوكس وخلى الصوره اترربيوت  في الاليمينت
  // في زرار الدونلود ابمج
  // وحصل عنده مشكله فشيخهه انه بقا لماىيتكا على زرارالجونلود بقا بيفتح الايت بوكس لانه عامل الفنكشن بتاعتهلما يدوس على الكارد يفتح اللايت بكوس
  // وعالجها بانه حط على زار الدونلود
  // event.stoppropagation() بتوقف اي ايفينت بيحصل غير الي هيا وخداه
  if (e.target.tagName.toLowerCase() === "img") {
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
});

const closeLightBox = () => {
  lightBox.style.display = "none";
  document.body.style.overflow = "auto";
};
