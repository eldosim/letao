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
        $("#selecttext").text($(this).text());
        $("[name='categoryId']").val($(this).data("id"));
        $("#form").data("bootstrapValidator").updateStatus("categoryId","VALID");
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
            var imgUrl=data.result.picAddr;
            $("#picture img").attr("src",imgUrl);
            $("[name=brandLogo]").val(imgUrl);
            $("#form").data("bootstrapValidator").updateStatus("brandLogo","VALID");
        }
    });

    $("#form").bootstrapValidator({
        excluded: [],

        //2. 指定校验时的图标显示，默认是bootstrap风格
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },

        fields:{
            categoryId:{
                validators:{
                    notEmpty:{
                        message:"请选择一级分类!"
                    }
                }
            },
            brandName:{
                validators:{
                    notEmpty:{
                        message:"分类名不能为空！"
                    }
                }
            },
            brandLogo:{
                validators:{
                    notEmpty:{
                        message:"请选择品牌标志!"
                    }
                }
            }
        }

    })

    $("#form").on("success.form.bv",function (e) {
        e.preventDefault();
        $.ajax({
            type:"post",
            url:"/category/addSecondCategory",
            dataType:"json",
            data:$("#form").serialize(),
            success:function (info) {
                if(info.success){
                    $("#secondModal").modal("hide");
                    currentPage=1;
                    render();
                    $("#form").data("bootstrapValidator").resetForm(true);
                    $("#selecttext").text("请选择一级分类");
                    $("#picture img").attr("src","images/none.png");

                }
            }
        })
    })

})