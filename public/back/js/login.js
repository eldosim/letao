$(function () {
   // 表单配置
    $("#form").bootstrapValidator({
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },


        fields:{
            username:{
                validators:{
                    notEmpty:{
                        message:"用户名不能为空"
                    },
                    stringLength:{
                        min:2,
                        max:6,
                        message:"用户不能少于2字，不能大于6字！"
                    },
                    callback:{
                        message:"用户名不存在!"
                    }
                }
            },
            password:{
                validators: {
                    notEmpty: {
                        message: "密码不能为空"
                    },
                    stringLength: {
                        min:6,
                        max:12,
                        message:"密码不能少于6字,不能多于12字"
                    },
                    callback:{
                        message:"密码错误!"
                    }
                }
            }
        }
    })

    // ajax请求
    $("#form").on("success.form.bv",function (e) {
        e.preventDefault();

        $.ajax({
            type:"post",
            url:"/employee/employeeLogin",
            data:$("#form").serialize(),
            dataType:"json",
            success:function (info) {
                console.log(info);
                if(info.success){
                    location.href="index.html"
                }
                if(info.error===1000){
                    $("#form").data("bootstrapValidator").updateStatus("username","INVALID","callback")
                }
                if(info.error===1001){
                    $("#form").data("bootstrapValidator").updateStatus("password","INVALID","callback")
                }
            }
        })
    })


    // 重置功能
    $("[type=reset]").on("click",function () {
        $("#form").data("bootstrapValidator").resetForm();
    })
});