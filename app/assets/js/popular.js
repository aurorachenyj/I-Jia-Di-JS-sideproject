const returnList = document.querySelector(".returnList");
const sweetList = document.querySelector(".sweetList");
const priceList = document.querySelector(".priceList");

getAllResumeData();
let allResumeData = [];

function getAllResumeData() {
  axios
    .get(`${jsonUrl}/comments`)
    .then((res) => {
      console.log(res);
      allResumeData = res.data;
      tidyData();
    })
    .catch((error) => {
      console.log(error);
    });
}

let returnShopIdArr = [];
let sweetnessShopIdArr = [];
let priceShopIdArr = [];

let returnShopData = [];
let sweetnessShopData = [];
let priceShopData = [];

function tidyData() {
  console.log(allResumeData);

  //處理回訪意願最高資料

  let returnObj = {};
  let sweetnessObj = {};
  let priceObj = {};
  allResumeData.forEach((item) => {
    console.log(item.shopId, item.return);

    if (item.return > 4) {
      if (returnObj[item.shopId] === undefined) {
        returnObj[item.shopId] = 1;
      } else {
        returnObj[item.shopId] += 1;
      }
    }

    if (item.sweetness >= 4) {
      if (sweetnessObj[item.shopId] === undefined) {
        sweetnessObj[item.shopId] = 1;
      } else {
        sweetnessObj[item.shopId] += 1;
      }
    }

    if (item.price >= 4) {
      if (priceObj[item.shopId] === undefined) {
        priceObj[item.shopId] = 1;
      } else {
        priceObj[item.shopId] += 1;
      }
    }
  });

  returnShopIdArr = Object.keys(returnObj);
  sweetnessShopIdArr = Object.keys(sweetnessObj);
  priceShopIdArr = Object.keys(priceObj);

  getArrData(returnShopIdArr, returnShopData);
  getArrData(sweetnessShopIdArr, sweetnessShopData);
  getArrData(priceShopIdArr, priceShopData);
}

function getArrData(arr, data) {
  console.log(returnShopIdArr);

  arr.forEach((item) => {
    axios
      .get(`${jsonUrl}/shops/${item}`)
      .then((res) => {
        // console.log(res);
        // console.log(res.data);
        data.push(res.data);
        console.log(data);
        // renderList(data);
        renderList(returnList, returnShopData);
        renderList(sweetList, sweetnessShopData);
        renderList(priceList, priceShopData);
      })
      .catch((error) => {
        console.log(error);
      });
  });
}

function renderList(targetArea, data) {
  //   console.log(data);
  console.log(returnShopData);
  console.log(sweetnessShopData);
  console.log(priceShopData);

  let str = "";
  data.forEach((item) => {
    str += ` <div class="swiper-slide">
<a href="/app/shop.html?id=${item.id}">
  <img style="border-radius:30px;box-shadow: 3px 2px 3px rgba(0,0,0,0.5);" src="${item.picture[0]}" />
</a>
<p style="text-align: center">${item.shopName}</p>
</div>`;
  });

  targetArea.innerHTML = str;
}
