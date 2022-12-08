const jsonUrl = "http://localhost:3000";
const nav = document.querySelector("nav");
//確認是否已登入
const menuBarLoginBtn = document.querySelector(".menuBarLoginBtn");
const localJWT = localStorage.getItem("accessToken");
const localUserId = localStorage.getItem("userId");
const adminName = localStorage.getItem("adminName");

console.log(adminName);

localLoginChecker();

// console.log(menuBarLoginBtn);

function localLoginChecker() {
  // const localJWT = localStorage.getItem("accessToken");
  // const localUserId = localStorage.getItem("userId");
  console.log(localUserId, localJWT);

  if (localJWT) {
    menuBarLoginBtn.innerHTML = `<a href="">登出</a> `;
  }
}

//已登入 按下登出

// const loginOrLogout = document.querySelector("data");
// console.log(menuBarLoginBtn.children[0].textContent);

menuBarLoginBtn.addEventListener("click", logOut);

function logOut(e) {
  //   e.preventDefault();

  let statusText = menuBarLoginBtn.children[0].textContent;
  if (statusText === "登出") {
    console.log(adminName);

    localStorage.removeItem("userId");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userName");
    menuBarLoginBtn.innerHTML = `<a href="./login.html">登入<span> / 註冊</span></a> `;
  }
}

//未登入時 按下會員專區和收藏匣 阻擋進入頁面
nonMember();
function nonMember() {
  const nav = document.querySelector("nav");

  nav.addEventListener("click", (e) => {
    console.log(e.target.textContent);
    if (e.target.textContent === "找甜甜 ") {
      e.preventDefault();
      location.href = `/app/search-page.html?sweetItem=巴斯克&station=undefined&shopName=`;
    }

    if (
      e.target.textContent === "會員專區" ||
      e.target.textContent === "收藏匣"
    ) {
      if (!localJWT) {
        e.preventDefault();
        alert("登入或註冊成為會員才可使用此功能");
        return;
      }
    }
  });
}
