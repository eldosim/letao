$(function () {
    var currentPage=1;
    var pageSize=2;
    var picArr=[];
    render();
    function render() {
        $.ajax({
            type:"get",
            url:"/product/queryProductDetailList",
            dataType:"json",
            data:{
                page:currentPage,
                pageSize:pageSize
            },
            success:function (info) {
                var htmlstr=template("producttpl",info);
                $("#protbody").html(htmlstr);

                $("#paginator").bootstrapPaginator({
                    bootstrapMajorVersion:3,

                    currentPage: currentPage,
                    totalPages:Math.ceil(info.total/pageSize),

                    onPageClicked:function (a,b,c,page) {
                        currentPage=page;
                        render();
                    },
                    itemTexts:function (type, page, current) {
                        switch (type) {
                            case "page":
                                return page;
                            case "first":
                                return "首页";
                            case "last":
                                return "尾页";
                            case "prev":
                                return "上一页";
                            case "next":
                                return "下一页";


                        }
                    },
                    // tooltipTitles
                    tooltipTitles:function (type, page, current) {
                    switch (type) {
                        case "page":
                            return "前往第"+page+"页";
                        case "first":
                            return "首页";
                        case "last":
                            return "尾页";
                        case "prev":
                            return "上一页";
                        case "next":
                            return "下一页";


                    }
                },
                    useBootstrapTooltip:true
                })

            }
        })
    };
    
    
    $("#addBtn").on("click",function () {
        $("#productModal").modal("show");

        $.ajax({
            type:"get",
            url:"/category/querySecondCategoryPaging",
            dataType:"json",
            data:{
                page:1,
                pageSize:100
            },
            success:function (info) {
                var htmlstr=template("secondtpl",info);
                $("#dropdown-second").html(htmlstr);
            }
        })
    })

    $("#dropdown-second").on("click","a",function () {
        $('[name="brandId"]').val($(this).data("id"));
        $("#selecttext").text($(this).text());
        $("#form").data("bootstrapValidator").updateStatus("brandId","VALID")
    })

    $("#form").bootstrapValidator({
        excluded:[],

        //2. 指定校验时的图标显示，默认是bootstrap风格
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },

        fields:{
            brandId:{
                validators:{
                    notEmpty:{
                        message:"不能为空!"
                    }
                }
            },
            proName:{
                validators:{
                    notEmpty:{
                        message:"不能为空!"
                    }
                }
            },
            proDesc:{
                validators:{
                    notEmpty:{
                        message:"不能为空!"
                    }
                }
            },
            num:{
                validators:{
                    notEmpty:{
                        message:"不能为空!"
                    },
                    regexp: {
                        regexp: /^[1-9]\d*$/,
                        message: '商品库存格式，必须是非零开头的数字!'
                    }
                }
            },
            size:{
                validators:{
                    notEmpty:{
                        message:"不能为空!"
                    },
                    regexp: {
                        regexp: /^\d\d[-]\d\d$/,
                        message: '商品尺寸格式，必须是XX-XX格式,例如32-42!'
                    }

                }
            },
            oldPrice:{
                validators:{
                    notEmpty:{
                        message:"不能为空!"
                    }
                }
            },
            price:{
                validators:{
                    notEmpty:{
                        message:"不能为空!"
                    }
                }
            },
            picStatus:{
                validators:{
                    notEmpty:{
                        message:"请上传3张图片!"
                    }
                }
            }
        }
    });
    $("#form").on("success.form.bv",function (e) {
        e.preventDefault();
        console.log(picArr)
        // console.log($("form").serialize())
        var paramstr=$("#form").serialize();
        paramstr+="&picAddr1="+picArr[0].picAddr+"&picName1="+picArr[0].picName;
        paramstr+="&picAddr2="+picArr[1].picAddr+"&picName2="+picArr[1].picName;
        paramstr+="&picAddr3="+picArr[2].picAddr+"&picName3="+picArr[2].picName;
        // console.log(paramstr)
        $.ajax({
            type:"post",
            url:"/product/addProduct",
            data:paramstr,
            dataType:"json",
            success:function (info) {
                if(info.success){
                    $("#productModal").modal("hide");
                    currentPage=1;
                    render();
                    $("#form").data("bootstrapValidator").resetForm(true);
                    $("#selecttext").text("请选择二级分类");
                    $("#picture img").remove();
                }
            }
        })
    });

    // ============================================
    $("#fileupload").fileupload({
        dataType:"json",
        //e：事件对象
        //data：图片上传后的对象，通过 data.result.picAddr 可以获取上传后的图片地址
        done:function (e, data) {
            var picObj=data.result;
            picArr.unshift(picObj);
            console.log(picArr);

            $("#picture").prepend('<img src="'+picObj.picAddr+'" width="100px" alt="">')
            if(picArr.length>3){
                picArr.pop();
                $("#picture img").eq(-1).remove();
            }
            if(picArr.length===3){
                $("#form").data("bootstrapValidator").updateStatus("picStatus","VALID")
            }


        }
    });
})