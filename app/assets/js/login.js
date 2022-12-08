//登入

// const menuBarLoginBtn = document.querySelector(".menuBarLoginBtn");  //已拆出去

const loginForm = document.querySelector(".loginArea");
const loginBtn = document.querySelector(".loginBtn");
const allLoginInput = loginForm.querySelectorAll("input[name]");
// const nav = document.querySelector("nav");
console.log(nav);
localLoginChecker();

console.log(allLoginInput);

//驗證套件 用了要點兩下按鈕才會有動作 @@

let constraint = {
  loginAccount: {
    email: {
      message: "格式錯誤",
    },
  },
  loginPassword: {
    presence: { message: "必填" },
    length: {
      minimum: 4,
      message: "不可少於4個字元",
    },
  },
};

Array.from(allLoginInput).forEach((input) => {
  // console.log(input.previousElementSibling);

  input.addEventListener("change", (e) => {
    e.target.previousElementSibling.textContent = "";
    let error = validate(loginForm, constraint);

    if (error) {
      Object.keys(error).forEach((item) => {
        document.querySelector(`.${item}`).textContent = error[item]
          .join(" ")
          .split(" ")[2];
      });
    } else {
      loginBtn.focus();
      return;
    }
  });
});

// 按下登入按鈕
loginBtn.addEventListener("click", login);
function login(e) {
  e.preventDefault();
  console.log(loginForm.loginAccount.value);
  console.log(loginForm.loginPassword.value);

  if (
    loginForm.loginAccount.value == "" ||
    loginForm.loginPassword.value == ""
  ) {
    alert("輸入資料不可為空");
    return;
  }

  const data = {
    email: loginForm.loginAccount.value.trim(),
    password: loginForm.loginPassword.value.trim(),
  };

  axios
    .post(`${jsonUrl}/login`, data)
    .then(function (response) {
      console.log(response);
      console.log(response.data);
      if (response.request.status === 200) {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("userId", response.data.user.id);
        localStorage.setItem("userName", response.data.user.userName);
        localStorage.setItem("userPic", response.data.user.InfoPic);

        alert(`${response.data.user.userName} 您好，恭喜登入成功！`);
        localLoginChecker();
        location.href = "/app/index.html";
      }
    })
    .catch(function (error) {
      console.log(error);
      console.log(error.response.data);
      if (error.response.data === "Cannot find user") {
        alert("輸入帳號錯誤或您尚未註冊");
        return;
      } else if (error.response.data === "Incorrect password") {
        alert("密碼錯誤，請檢查輸入的密碼");
        return;
      } else if (error.response.data === "Email format is invalid") {
        alert("email帳號格式不正確");
        return;
      }
    });
}

// //確認是否已登入 要拆出去

// console.log(menuBarLoginBtn);

// function localLoginChecker() {
//   const localJWT = localStorage.getItem("accessToken");
//   const localUserId = localStorage.getItem("userId");
//   console.log(localUserId, localJWT);

//   if (localJWT) {
//     menuBarLoginBtn.innerHTML = `<a href="./login.html">登出</a> `;
//   }
// }

// //已登入 按下登出

// // const loginOrLogout = document.querySelector("data");
// console.log(menuBarLoginBtn.children[0].textContent);

// menuBarLoginBtn.addEventListener("click", logOut);

// function logOut(e) {
//   e.preventDefault();
//   //   console.log("hiiiii");
//   let statusText = menuBarLoginBtn.children[0].textContent;
//   if (statusText === "登出") {
//     localStorage.clear();
//     menuBarLoginBtn.innerHTML = `<a href="./login.html">登入<span> / 註冊</span></a> `;
//   }
// }
