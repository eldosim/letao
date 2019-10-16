$(function () {
    var currentPage=1;
    var pageSize=5;
    render();
    function render() {
        $.ajax({
            type:"get",
            url:"/category/querySecondCategoryPaging",
            dataType:"json",
            data:{
                page:currentPage,
                pageSize:pageSize
            },
            success:function (info) {
               var htmlstr=template("secondtpl",info);
               $(".lt-main tbody").html(htmlstr)

                $("#paginator").bootstrapPaginator({
                    bootstrapMajorVersion:3,

                    currentPage:info.page,
                    totalPages:Math.ceil(info.total/pageSize),

                    onPageClicked:function (a,b,c,page) {
                        currentPage=page;
                        render();
                    }


                })
            }
        })
    }


    $("#addBtn").on("click",function () {
        $.ajax({
            type:"get",
            url:"/category/queryTopCategoryPaging",
            dataType: "json",
            data:{
                page:1,
                pageSize:100
            },
            success:function (info) {
                var htmlstr=template("modalfirsttpl",info);
                $("#dropdown-first").html(htmlstr)
            }
        })
        $("#secondModal").modal("show");
    })

    $("#dropdown-first").on("click","a",function () {
        $("#selecttext").text($(this).text())
    })

    $(".modalcancelbtn").on("click",function () {
        $("#selecttext").text("请选择一级分类")
    })

    $("#fileupload").fileupload({
        dataType:"json",
        //e：事件对象
        //data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址
        done:function (e, data) {
            console.log(data);
            $("#picture img").attr("src",data.result.picAddr);
        }
    });

})