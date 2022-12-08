// console.log(axios);

// let jsonUrl = "http://localhost:3004";

//初始化 //捷運和搜尋店家的值尚未清空
// init();
function init() {
  const searchBar = document.querySelector(".searchBar");
  const itemText = searchBar.querySelector(".text");

  itemText.textContent = "";
  itemOptions.forEach((item) => {
    if (item.checked) {
      item.checked = false;
    }
  });
  checkItemWord = [];
}

//顯示勾選的甜點在欄位上
let labelitem = document.querySelector(".dropdown .item");
let defaultSatus = document.querySelector(".default");
let itemOptions = document.querySelectorAll(
  '.dropdown .item input[type="checkbox"]'
);
let checkItemWord = [];
itemOptions.forEach((item) => {
  item.addEventListener("click", (e) => {
    if (e.target.checked) {
      checkItemWord.push(item.value);
    } else if (e.target.checked === false) {
      deleteItem();
    }

    if (checkItemWord.length > 3) {
      alert("最多只可選擇3項");
      e.target.checked = false;
      deleteItem();
      // console.log(checkItemWord);
      return;
    }

    function deleteItem() {
      let findIndex = checkItemWord.indexOf(item.value);
      checkItemWord.splice(findIndex, 1);
    }
    // console.log(checkItemWord);
    labelitem.textContent = checkItemWord.join(" ");
  });
});
//多選checkbox js寫法完整版 ▲

//抓出使用者輸入的資料
const mrt = document.querySelector(".mrt");
const searchShop = document.querySelector(".searchShop");
const searchBtn = document.querySelector(".searchBtn");

//捷運站點的值
let tempData = [];
mrt.addEventListener("change", (e) => {
  tempData.push(e.target.value);
});

//使用者最終選擇的捷運站和甜點值和店家值
searchBtn.addEventListener("click", getSearchData);
let searchData = [];
function getSearchData(e) {
  console.log(mrt.value);

  if (searchShop.value == "") {
    if (mrt.value === "未選擇" && checkItemWord.length < 1) {
      alert("請選擇至少1種甜點或捷運站點");
      return;
    }
  }
  const station = tempData[tempData.length - 1];
  searchData.push({
    MrtStation: station,
    sweetItem: checkItemWord,
    shopName: searchShop.value,
  });

  let target = searchData.length - 1;
  location.href = `/app/search-page.html?sweetItem=${searchData[target].sweetItem}&station=${searchData[target].MrtStation}&shopName=${searchData[target].shopName} `; // 頁面跳轉後用網址帶參數傳值)
  // init();
  console.log(searchData); // 頁面跳轉後裡面的值就不見了 (如果想要利用 要存在local storage )
}

// //點menu bar 找甜甜 地圖預設顯示
// const menuBarSearch = document.querySelector(".menuBarSearch");
// menuBarSearch.addEventListener("click", mapInit);

// //地圖預設值

// function mapInit() {
//   let map = L.map("map", {
//     center: [25.0526898, 121.5182023],
//     zoom: 16, //縮放程度
//   });

//   //把圖資拉進來
//   L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//     attribution:
//       '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//   }).addTo(map);
// }

// // 搜尋頁面 顯示(已分開放在searchPage.js)
// const getUrlStr = location.href; //從網址把值取下來
// const url = new URL(getUrlStr);
// const sweetItem = url.searchParams.get("sweetItem").split(",");
// let station = url.searchParams.get("station");
// let shopName = url.searchParams.get("shopName");

// jsonSearchData();
// function jsonSearchData() {
//   // const getUrlStr = location.href;
//   // const url = new URL(getUrlStr);
//   // const sweetItem = url.searchParams.get("sweetItem").split(",");
//   // let station = url.searchParams.get("station");
//   // let shopName = url.searchParams.get("shopName");
//   console.log(sweetItem);
//   console.log(station);
//   console.log(shopName);
//   let str = "";
//   sweetItem.forEach((item) => {
//     str += `sweetItem_like=${item.trim()}&`;
//   });
//   console.log(str);
//   station = `MrtStation_like=${station}&`;
//   console.log(station);
//   shopName = `shopName_like=${shopName}&`;
//   console.log(shopName);
//   if (station === "MrtStation_like=undefined&") {
//     jsonStr = `${str}${shopName}`;
//   } else {
//     jsonStr = `${str}${station}${shopName}`;
//   }
//   console.log(jsonStr);

//   //把組好的字串拿去取值
//   axios
//     .get(`http://localhost:3000/shops?${jsonStr}`)
//     .then(function (response) {
//       resaultData = response.data;
//       console.log(resaultData);
//       findShopNameAndCalcScore();
//     })
//     .catch(function (error) {
//       console.log(error);
//     });

//   //  成功拿回搜尋的值了~
// }

// //抓回的資料整理
// function findShopNameAndCalcScore() {
//   console.log(resaultData);
//   let arr = [];
//   resaultData.forEach((item) => {
//     arr.push(item.id);
//   });
//   console.log(arr);

//   //   // 分別抓各店家的評價
//   let commentData = [];
//   arr.forEach((item) => {
//     //http://localhost:3000/comments/?shopId=22
//     axios
//       .get(`http://localhost:3000/comments/?shopId=${item}`)
//       .then(function (res) {
//         // console.log(res.data);

//         let obj = {};
//         obj.shopId = item;
//         obj.comment = res.data;
//         commentData.push(obj);
//         CalcShopScore();
//       });
//   });

//   console.log(commentData); //已存店家id和相對應的評價arr值

//   function CalcShopScore() {
//     let totalScoreData = [];
//     commentData.forEach((item) => {
//       //若要 處理評價標籤 可在這處理

//       let shopScoreObj = {};
//       let totalScore = 0;
//       let commentNum = 0;
//       item.comment.forEach((i) => {
//         commentNum++;
//         totalScore +=
//           parseInt(i.Variety) +
//           parseInt(i.beauty) +
//           parseInt(i.price) +
//           parseInt(i.recommend) +
//           parseInt(i.return) +
//           parseInt(i.sweetness);
//       });

//       // console.log(totalScore, commentNum);
//       shopScoreObj.shopId = item.shopId;
//       shopScoreObj.commentNum = commentNum;
//       shopScoreObj.avgScore = (totalScore / (commentNum * 6)).toFixed(2);
//       totalScoreData.push(shopScoreObj);
//     });
//     // console.log(totalScoreData); //已有店家id、平均分數,評論數

//     //把totalScoreData的資料整合進resaultData
//     resaultData.forEach((shop) => {
//       totalScoreData.forEach((item) => {
//         if (shop.id == item.shopId) {
//           shop.commentNum = item.commentNum;
//           shop.avgScore = item.avgScore;
//         }
//       });
//     });

//     console.log(resaultData);
//     renderShopList();
//     drawMap();
//   }
// }

// //渲染地圖
// function drawMap() {
//   console.log(resaultData);

//   let drawMapData = [];
//   resaultData.forEach((item) => {
//     let shopObj = {};
//     shopObj.shopName = item.shopName;
//     shopObj.lat = item.lat;
//     shopObj.lng = item.lng;
//     shopObj.MrtStation = item.MrtStation;
//     shopObj.shopUrl = `/shop/${item.id}`;
//     shopObj.shopId = item.id;
//     console.log(shopObj);
//     drawMapData.push(shopObj);
//   });
//   console.log(drawMapData);
//   // 25.0526898 121.5182023 中山站座標
//   //定位座標
//   let map = L.map("map", {
//     center: [25.0526898, 121.5182023], //定位點要改成變數
//     zoom: 16, //縮放程度
//   });
//   console.log(map);
//   //把圖資拉進來
//   L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//     attribution:
//       '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//   }).addTo(map);

//   //換marker顏色
//   let goldIcon = new L.Icon({
//     iconUrl:
//       "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png",
//     shadowUrl:
//       "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
//     iconSize: [25, 41],
//     iconAnchor: [12, 41],
//     popupAnchor: [1, -34],
//     shadowSize: [41, 41],
//   });

//   // 使用套件新增一個markers群組 加進地圖裡 (增加網站效能)
//   let markers = L.markerClusterGroup().addTo(map);

//   drawMapData.forEach((shop) => {
//     //   console.log(shop.shopName, shop.lat, shop.lng);
//     //把各個小marker的資料組合好之後 用markers包起來並新增圖層
//     markers.addLayer(
//       L.marker([shop.lat, shop.lng], { icon: goldIcon })
//         .addTo(map)
//         .bindPopup(
//           `  <span style="color:gray" >${shop.MrtStation} </span><h2 style="font-size:1rem;font-weight:600;line-height:1.2rem;margin:.5rem 0 " > ${shop.shopName}  </h2>

//       <a style="text-decoration:none;padding:.3rem .5rem;background-color:#ffb330;border-radius:10px;color:white;margin:.5rem auto;display:block;text-align:center;"   href=" ${shop.shopUrl} ">查看店家資訊</a>
//       `
//         )
//         .openPopup()
//     );
//   });
// }

// // ///////
// console.log(searchData);
// // // 渲染店家資訊 //卡在是否已收藏(感覺需要 json-server-auth 先驗證身分  )
// const searchResultList = document.querySelector(".searchResultList");
// console.log(searchResultList);

// function renderShopList() {
//   console.log(resaultData);
//   console.log(searchData);
//   //甜點tag
//   let rearchSweetItem = sweetItem;
//   console.log(rearchSweetItem);

//   resaultData.forEach((item) => {
//     let str = "";
//     item.sweetItem.forEach((i) => {
//       rearchSweetItem.forEach((sweetItem) => {
//         if (i === sweetItem) {
//           str += `#${sweetItem} `;
//         }
//       });
//     });
//     console.log(str);
//     item.searchItem = str;
//   });

//   console.log(resaultData);

//   //若無評價分數
//   let str = "";
//   resaultData.forEach((item) => {
//     if (item.avgScore === "NaN") {
//       item.avgScore = "";
//     }

//     str += ` <div class="searchResultItem">
//     <div class="shopItem">
//       <h4>${item.shopName}<span data-shopId=${item.id} > ${item.avgScore} ★</span></h4>
//       <div class="tag">
//         <button class="tagButton">${item.MrtStation}</button>
//       </div>
//       <p>
//         ${item.address} <br />
//         營業時間：${item.openTime}
//       </p>
//       <div class="keyWordTag">
//         <a class="keyWordTagStyle" href="">${item.searchItem}</a
//         >
//       </div>

//       <div class="saveState">
//         <img src="./pic/heartProperty.png" alt="" srcset="" />
//       </div>
//       <button class="readMoreBtn mr-2">
//         <a href="./shop.html"> More ></a>
//       </button>
//     </div>
//   </div> `;
//   });

//   searchResultList.innerHTML = str;

//   // shopContentRender(); //(左邊這個只是暫寫)前面應該要再有一個fn監聽按鈕事件,抓到該商家id後再跳轉
// }

// shopContent 店家資訊頁 資料邏輯 (頁面跳轉後資料沒有存下來 所以js code 先寫在同個檔案)

// 下方code 以 id 22 果昂甜品 為例撰寫
// function shopContentRender() {
//   console.log(resaultData);
//   let shopId = 22; //暫寫 之後要改
//   let shopObj = {};
//   resaultData.forEach((item) => {
//     if (item.id === shopId) {
//       shopObj = item;
//     }
//   });

//   console.log(shopObj);

//   //渲染店家資訊
//   const shopInfo = document.querySelector(".shopInfo");
//   let str = ` <h3>${shopObj.shopName} <span class="star">${shopObj.avgScore} ★</span></h3>

//   <div class="tag">
//     <button class="tagButton">價位中等</button>
//     <button class="tagButton">回訪意願高</button>
//   </div>

//   <p class="shpoInfoText">
//     地址：${shopObj.address} <br />
//     距離 中山站 XX 公尺 <br />
//     營業時間：${shopObj.openTime} <br />
//     電話: ${shopObj.tel}
//   </p> `;
//   shopInfo.innerHTML = str;

//   //渲染甜點tag //出不來怪怪的QQ
//   const keyWordTag = document.querySelector(".keyWordTag");
//   console.log(keyWordTag);
//   // let str2 = `<p class="keyWordTagStyle" ></p
//   // >`;
//   keyWordTag.textContent = `${shopObj.searchItem}`;

//   //他人評價

//   //抓評價資料和會員資料
//   //http://localhost:3000/comments?shopId=22&_expand=user
//   let otherReviewData = [];
//   axios
//     .get(`http://localhost:3000/comments?shopId=${shopId}&_expand=user`)
//     .then(function (response) {
//       otherReviewData = response.data;
//       console.log(otherReviewData);
//       renderOtherReview();
//     })
//     .catch(function (error) {
//       console.log(error);
//     });

//   function renderOtherReview() {
//     const reviewNum = document.querySelector("#reviewNum");
//     reviewNum.textContent = `(共${otherReviewData.length}則)`;
//     const allReview = document.querySelector("#allReview");
//     let str = "";

//     otherReviewData.forEach((item) => {
//       str += ` <div class="otherReviewWrap wrapStyle">
//      <div class="otherMember">
//        <img src="./pic/fackUserPic.png" alt="" />
//        <p> ${item.user.userName}</p>
//      </div>
//      <div class="otherReviewContent">
//      <span class="scoreLabel"> ${(
//        (parseInt(item.Variety) +
//          parseInt(item.beauty) +
//          parseInt(item.price) +
//          parseInt(item.recommend) +
//          parseInt(item.return) +
//          parseInt(item.sweetness)) /
//        6
//      ).toFixed(2)} ★ </span><br />
//        <p>

//          ${item.text}
//        </p>
//        <div class="tagArea">
//          <button class="tagButton">回訪意願高</button
//          ><button class="tagButton">螞蟻人最愛</button
//          ><button class="tagButton">品項選擇多</button>
//        </div>
//        <span class="gray">發布時間：2022-11-17 </span>
//      </div>

//      <img src="./pic/fackReviewImg.png" width="200px" alt="" srcset="" />
//    </div>`;
//     });
//     allReview.innerHTML = str;
//   }
// }
