const memberEditItem = document.querySelector(".memberEditItem");
const userId = localStorage.getItem("userId");
const upLoadPic = document.querySelector(".upLoadPic");
const userName = localStorage.getItem("userName");

console.log(localStorage.getItem("userPic"));
initUserPic();
// 要再另設沒有大頭照的判斷

// Math.floor(Math.random() * 10)

// random bgcolor
//const randomColor = Math.floor(Math.random() * 16777215).toString(16);
/* <div style="border:1px solid gray; width:6rem;height:6rem;display: flex;
  justify-content: center;
  align-items: center;border-radius:50%;background-color:#${randomColor};font-size:3rem" >${
    userName.split("")[0]
  }</div> */

function initUserPic() {
  upLoadPic.innerHTML = `<img id="memberPic" style="border-radius:50%" src="${localStorage.getItem(
    "userPic"
  )}" alt="" />
<p>修改大頭貼</p><input type="file" id="file" />`;
}

const memberPic = document.querySelector("#memberPic");
const file = document.querySelector("#file");
let memberPicUrl = "";
console.log(memberPic);

//修改大頭貼

file.addEventListener("change", (e) => {
  const formData = new FormData();
  formData.append("image", e.target.files[0]);

  fetch("https://api.imgur.com/3/image/", {
    method: "post",
    headers: {
      Authorization: "Client-ID 02c9ba62611c9c8",
    },
    body: formData,
  })
    .then((data) => data.json())
    .then((data) => {
      console.log(data);
      memberPicUrl = data.data.link;
      memberPic.src = memberPicUrl;
      postPicUrl();
      //回傳的照片url位置
      // img.src = data.data.link;
      // url.innerText = data.data.link;
    });
});

//發送修改照片請求
function postPicUrl() {
  console.log(memberPicUrl);

  const Auth = `Bearer ${localStorage.getItem("accessToken")}`;
  console.log(Auth);

  axios.defaults.headers.common.Authorization = Auth;
  axios
    .patch(`${jsonUrl}/600/users/${userId} `, { InfoPic: memberPicUrl })
    .then((res) => {
      console.log(res);
      console.log(res.data.InfoPic);
      localStorage.setItem("userPic", res.data.InfoPic);

      initUserPic();
      alert("成功修改頭像");
    })
    .catch((error) => {
      console.log(error);
    });
}

//如果已登入 且userId相符---- 前面要多加一個判斷包住這個函式
initMemberData();

let memberData = [];
function initMemberData() {
  // const userId = localStorage.getItem("userId");
  console.log(userId);

  axios
    .get(`${jsonUrl}/users/${userId}`)
    .then(function (response) {
      console.log(response.data);
      memberData = response.data;
      getMemberDataAndRender();
    })
    .catch(function (error) {
      console.log(error);
    });
}

// 若使用者按登出之後 不可造訪會員專區和收藏匣(要寫在all.js裡面 )
function getMemberDataAndRender() {
  memberEditItem.innerHTML = ` <label for="userName">用戶名稱 </label
  ><input
    name="userName"
    id="userName"
    class="inputStyle"
    type="text"
    value="${memberData.userName}"
  />
  <label for="email">email帳號 </label
  ><input value="${memberData.email}" name="email" id="email" class="inputStyle" type="text" />
  <p style="display: none"><a href="">修改密碼</a></p>
  <label for="password">修改密碼 </label
  ><input value=""
    name="password"
    id="password"
    class="inputStyle"
    type="text"
    placeholder="請輸入新密碼"
  />
  <label for="checkPassword">確認新密碼 <span class="alertMsg" style="color: red; font-size: 12px"></span> </label
  ><input id="checkPassword" name="checkPassword" class="inputStyle" type="text"  placeholder="請再次輸入新密碼" /> `;
}

//修改個人資料

const editBtn = document.querySelector(".editBtn");

editBtn.addEventListener("click", editContent);

function editContent(e) {
  const password = memberEditItem.querySelector("#password");
  const checkPassword = memberEditItem.querySelector("#checkPassword");

  if (password.value != checkPassword.value) {
    alert("密碼不一致，請重新輸入");
    checkPassword.value = "";
    return;
  }

  let obj = {};
  const inputText = memberEditItem.querySelectorAll("input");
  Array.from(inputText).forEach((item) => {
    // console.log(item.name);
    // console.log(item.value);
    if (item.value == "") {
      return;
    } else {
      obj[item.name] = item.value;
    }
  });

  obj.userId = userId;
  console.log(obj);
  //發送修改請求 //卡在token過期的情況 若時間超過token會無效
  const Auth = `Bearer ${localStorage.getItem("accessToken")}`;
  console.log(Auth);
  axios.defaults.headers.common.Authorization = Auth;

  axios
    .patch(`${jsonUrl}/600/users/${userId} `, obj)
    .then(function (response) {
      console.log(response);
      if (response.request.status === 200) {
        alert("資料修改成功");
      }
    })
    .catch(function (error) {
      console.log(error);

      if (error.response.data === "jwt expired") {
        alert("請重新登入");
        // 頁面導回登入頁 強制重新登入
        location.href = "/app/login.html";
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userName");
        localStorage.removeItem("userId");
      }
    });
}

//用戶輸入時立即確認密碼是否一致(此做法要把東西放在外面 )
// console.log(password, checkPassword);
// checkPassword.addEventListener("keyup", (e) => {
//   console.log("bbbbb");
// });
// //確認兩次密碼一致
// function checkSecondPassword() {
//   const password = memberEditItem.querySelector("#password");
//   const checkPassword = memberEditItem.querySelector("#checkPassword");
//   if (password.value != checkPassword.value) {
//     alert("密碼不一致，請重新輸入");
//     // password.value = "";
//     checkPassword.value = "";
//     return;
//   }
// }

// 會員發表過的評價 觀看
let memberResumeList = [];
let resumeShopData = [];
memberResumeListRender();
function memberResumeListRender() {
  console.log("tttt");
  console.log(userId);

  //發送取得請求 //token過期設定
  const Auth = `Bearer ${localStorage.getItem("accessToken")}`;
  console.log(Auth);
  axios.defaults.headers.common.Authorization = Auth;

  axios
    .get(`${jsonUrl}/600/comments?userId=${userId}`)
    .then(function (res) {
      console.log(res);
      memberResumeList = res.data;
      if (memberResumeList.length == 0) {
        return;
      }

      // console.log(memberResumeList);
      //抓店家的資料
      let resumeShopIdData = [];
      memberResumeList.forEach((item) => {
        resumeShopIdData.push(item.shopId);
      });
      //http://localhost:3000/shops/24
      // console.log(memberResumeList);

      resumeShopIdData.forEach((item) => {
        axios
          .get(`${jsonUrl}/shops/${item}`)
          .then(function (res) {
            // console.log(res);
            resumeShopData.push(res.data);
            resumeRender();
          })
          .catch(function (error) {
            console.log(error);
          });
      });
    })
    .catch(function (error) {
      console.log(error);
      if (error.message === "Request failed with status code 403") {
        itemGroup.innerHTML = `<p style="color:gray;text-align:center;">您尚未留下評價</p>`;
      }
      if (error.response.data === "jwt expired") {
        alert("請重新登入");
        // 頁面導回登入頁 強制重新登入
        location.href = "/app/login.html";
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userName");
        localStorage.removeItem("userId");
      }
    });
}

const itemGroup = document.querySelector(".itemGroup");

function resumeRender() {
  // console.log(memberResumeList);
  // console.log(resumeShopData[1]);

  memberResumeList.forEach((item) => {
    resumeShopData.forEach((shop) => {
      if (item.shopId == shop.id) {
        item.shopName = shop.shopName;
      }
    });
  });

  let shopPicArr = [];
  resumeShopData.forEach((shop) => {
    shopPicArr.push(shop.picture[0]);
  });
  // console.log(shopPicArr);

  // console.log(memberResumeList);
  let str = "";
  memberResumeList.forEach((item, index) => {
    str += `<div class="item">
    <div class="picWrap">
      <img src="./assets/images/store.png" alt="店家圖" />
    </div>
    <div class="text">
    <span style="color:#ffb330;" >${(
      (parseInt(item.variety) +
        parseInt(item.beauty) +
        parseInt(item.price) +
        parseInt(item.recommend) +
        parseInt(item.return) +
        parseInt(item.sweetness)) /
      6
    ).toFixed(2)} ★</span>
      <h3>${item.shopName}  </h3> 
      

      <p >
        ${item.text}
      </p>
    </div>
    </div> `;
  });

  itemGroup.innerHTML = str;
}
