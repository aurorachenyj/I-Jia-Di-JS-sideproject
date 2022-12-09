

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
  location.href = `/IJiaDi-sideproject/app/search-page.html?sweetItem=${searchData[target].sweetItem}&station=${searchData[target].MrtStation}&shopName=${searchData[target].shopName} `; // 頁面跳轉後用網址帶參數傳值)
  // init();
  console.log(searchData); 
}

