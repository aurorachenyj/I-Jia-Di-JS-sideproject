const ShopListWrap = document.querySelector(".ShopListWrap");
getBookmarkData();

//取得收藏資料
let bookmarkData = [];

function getBookmarkData() {
  const Auth = `Bearer ${localStorage.getItem("accessToken")}`;
  axios.defaults.headers.common.Authorization = Auth;

  axios
    .get(`${jsonUrl}/400/bookmarks?userId=${localUserId}`, {
      userId: localUserId,
    })
    .then(function (res) {
      console.log(res.data);

      return res.data.forEach((item) => {
        axios.get(`${jsonUrl}/shops/${item.shopId}`).then(function (res) {
          //   console.log(res.data);
          bookmarkData.push(res.data);
          renderBookmarkList();
        });

        console.log(bookmarkData);
      });
    })
    .catch(function (error) {
      console.log(error);
      if (error.response.dat === "jwt expired" ) {
        alert("憑證逾期，請重新登入");
        // 頁面導回登入頁 強制重新登入

        location.href = "/IJiaDi-sideproject/app/login.html";
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userName");
        localStorage.removeItem("userId");
      }
      if (error.message === "Request failed with status code 403") {
        ShopListWrap.innerHTML = `<p style="color:white;background-color:orange;border-radius:20px;text-align:center;margin:3rem auto 0rem;width:8rem;">尚未收藏店家</p>`;
      }
    });
}



function renderBookmarkList() {
  console.log(bookmarkData);
  let str = "";
  bookmarkData.forEach((item) => {
    str += ` <div class="shoplistItem">
<img  style="max-width:20%" class="imgStyle" src="${item.picture[0]}" alt="店家照片" />

<div  class="shopItem">
  <h4>${item.shopName}</h4>
 
  <p>
    地址：${item.address}<br />
    營業時間：${item.openTime}
  </p>
  

  <button class="readMoreBtn">
  <a href="./shop.html?id=${item.id}"> <span class="noShow" style="color:white" > More</span> ></a>
  </button>
</div>
</div> `;
  });

  ShopListWrap.innerHTML = str;
}
