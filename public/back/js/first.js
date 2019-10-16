$(function () {
    currentPage=1;
    pageSize=5;
    render();
    function render() {
        $.ajax({
            type:"get",
            url:"/category/queryTopCategoryPaging",
            dataType:"json",
            data:{
                page:currentPage,
                pageSize:pageSize
            },
            success:function (info) {
                console.log(info);
                var htmlstr = template("firstTpl",info);
                $("tbody").html(htmlstr);
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
        $("#firstModal").modal("show");
    });


    $("#form").bootstrapValidator({
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields:{
            categoryName:{
                validators:{
                    notEmpty:{
                        message:"添加分类名称不能为空"
                    }

                }
            }
        }
    });

    $("#form").on("success.form.bv",function (e) {
        e.preventDefault();
        $.ajax({
            type:"post",
            dataType:"json",
            url:"/category/addTopCategory",
            data:$("#form").serialize(),
            success:function (info) {
                if(info.success){
                    $("#firstModal").modal("hide");
                    currentPage=1;
                    render();
                    $("#form").data("bootstrapValidator").resetForm(true);
                }
            }

        })
    })

    $(".modalcancelbtn").on("click",function () {
        $("#form").data("bootstrapValidator").resetForm(true);
    })


    });