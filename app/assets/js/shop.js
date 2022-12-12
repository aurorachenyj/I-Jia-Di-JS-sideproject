const getShopId = location.href.split("=")[1];
console.log(getShopId);
//提取local storage裡的resaultData
let getResaultData = JSON.parse(localStorage.getItem("resaultData"));
console.log(getResaultData);
const saveStatus = document.querySelector('[data-action="saveStatus"]');
console.log(saveStatus);
const userPic = document.querySelector(".userPic");
// shopContentRender();
getShopData();
bookmark();
RenderMemberPic();

let shopData = [];

function getShopData() {
  console.log(jsonUrl);
  console.log(getShopId);
  axios
    .get(`${jsonUrl}/shops/${getShopId}`)
    .then((res) => {
      console.log(res);
      // console.log(res.data);
      shopData = res.data;
      renderShopData();
    })
    .catch((error) => {
      console.log(error);
    });
}

function renderShopData() {
  //console.log(shopData);
  innerMap();
  localStorage.setItem("shopName", shopData.shopName);

  const shopInfo = document.querySelector(".shopInfo");
  let str = `<h3>${shopData.shopName} <span class="star"> 分數 ★</span></h3>

    <div class="tag" id="shopInfoTag">
     
    </div>
  
    <p class="shpoInfoText">
      地址：${shopData.address} <br />
  
      營業時間：${shopData.openTime} <br />
      電話: ${shopData.tel}
    </p> `;

  shopInfo.innerHTML = str;

  //渲染圖片
  const shopImgArea = document.querySelector(".shopImgArea");
  console.log(shopImgArea);
  let picUrlStr = "";
  shopData.picture.forEach((pic) => {
    picUrlStr += `<img class="imgStyle" src="${pic}" alt="店家照片" />  `;
  });
  shopImgArea.innerHTML = picUrlStr;

  //渲染甜點tag
  const keyWordTag = document.querySelector(".keyWordTag");
  let keyWordStr = "";
  shopData.sweetItem.forEach((item) => {
    console.log(item);
    keyWordStr += `<a class="keyWordTagStyle">#${item} </a>`;
  });
  keyWordTag.innerHTML = keyWordStr;
  getOtherReview();
}

// 店家地圖
function innerMap() {
  console.log(shopData);
  let shopMap = L.map("searchMap", {
    center: [shopData.lat, shopData.lng],
    zoom: 14, //縮放程度
  });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(shopMap);

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

  L.marker([shopData.lat, shopData.lng], { icon: goldIcon })
    .addTo(shopMap)
    .bindPopup(`<h3>${shopData.shopName}</h3>`)
    .openPopup();
}

//渲染收藏按鈕狀態
function bookmark() {
  if (!localUserId) {
    return;
  }

  const Auth = `Bearer ${localStorage.getItem("accessToken")}`;
  axios.defaults.headers.common.Authorization = Auth;

  axios
    .get(`${jsonUrl}/400/bookmarks?userId=${localUserId}`, {
      userId: localUserId,
    })
    .then(function (res) {
      console.log(res.data);
      console.log(getShopId);

      res.data.forEach((item) => {
        if (item.shopId == getShopId) {
          saveStatus.setAttribute("data-shopId", item.shopId);
          saveStatus.setAttribute("data-bookmarkId", item.id);
          saveStatus.textContent = "已收藏";
        } else if (saveStatus.getAttribute("data-shopId") == getShopId) {
          saveStatus.textContent = "已收藏";
        } else {
          saveStatus.textContent = "收藏店家";
        }
      });
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

function RenderMemberPic() {
  if (!localUserId) {
    return;
  }

  // if (localStorage.getItem("userPic") === "undefined") {
  //   //待處理
  //   const randomNum = Math.floor(Math.random() * 10);
  //   userPic.setAttribute("src", `./pic/defaultUserPic/${randomNum}.png`);
  // } else {
  let pic = localStorage.getItem("userPic");
  userPic.setAttribute("src", pic);
}
// }

// 小按鈕 功能們
// https://www.google.com.tw/maps/search/
const buttonArea = document.querySelector(".buttonArea");
buttonArea.addEventListener("click", buttonAction);

function buttonAction(e) {
  // console.log(e.target.getAttribute("data-action"));
  let shopName = localStorage.getItem("shopName");
  console.log(shopName);

  const pressTarget = e.target.getAttribute("data-action");
  if (pressTarget === null) {
    return;
  }

  if (pressTarget === "openMap") {
    window.open(`https://www.google.com.tw/maps/search/${shopName}`);
  } else if (pressTarget === "copyLink") {
    // console.log(e.target.parentElement);
    const str = location.href;
    console.log(str);
    navigator.clipboard
      .writeText(str)
      .then(() => {
        alert("已將連結複製到剪貼簿!");
      })
      .catch((err) => {
        alert("此功能暫無法使用，請見諒");
      });
  } else if (pressTarget === "saveStatus") {
    if (!localUserId) {
      alert("登入才可收藏店家喔");
      return;
    } else if (localUserId) {
      if (e.target.textContent.trim() === "收藏店家") {
        // e.target.textContent = "已收藏";
        console.log("成功收藏店家");
        saveShop(getShopId);
        bookmark();
      } else if (e.target.textContent.trim() === "已收藏") {
        console.log("取消收藏");
        saveStatus.removeAttribute("data-shopId");
        const bookmarkId = saveStatus.getAttribute("data-bookmarkId");
        unSaveShop(bookmarkId);
        bookmark();
      }
    }
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
      saveStatus.textContent = "已收藏";
      // bookmark();
    })
    .catch(function (error) {
      console.log(error);
      if (error.response.data === "jwt expired") {
        alert("憑證逾期，請重新登入");

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
      saveStatus.textContent = "收藏店家";
      // bookmark();
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

//觀看其他人的評價

//抓評價資料和會員資料
let otherReviewData = [];
function getOtherReview() {
  axios
    .get(`${jsonUrl}/comments?shopId=${getShopId}&_expand=user`)
    .then(function (response) {
      otherReviewData = response.data;
      console.log(otherReviewData);
      renderOtherReview();
      calcAndRenderShopTag();
    })
    .catch(function (error) {
      console.log(error);
    });
}

//店家評價tag計算和渲染
function calcAndRenderShopTag() {
  const shopInfoTag = document.querySelector("#shopInfoTag");
  let shopInfoTagStr = "";
  console.log(otherReviewData);
  let returnAvgScore = 0;
  let recommendAvgScore = 0;
  let beautyAvgScore = 0;
  let priceAvgScore = 0;
  let sweetnessAvgScore = 0;
  let varietyAvgScore = 0;

  otherReviewData.forEach((item) => {
    returnAvgScore += parseInt(item.return) / otherReviewData.length;
    recommendAvgScore += parseInt(item.recommend) / otherReviewData.length;
    beautyAvgScore += parseInt(item.beauty) / otherReviewData.length;
    priceAvgScore += parseInt(item.price) / otherReviewData.length;
    sweetnessAvgScore += parseInt(item.sweetness) / otherReviewData.length;
    varietyAvgScore += parseInt(item.variety) / otherReviewData.length;
  });

  console.log(
    returnAvgScore.toFixed(2),
    recommendAvgScore.toFixed(2),
    beautyAvgScore.toFixed(2),
    priceAvgScore.toFixed(2),
    sweetnessAvgScore.toFixed(2),
    varietyAvgScore.toFixed(2)
  );

  if (returnAvgScore.toFixed(2) >= 4) {
    shopInfoTagStr += ` <button class="tagButton">回訪意願高</button>`;
  }

  if (recommendAvgScore.toFixed(2) >= 4) {
    shopInfoTagStr += ` <button class="tagButton">最多人推薦</button>`;
  }

  if (beautyAvgScore.toFixed(2) >= 4) {
    shopInfoTagStr += ` <button class="tagButton">超好拍</button>`;
  }

  if (priceAvgScore.toFixed(2) >= 4) {
    shopInfoTagStr += ` <button class="tagButton">價格實惠</button>`;
  }

  if (sweetnessAvgScore.toFixed(2) > 4) {
    shopInfoTagStr += ` <button class="tagButton">螞蟻人必收</button>`;
  }

  if (varietyAvgScore.toFixed(2) >= 4) {
    shopInfoTagStr += ` <button class="tagButton">甜點種類多</button>`;
  }

  shopInfoTag.innerHTML = shopInfoTagStr;

  const star = document.querySelector(".star");
  let totalAvgScore = (
    (returnAvgScore +
      recommendAvgScore +
      beautyAvgScore +
      priceAvgScore +
      sweetnessAvgScore +
      varietyAvgScore) /
    6
  ).toFixed(2);

  console.log(totalAvgScore);
  if (totalAvgScore == 0) {
    totalAvgScore = "";
  }
  star.textContent = `${totalAvgScore} ★`;
}

//渲染他人評價
function renderOtherReview() {
  const reviewNum = document.querySelector("#reviewNum");
  reviewNum.textContent = `(共${otherReviewData.length}則)`;
  const allReview = document.querySelector("#allReview");
  let str = "";
  console.log(otherReviewData);
  otherReviewData.forEach((item) => {
    // 處理tag字串
    let tagStr = "";
    if (item.return >= 4) {
      tagStr += `<button class="tagButton">回訪意願高</button
      >`;
    }
    if (item.recommend > 4) {
      tagStr += `<button class="tagButton">激推</button
      >`;
    } else if (item.recommend == 4) {
      tagStr += `<button class="tagButton">推推</button
    >`;
    }

    if (item.beauty >= 4) {
      tagStr += `<button class="tagButton">超好拍</button
      >`;
    }
    if (item.price >= 4) {
      tagStr += `<button class="tagButton">價錢實惠</button
      >`;
    } else if (item.price <= 3) {
      tagStr += `<button class="tagButton">價位稍高</button
      >`;
    }

    if (item.sweetness > 4) {
      tagStr += `<button class="tagButton">螞蟻人最愛</button
      >`;
    } else if (item.sweetness == 4) {
      tagStr += `<button class="tagButton">甜度適中</button
      >`;
    }

    if (item.variety >= 4) {
      tagStr += `<button class="tagButton">品項選擇多</button
      >`;
    } else if (item.variety < 3) {
      tagStr += `<button class="tagButton">品項較少</button
      >`;
    }

    console.log(tagStr);

    // 渲染
    str += ` <div class="otherReviewWrap wrapStyle">
     <div class="otherMember">
       <img  src="${item.user.InfoPic}" alt="" />
       <p> ${item.user.userName}</p>
     </div>
     <div class="otherReviewContent">
     <span class="scoreLabel"> ${(
       (parseInt(item.variety) +
         parseInt(item.beauty) +
         parseInt(item.price) +
         parseInt(item.recommend) +
         parseInt(item.return) +
         parseInt(item.sweetness)) /
       6
     ).toFixed(2)} ★ </span><br />
       <p>

         ${item.text}
       </p>
       <div class="tagArea">
         ${tagStr}
       </div>
       <span class="gray">發布時間：${item.releaseTime} </span>
     </div>

     <img src="${item.picUrl}"  alt="" srcset="" />
   </div>`;
  });
  allReview.innerHTML = str;
}

//會員發表評價

//確認是否已登入
const userId = localStorage.getItem("userId");
const userName = localStorage.getItem("userName");
const userNameStatus = document.querySelector(".userNameStatus");

console.log(userName);
console.log(userNameStatus);
if (userId) {
  userNameStatus.textContent = userName;
} else {
  userNameStatus.textContent = "登入留下評價吧！";
  const SendReviewBtn = document.querySelector(".SendReviewBtn");
  SendReviewBtn.addEventListener("click", (e) => {
    alert("登入會員才可評論喔");
    return;
  });
}

//獲取各評等分數和渲染星星 //
const starWraps = Array.from(document.querySelectorAll(".starWrap"));
console.log(starWraps);
starWraps.forEach((wrap) => {
  wrap.addEventListener("click", starData);
});

let scoreObj = {};
function starData(e) {
  const type = e.target.parentElement.classList[1];
  const score = e.target.dataset[`${type}`];
  //若使用者點到空白處就return中斷code
  if (type === undefined || score === undefined) {
    return;
  }

  renderStar(type, score);

  if (scoreObj[`${type}`] == undefined) {
    scoreObj[`${type}`] = score;
  } else {
    scoreObj[`${type}`] = score;
  }

  console.log(scoreObj); //正確的scoreObj數量只在這裡面 //
}

//星星點擊填滿效果
function renderStar(type, score) {
  console.log(type, score);

  const targetType = document.querySelector(`.${type}`);
  const stars = Array.from(targetType.querySelectorAll(".star"));
  stars.forEach((item) => {
    item.classList.remove("click");
    for (let i = 0; i < score; i++) {
      stars[i].classList.add("click");
    }
  });
}

const reviewText = document.querySelector(".reviewArea");
const SendReviewBtn = document.querySelector(".SendReviewBtn");

//使用者上傳店家圖片
const previewPic = document.querySelector(".previewPic");
const uploadShopPic = document.querySelector(".uploadShopPic");
let uploadShopPicUrl = "";

uploadShopPic.addEventListener("change", (e) => {
  if (!userId) {
    alert("登入會員才可評論喔");
    return;
  }

  const formdata = new FormData();
  formdata.append("image", e.target.files[0]);

  fetch("https://api.imgur.com/3/image/", {
    method: "post",
    headers: {
      Authorization: "Client-ID 02c9ba62611c9c8",
    },
    body: formdata,
  })
    .then((data) => data.json())
    .then((data) => {
      console.log(data);
      uploadShopPicUrl = data.data.link;
      previewPic.src = uploadShopPicUrl;

      //按下送出鍵後抓取內容
      SendReviewBtn.addEventListener("click", getReviewData);
    });
});

//不上傳店家照片也可送出評論
SendReviewBtn.addEventListener("click", getReviewData);
function getReviewData(e) {
  console.log(uploadShopPicUrl);
  console.log(reviewText.value);
  console.log(scoreObj);

  if (!userId) {
    return;
  }

  if (reviewText.value === "" || Object.keys(scoreObj).length < 6) {
    alert("還有一些地方沒填到喔!!");
    return;
  }

  if (uploadShopPicUrl == "") {
    uploadShopPicUrl = "./assets/images/store.png";
  }

  console.log(uploadShopPicUrl);
  scoreObj.text = reviewText.value;
  scoreObj.shopId = getShopId;
  scoreObj.userId = userId;
  scoreObj.picUrl = uploadShopPicUrl;

  let date = new Date();
  console.log(date.toISOString().split("T")[0]);
  scoreObj.releaseTime = date.toISOString().split("T")[0];
  console.log(scoreObj);

  const Auth = `Bearer ${localStorage.getItem("accessToken")}`;
  console.log(Auth);
  axios.defaults.headers.common.Authorization = Auth;
  axios
    .post(`${jsonUrl}/644/comments`, scoreObj)
    .then(function (response) {
      console.log(response);
      if (response.request.status === 201) {
        alert("成功送出評論"); //再把值清空

        clearOldResume();
      }

      getOtherReview();
    })
    .catch(function (error) {
      console.log(error);
      if (error.response.data === "jwt expired") {
        alert("請重新登入後再進行評價");
        // 頁面導回登入頁 強制重新登入
        location.href = "/IJiaDi-sideproject/app/login.html";
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userName");
        localStorage.removeItem("userId");
      }
    });
}

function clearOldResume() {
  console.log("clearOldResume");

  //暫用這方法清空值(可再優化)
  reviewText.value = "";
  renderStar("sweetness", 0);
  renderStar("beauty", 0);
  renderStar("price", 0);
  renderStar("recommend", 0);
  renderStar("return", 0);
  renderStar("variety", 0);
  previewPic.src = "./assets/images/fackReviewImg.png";
}
