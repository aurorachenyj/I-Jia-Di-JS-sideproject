// 搜尋頁面 顯示
console.log(localUserId);
const Auth = `Bearer ${localStorage.getItem("accessToken")}`;
axios.defaults.headers.common.Authorization = Auth;
let resaultData; //放從json-server拿回來的資料

const getUrlStr = location.href; //從網址把值取下來
const url = new URL(getUrlStr);
const sweetItem = url.searchParams.get("sweetItem").split(",");
let station = url.searchParams.get("station");
let shopName = url.searchParams.get("shopName");
const searchSort = document.querySelector(".searchSort");

console.log(searchSort);

// 先判斷是否已登入 再看是否有收藏該店家
// <i style="font-size:1.5rem; color:#e6a12c" class="fa-solid fa-heart"></i>
let bookmarkData = [];

if (localUserId) {
  getBookmark();
} else {
  jsonSearchData();
}

function getBookmark() {
  // if()

  axios
    .get(`${jsonUrl}/400/bookmarks?userId=${localUserId}`, {
      userId: localUserId,
    })
    .then(function (res) {
      console.log(res.data);
      bookmarkData = res.data;
      renderSaveStatus();
      jsonSearchData();
    })
    .catch(function (error) {
      console.log(error);
      if (error.response.data === "jwt expired") {
        alert("憑證逾期，請重新登入");
        // 頁面導回登入頁 強制重新登入

        location.href = "/IJiaDi-sideproject/app/login.html";
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userName");
        localStorage.removeItem("userId");
      }
      //解決新會員尚未有書籤時會出錯的問題
      if (error.message === "Request failed with status code 403") {
        jsonSearchData();
      }
    });
}

// jsonSearchData();
function jsonSearchData() {
  console.log(bookmarkData);
  // console.log(sweetItem);
  // console.log(station);
  // console.log(shopName);
  let str = "";
  sweetItem.forEach((item) => {
    str += `sweetItem_like=${item.trim()}&`;
  });
  // console.log(str);
  station = `MrtStation_like=${station}&`;
  // console.log(station);
  shopName = `shopName_like=${shopName}&`;
  // console.log(shopName);
  if (station === "MrtStation_like=undefined&") {
    jsonStr = `${str}${shopName}`;
  } else {
    jsonStr = `${str}${station}${shopName}`;
  }
  console.log(jsonStr);

  //把組好的字串拿去取值
  axios
    .get(`${jsonUrl}/shops?${jsonStr}`)
    .then(function (response) {
      resaultData = response.data;
      console.log(resaultData);

      if (resaultData.length == 0) {
        alert("查無店家資料");
        location.href = "./app/index.html";
        return;
      }

      findShopNameAndCalcScore();
    })
    .catch(function (error) {
      console.log(error);
    });

  //  成功拿回搜尋的值了~
}

//抓回的資料整理
function findShopNameAndCalcScore() {
  console.log(resaultData);
  let arr = [];
  resaultData.forEach((item) => {
    arr.push(item.id);
  });
  console.log(arr);

  //   // 分別抓各店家的評價
  let commentData = [];
  arr.forEach((item) => {
    //http://localhost:3000/comments/?shopId=22
    axios.get(`${jsonUrl}/comments/?shopId=${item}`).then(function (res) {
      // console.log(res.data);

      let obj = {};
      obj.shopId = item;
      obj.comment = res.data;
      commentData.push(obj);
      CalcShopScore();
    });
  });

  console.log(commentData); //已存店家id和相對應的評價arr值

  function CalcShopScore() {
    let totalScoreData = [];
    commentData.forEach((item) => {
      //若要 處理評價標籤 可在這處理

      let shopScoreObj = {};
      let totalScore = 0;
      let commentNum = 0;
      item.comment.forEach((i) => {
        commentNum++;
        totalScore +=
          parseInt(i.variety) +
          parseInt(i.beauty) +
          parseInt(i.price) +
          parseInt(i.recommend) +
          parseInt(i.return) +
          parseInt(i.sweetness);
      });

      // console.log(totalScore, commentNum);
      shopScoreObj.shopId = item.shopId;
      shopScoreObj.commentNum = commentNum;
      shopScoreObj.avgScore = (totalScore / (commentNum * 6)).toFixed(2);
      totalScoreData.push(shopScoreObj);
    });
    // console.log(totalScoreData); //已有店家id、平均分數,評論數

    //把totalScoreData的資料整合進resaultData
    resaultData.forEach((shop) => {
      totalScoreData.forEach((item) => {
        if (shop.id == item.shopId) {
          shop.commentNum = item.commentNum;
          shop.avgScore = item.avgScore;
        }
      });
    });

    // 把整理好的這些資料存進local storage裡面
    localStorage.setItem("resaultData", JSON.stringify(resaultData));
    // console.log(resaultData);
    searchSort.addEventListener("change", sortList);
    renderShopList();
    drawMap();
  }
}

// 排序按鈕
function sortList(e) {
  // 用 評價最高 測試寫
  console.log(e.target.value);
  console.log(resaultData);
  if (e.target.value === "評價最高") {
    resaultData.sort((a, b) => {
      return b.avgScore - a.avgScore;
    });
  }

  if (e.target.value === "關聯度最高") {
    resaultData.sort((a, b) => {
      return b.searchItem.length - a.searchItem.length;
    });
  }

  console.log(resaultData);
  renderShopList();
}

//渲染地圖
function drawMap() {
  // console.log(resaultData);

  let drawMapData = [];
  resaultData.forEach((item) => {
    let shopObj = {};
    shopObj.shopName = item.shopName;
    shopObj.lat = item.lat;
    shopObj.lng = item.lng;
    shopObj.MrtStation = item.MrtStation;
    // shopObj.shopUrl = `/shop/${item.id}`;
    shopObj.shopId = item.id;
    // console.log(shopObj);
    drawMapData.push(shopObj);
  });
  // console.log(drawMapData);
  // 25.0526898 121.5182023 中山站座標
  //定位座標
  let map = L.map("map", {
    center: [25.0526898, 121.5182023],
    zoom: 16, //縮放程度
  });

  // console.log(map);
  //把圖資拉進來
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  //換marker顏色
  let goldIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  // 使用套件新增一個markers群組 加進地圖裡 (增加網站效能)
  let markers = L.markerClusterGroup().addTo(map);

  drawMapData.forEach((shop) => {
    //   console.log(shop.shopName, shop.lat, shop.lng);
    //把各個小marker的資料組合好之後 用markers包起來並新增圖層
    markers.addLayer(
      L.marker([shop.lat, shop.lng], { icon: goldIcon })
        .addTo(map)
        .bindPopup(
          `  <span style="color:gray" >${shop.MrtStation} </span><h2 style="font-size:1rem;font-weight:600;line-height:1.2rem;margin:.5rem 0 " > ${shop.shopName}  </h2>

      <a style="text-decoration:none;padding:.3rem .5rem;background-color:#ffb330;border-radius:10px;color:white;margin:.5rem auto;display:block;text-align:center;"   href="/IJiaDi-sideproject/app/shop.html?id=${shop.shopId}">查看店家資訊</a>
      `
        )
        .openPopup()
    );
  });
}

// // 渲染店家資訊
const searchResultList = document.querySelector(".searchResultList");

function renderShopList() {
  //甜點tag
  let rearchSweetItem = sweetItem;

  resaultData.forEach((item) => {
    let str = "";
    item.sweetItem.forEach((i) => {
      rearchSweetItem.forEach((sweetItem) => {
        if (i.trim() === sweetItem.trim()) {
          str += `#${sweetItem} `;
        }
      });
    });
    // console.log(str);
    item.searchItem = str;
  });

  // img src="./pic/shopPic/13on-z4BJGODf6O4-unsplash.jpg"

  //若無評價分數
  let str = "";
  resaultData.forEach((item) => {
    if (item.avgScore === "NaN") {
      item.avgScore = "";
    }

    str += ` <div class="searchResultItem">
    <div class="searchResultImgWrap">
    <a href="./shop.html?id=${item.id}""
      ><img class="imgStyle" src="${item.picture[0]}" alt="店家照片" />
    </a>
  </div>
    <div class="shopItem">
      <h4>${item.shopName}<span data-shopId=${item.id} > ${item.avgScore} ★</span></h4>
      <div class="tag">
        <button class="tagButton">${item.MrtStation}</button>
      </div>
      <p>
        ${item.address} <br />
        營業時間：${item.openTime}
      </p>
      <div class="keyWordTag">
        <div class="keyWordTagStyle" href="">${item.searchItem}</div
        >
      </div>

      <div class="saveState" data-shopId="${item.id}"  >
      <i data-shopId="${item.id}" style="font-size:1.5rem; color:#e6a12c" class="fa-regular fa-heart"></i>
      </div>
      <button class="readMoreBtn">
        <a href="./shop.html?id=${item.id}"> More ></a>
      </button>
    </div>
  </div> `;
  });

  searchResultList.innerHTML = str;
  renderSaveStatus();
}

//渲染收藏按鈕
function renderSaveStatus() {
  if (bookmarkData.length == 0) {
    return;
  }

  const allSaveState = document.querySelectorAll(".saveState");
  Array.from(allSaveState).forEach((item) => {
    bookmarkData.forEach((i) => {
      if (i.shopId == item.getAttribute("data-shopId")) {
        // console.log(i.shopId);
        // console.log(item.getAttribute("data-shopId"));
        item.innerHTML = `<i data-bookmarkId="${i.id}" style="font-size:1.5rem; color:#e6a12c" class="fa-solid fa-heart"></i>`;
      }
    });
  });
}

//按下收藏按鈕(先判斷是否為會員 不是->return / 是-> 先判斷是否已在收藏清單裡 ( 若是(代表使用者取消收藏)-> delete 該筆comment資料renderSaveStatus() |  若否> post 新增comment資料 renderSaveStatus() ) )

searchResultList.addEventListener("click", changeSaveStatus);
function changeSaveStatus(e) {
  if (e.target.getAttribute("class") == "fa-regular fa-heart") {
    if (!localUserId) {
      alert("登入會員後才可收藏喔!");
      return;
    }
  }

  // fa-solid fa-heart 實心 已收藏
  // fa-regular fa-heart 空心 未收藏

  const vol = e.target.getAttribute("class");
  const targetShopId = e.target.parentElement.getAttribute("data-shopId");
  const targetbookmarkId = e.target.getAttribute("data-bookmarkId");
  if (vol === "fa-solid fa-heart") {
    // console.log("取消收藏");
   
    unSaveShop(targetbookmarkId);
    e.target.setAttribute("class", "fa-regular fa-heart");
  } else if (vol === "fa-regular fa-heart") {
    // console.log("收藏店家");
    // console.log(e.target.parentElement);
    // console.log(targetShopId);
    saveShop(targetShopId);
    e.target.setAttribute("class", "fa-solid fa-heart");
  } else {
    return;
  }
}

// 加入收藏 post請求
function saveShop(targetShopId) {
  console.log(targetShopId);
  let obj = {
    userId: localUserId,
    shopId: targetShopId,
    type: "local",
  };

  axios
    .post(`${jsonUrl}/600/bookmarks`, obj)
    .then(function (res) {
      console.log(res);
      alert("成功收藏店家!");
    })
    .catch(function (error) {
      console.log(error);
      if (error.response.data === "jwt expired") {
        alert("憑證逾期，請重新登入");
        // 頁面導回登入頁 強制重新登入
      
        location.href = "/IJiaDi-sideproject/app/login.html";
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userName");
        localStorage.removeItem("userId");
      }
    });
}

// 移除收藏 delete請求
function unSaveShop(targetbookmarkId) {
  // console.log(targetShopId);
  // http://localhost:3000/644/bookmarks?userId=7&shopId=7

  let data = { userId: localUserId };

  axios
    .delete(`${jsonUrl}/600/bookmarks/${targetbookmarkId}`, data)
    .then(function (res) {
      console.log(res);
      alert("已從收藏匣中移除");
    })
    .catch(function (error) {
      console.log(error);
     
    });
}
