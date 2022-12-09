//註冊 post 請求
// console.log(axios);
// const jsonUrl = "http://localhost:3004";
const signupForm = document.querySelector(".signupcontent");
const signupBtn = document.querySelector(".signupBtn");

// function saveUserToken({ accessToken, user }) {
//   localStorage.setItem("accessToken", response.data.accessToken);
//   localStorage.setItem("userId", response.data.user.id);
// }

// VALIDATE 驗證套件

const allSignupInput = signupForm.querySelectorAll("input[name]");
console.log(allSignupInput);

let constraints = {
  userName: {
    presence: { message: "必填" },
    length: {
      minimum: 2,
      message: "請輸入至少2字以上",
    },
  },

  email: {
    presence: { message: "必填" },
    email: {
      message: "格式錯誤",
    },
  },
  password: {
    presence: { message: "必填" },
    length: {
      minimum: 4,
      message: "不可少於4個字元",
    },
  },
};

Array.from(allSignupInput).forEach((input) => {
  input.addEventListener("blur", (e) => {
    console.log(input);
    e.target.previousElementSibling.textContent = "";
    let error = validate(signupForm, constraints);
    console.log(error);
    // console.log(e.target.previousElementSibling);

    if (error) {
      Object.keys(error).forEach((item) => {
        console.log(item);
        let errorArr = error[item].join(" ").split(" ");
        console.log(errorArr[errorArr.length - 1]);
        signupForm.querySelector(`.${item}`).textContent =
          errorArr[errorArr.length - 1];
      });
    } else {
      return;
    }
  });
});

// 按下註冊按鈕
signupBtn.addEventListener("click", signup);

function signup(e) {
  e.preventDefault();
  if (
    signupForm.userName.value == "" ||
    signupForm.email.value == "" ||
    signupForm.password.value == ""
  ) {
    alert("輸入資料不可為空");
    return;
  }
  console.log(signupForm.userName.value);
  console.log(signupForm.email.value);
  console.log(signupForm.password.value);

  const randomNum = Math.floor(Math.random() * 10);
  console.log(randomNum);
  let data = {
    userName: signupForm.userName.value.trim(),
    email: signupForm.email.value.trim(),
    password: signupForm.password.value.trim(),
    InfoPic: `./pic/defaultUserPic/${randomNum}.png`,
    role: "user",
  };

  console.log(data);

  axios
    .post(`${jsonUrl}/signup`, data)
    .then(function (response) {
      console.log(response);
      console.log(response.data);
      console.log(response.request.status);

      if (response.request.status === 201) {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("userId", response.data.user.id);
        alert("恭喜註冊成功！立即登入享受會員專屬功能～");
        location.href = "/IJiaDi-sideproject/app/login.html";
       
      }
    })
    .catch(function (error) {
      console.log(error);

      //如果帳號已被註冊但輸入的密碼少於4個字的話，會先跳密碼過短的提示，如何更改
      if (error.response.data === "Email already exists") {
        alert("此email已被註冊");
        return;
      } else if (error.response.data === "Password is too short") {
        alert("密碼長度過短，請重新輸入");
        return;
      }
    });
}
