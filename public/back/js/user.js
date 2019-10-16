$(function () {
    var currentPage=1;
    var pageSize=5;
    render();

    function render() {
        $.ajax({
            type:"get",
            url:"/user/queryUser",
            dataType:"json",
            data:{
                page:currentPage,
                pageSize:pageSize
            },
            success:function (info) {
                console.log(info);
                var htmlstr = template("tpl",info)
                $("tbody").html(htmlstr);

                $('#paginator').bootstrapPaginator({
                    // 指定bootstrap版本
                    bootstrapMajorVersion: 3,
                    // 当前页
                    currentPage: info.page,
                    // 总页数
                    totalPages: Math.ceil( info.total / info.size ),

                    // 当页面被点击时触发
                    onPageClicked: function( a, b, c, page ) {
                        // page 当前点击的页码
                        currentPage = page;
                        // 调用 render 重新渲染页面
                        render();
                    }
                });
            }
        })
    }



    $("tbody").on("click","button",function () {
        $("#userModal").modal("show");
        var currentId=$(this).parent().data("id");
        var needisDelete=$(this).hasClass("btn-success")?1:0;
        console.log(currentId);
        console.log(needisDelete);


        $("#submitBtn").on("click",function () {
            $.ajax({
                type:"post",
                url:"/user/updateUser",
                dataType: "json",
                data:{
                    id:currentId,
                    isDelete:needisDelete
                },
                success:function (info) {
                    if(info.success){
                        $("#userModal").modal("hide");
                        render();
                    }
                }
            })
        })
    })
})