/*===================================================================*/
/* Date() 取得目前時間

     1. 取得現在時間 => 建立Date()物件
     2. 在html顯示現在時間

/*===================================================================*/

var nowTime = new Date(); //建立Date()物件，才能使用Date物件的方法
document.getElementById('nowTime').textContent = '截至目前時間 ' + nowTime.getFullYear() + '年' + (nowTime.getMonth() + 1) + '月' + nowTime.getDate() + '日' + nowTime.getHours() + ':' + nowTime.getMinutes() + ':' + nowTime.getSeconds();



/*===================================================================*/
/* AJAX  get 取得報名人數

     1. 透過XMLHttpRequest()物件向伺服器請求資料
     2. 設定請求資料 => .open(方法,資料網址,同步/非同步)
     3. 發送請求 => .send() ，括號內傳送的內容格式需為string
     4. 瀏覽器撈到資料後觸發 => .onload (XMLHttpRequest物件裡的方法)
     5. 撈到的資料放在 XMLHttpRequest物件的 .responseText
     6. 撈到的資料格式為string，轉成object => JSON.parse()
     7. 在html顯示人數

/*===================================================================*/

var xhr = new XMLHttpRequest();
xhr.open('get', 'https://www.thef2e.com/api/signUpTotal', true); 
xhr.send(null); 
xhr.onload = function() {
  var objPeople = JSON.parse(xhr.responseText);
  document.getElementById('counter-number').innerHTML = objPeople.total + '<span class="font-xs">位</span>';
}



/*===================================================================*/
/* Date() 計算倒數時間

     1. 取得現在時間
     2. 設定截止日
     3. 算出開賽時間與現在的時間差
     4. 校正台灣時區+8hr多出的時間差( 60秒/分 * 60分/時 * 8小時 * 1000毫秒)
     5. 建立時間差結果的Date()物件 
     6. 在html顯示倒數時間
     7. 讓瀏覽器每隔1秒就顯示新的時間差 => setTimeout(function, 毫秒) 屬window物件的方法
     8. 做出無限迴圈讓倒數不斷執行

/*===================================================================*/

function checkTime() {
  var nowTime = new Date();
  var startTime = new Date(2018, 06, 04, 12, 00, 00); //截止日

  //計算時間差
  var countdownTime = startTime - nowTime - (60 * 60 * 8 * 1000);  //得到的結果單位為毫秒 + 還要扣除台灣與UTC時間之間的分鐘差
  //毫秒單位的時間差變成 天/時/分/秒 顯示
  var countdownTime = new Date(countdownTime);
  document.getElementById('countdown-day').textContent = countdownTime.getDate();
  document.getElementById('countdown-hour').textContent = countdownTime.getHours(); document.getElementById('countdown-minute').textContent = countdownTime.getMinutes();
  document.getElementById('countdown-second').textContent = countdownTime.getSeconds();
  // 每隔多久，去執行函式。呼叫本身所在的function造成無限迴圈不斷執行
  setTimeout(checkTime, 1000);
}

//網頁載入完成後觸發function
window.onload = checkTime();



/*===================================================================*/
/* AJAX post 查詢報名

     1. 按鈕被點擊後，存取input內的email
     2. 後面要使用post物件寫法，先將email存入自訂物件
     3. 設定傳送資料 => .open(方法,資料網址,同步/非同步)
     4. 設定傳送資料的格式，使用json => .setRequestHeader('Content-type', 'application/json')
     5. 將要傳送的資料內容轉成string => JSON.stringify()
     6. 發送請求 => .send() ，括號內傳送的內容格式需為string
     7. 瀏覽器撈到資料後觸發 => .onload
     8. 撈到的資料放在 XMLHttpRequest物件的 .responseText，格式為string，轉成object => JSON.parse()
     9. 判斷輸入的Email有沒有報名
     10. 在html顯示報名狀態
     
     增加功能：
     1. 清除上次查詢顯示的資料

/*===================================================================*/

function inquire() {
  var inputEmail = document.getElementById('input-email').value;
  var account = {};
  account.email = inputEmail;

  // 清除上次查詢顯示的資料
  document.getElementById('nickName').textContent = '';
  document.getElementById('message').textContent = '';
  document.getElementById('timeStamp').textContent = '';
  
  var xhrSignUp = new XMLHttpRequest();
  xhrSignUp.open('post', 'https://www.thef2e.com/api/isSignUp', true); 
  xhrSignUp.setRequestHeader('Content-type', 'application/json');
  var dataStr = JSON.stringify(account);
  xhrSignUp.send(dataStr);

  xhrSignUp.onload = function() {
    var resultObj = JSON.parse(xhrSignUp.responseText);

    if(resultObj.success==true) {
      document.getElementById('nickName').textContent = resultObj.nickName + ',你已';
      document.getElementById('message').textContent = resultObj.message + '一起變強吧！';
      // 撈到的報名時間毫秒轉換成日期
      var joinTime = new Date(resultObj.timeStamp);
      document.getElementById('timeStamp').textContent = joinTime;
    } else if ((resultObj.success == false) && (inputEmail === '')) {
      document.getElementById('message').textContent = '請填寫報名E-mail唷';
      console.log(resultObj);
    } else {
      document.getElementById('message').textContent = resultObj.message;
    }
  }
}

//點擊按鈕觸發function
document.getElementById('btn-send').addEventListener('click', inquire, false);



/*===================================================================*/
/* jQuery
/*===================================================================*/

$(document).ready(function() {
  
  /*========================================================*/
  /* 切換section
  /*========================================================*/

  $('#section-2').hide();
  $('#btn-go').click(function() {
    // section-2出現 section-1隱藏
    $('#section-1').fadeOut();
    $('#section-2').fadeIn(3000).show(3000);
  });


  /*========================================================*/
  /* 漢堡選單
  /*========================================================*/
  
  $('#navbar-toggler').hover(function() {
    $('#navbar-collapse').addClass('show');
    $('#navbar-toggler').hide(1000);
  });

  $('#btn-close').click(function() {
    $('#navbar-collapse').removeClass('show');
    $('#navbar-toggler').show(1000);
  });


  /*========================================================*/
  /* GA Event Tracking
  /*========================================================*/
  
  $('#navbar-collapse').click(function() {
    ga('send','event','view','click','menu');
  });

  $('#navbar-collapse').hover(function () {
    ga('send', 'event', 'view', 'hover', 'menu');
  });

  $('#my-github').click(function () {
    ga('send', 'event', 'link', 'click', 'github');
  });

  $('#my-codepen').click(function () {
    ga('send', 'event', 'link', 'click', 'codepen');
  });

  $('#btn-go').click(function () {
    ga('send', 'event', 'view', 'click', 'btn');
  });

  $('#btn-link-activity').click(function () {
    ga('send', 'event', 'link', 'click', 'activity');
  });

  $('#btn-send').click(function () {
    ga('send', 'event', 'inquire', 'click', 'inquire');
  });

});