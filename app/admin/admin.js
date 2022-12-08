const jsonUrl = "http://localhost:3000";

const userTitle = document.querySelector(".userTitle");
const resumeTitle = document.querySelector(".resumeTitle");
const showData = document.querySelector(".showData");
const chooseBtn = document.querySelector(".chooseBtn");
const memberListBtn = document.querySelector(".memberListBtn");
const resumeListBtn = document.querySelector(".resumeListBtn");
const userList = document.querySelector(".userList");
const resumeList = document.querySelector(".resumeList");
const userFrom = document.querySelector(".userFrom");
const resumeFrom = document.querySelector(".resumeFrom");
const adminLogoutBtn = document.querySelector(".adminLogoutBtn");
const chartArea = document.querySelector(".chartArea");

//渲染管理者名字
const adminNameArea = document.querySelector(".adminNameArea");
const adminName = localStorage.getItem("adminName");
adminNameArea.textContent = adminName;

// 渲染圖表
let userChartArr = [];
let shopChartArr = [];

// 按下登出按鈕
adminLogoutBtn.addEventListener("click", (e) => {
  alert("成功登出後台");
  location.href = "/adminLogin.html";
});

//下方資料顯示
let userData = [];
let resumeData = [];

//按鈕區塊監聽
chooseBtn.addEventListener("click", (e) => {
  let targetBtn = e.target.getAttribute("class");

  if (targetBtn === "chooseBtn") {
    return;
  } else if (targetBtn === "memberListBtn") {
    getUserData(e);
    //要設定按另一鈕 效果取消
    resumeListBtn.style = "background:none";
    resumeTitle.style = "display:none";
    resumeList.style = "display:none";
    chartArea.style = "display:none";
    // 渲染圖表資料清空 (解決換頁資料重複抓取的問題 )
    userChartArr = [];
    shopChartArr = [];
  } else if (targetBtn === "resumeListBtn") {
    openResume(e);
    //要設定按另一鈕 效果取消
    memberListBtn.style = "background:none";
    userTitle.style = "display:none";
    userList.style = "display:none";
  }
});

// 按下會員管理按鈕
function getUserData(e) {
  e.target.style = "background:rgb(153, 127, 9); color:white; ";
  userTitle.style = "display:block";
  userList.style = "display:block";
  axios
    .get(`${jsonUrl}/users`)
    .then((res) => {
      console.log(res.data);
      userData = res.data;
      renderUserList();
    })
    .catch((error) => {
      console.log(error);
    });
}

function renderUserList() {
  console.log(userData);
  let str = "";
  userData.forEach((item) => {
    str += ` <tr class="userItem">
<td width="20%">${item.id}</td>
<td width="40%">${item.userName}</td>
<td width="40%">${item.email}</td>
</tr> `;
  });

  userList.innerHTML = str;
}

//評價管理按鈕
function openResume(e) {
  e.target.style = "background:rgb(153, 127, 9); color:white;  ";
  resumeTitle.style = "display:block";
  resumeList.style = "display:block";
  chartArea.style = "display:flex";
  getResumeData();
}

function getResumeData() {
  console.log("有跑這段");
  axios
    .get(`${jsonUrl}/comments`)
    .then((res) => {
      console.log(res);
      console.log(res.data);
      resumeData = res.data;
      renderResumeList();
      renderChart();
    })
    .catch((error) => {
      console.log(error);
    });
}

// 渲染圖表
// let userChartArr = [];
// let shopChartArr = [];

function renderChart() {
  // console.log(resumeData);

  let userResumeNum = {};
  let shopResumeNum = {};

  resumeData.forEach((item) => {
    //整理會員評論數
    // console.log(item.userId);
    if (userResumeNum[`userId ${item.userId}`] === undefined) {
      userResumeNum[`userId ${item.userId}`] = 1;
    } else {
      userResumeNum[`userId ${item.userId}`] += 1;
    }

    // 整理店家評論數
    // console.log(item.shopId);
    if (shopResumeNum[`shopId ${item.shopId}`] === undefined) {
      shopResumeNum[`shopId ${item.shopId}`] = 1;
    } else {
      shopResumeNum[`shopId ${item.shopId}`] += 1;
    }
  });

  //會員評論數C3資料
  console.log(userResumeNum);

  let userArr = Object.keys(userResumeNum);

  // console.log(userArr);
  userArr.forEach((item) => {
    let arr = [];
    arr.push(item);
    arr.push(userResumeNum[`${item}`]);
    userChartArr.push(arr);
  });

  console.log(userChartArr);

  //店家評論數C3資料
  console.log(shopResumeNum);

  let shopArr = Object.keys(shopResumeNum);

  // console.log(shopArr);
  shopArr.forEach((item) => {
    let arr = [];
    arr.push(item);
    arr.push(shopResumeNum[`${item}`]);
    shopChartArr.push(arr);
  });

  console.log(shopChartArr);

  drawChart(userChartArr);
  drawChart(shopChartArr);
}

// 渲染圖表

function drawChart(data) {
  console.log(userChartArr);
  let memberActiveChart = c3.generate({
    bindto: ".memberActiveChart",

    data: { columns: userChartArr, type: "bar", labels: true },
    bar: {
      width: {
        ratio: 0.5,
      },
    },
    axis: {
      x: {
        type: "category",
        categories: ["會員評價活躍度"],
      },
    },
  });

  let shopResumeChart = c3.generate({
    bindto: ".shopResumeChart",

    data: { columns: shopChartArr, type: "donut", labels: true },
    donut: {
      title: "店家評論數占比",
    },
  });
}

//渲染評價列表
function renderResumeList() {
  let str = "";
  console.log(resumeData);

  resumeData.forEach((item) => {
    str += `  <tr>
<td width="5%"> <button class="delBtn" data-resumeId="${item.id}"> 刪除 </button></td>
<td width="10%">${item.userId}</td>
<td width="10%">${item.shopId}</td>
<td width="20%">${item.text}</td>
<td width="10%">${item.sweetness}</td>
<td width="10%">${item.beauty}</td>
<td width="10%">${item.price}</td>
<td width="10%">${item.recommend}</td>
<td width="10%">${item.return}</td>
<td width="10%">${item.variety}</td>
<td width="10%">${item.releaseTime}</td>
</tr> `;
  });

  resumeList.innerHTML = str;
}

// 評價列表 刪除按鈕

resumeList.addEventListener("click", deleteResume);

function deleteResume(e) {
  if (e.target.getAttribute("class") === null) {
    return;
  } else if (e.target.getAttribute("class") === "delBtn") {
    let deleteResumeId = e.target.getAttribute("data-resumeId");
    deleteRequest(deleteResumeId);
  }
}

function deleteRequest(deleteResumeId) {
  axios
    .delete(`${jsonUrl}/comments/${deleteResumeId} `)
    .then((res) => {
      console.log(res);

      alert("已刪除該評論");
      getResumeData();
    })
    .catch((error) => {
      console.log(error);
    });
}
