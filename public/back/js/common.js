$(function () {
    $(document).ajaxStart(function () {
        NProgress.start();
    });

    $(document).ajaxStop(function () {
        NProgress.done();
    })
});

$(function () {
    if(location.href.indexOf("login.html")===-1){
    $.ajax({
        type:"get",
        url:"/employee/checkRootLogin",
        dataType: "json",
        success:function (info) {
            if(info.error===400){
                location.href="login.html";
            }
        }
    })
    }
})

$(function () {
    $(".cate-father").on("click",function () {
        $(".cate-children").stop().slideToggle();
    })
})

$(function () {
   $(".icon_menu").on("click",function () {
       $(".lt-aside").toggleClass("my-hidden");
       $(".lt-topbar").toggleClass("my-hidden");
       $(".lt-main").toggleClass("my-hidden");
   })
});


$(function () {
   $("#logoutbtn").on("click",function () {
       $.ajax({
           type:"get",
           url:"/employee/employeeLogout",
           dataType:"json",
           success:function (info) {
              if (info.success){
                  location.href="login.html";
              }
           }
       })
   })
});