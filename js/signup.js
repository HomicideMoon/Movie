$(function () {

    var Regulars = {
        phone: /^1[34578]\d{9}$/
    }

    function DealRegulars(char, s) {
        return (Regulars[char].test(s));
    }

    function hint() {
        $(".hint").fadeIn(1000, function () {
            setTimeout(function () {
                $(".hint").fadeOut(1000);
            }, 2000);

        })
    }
    //获取验证码
    function getCode() {
        var code = '';
        for (var i = 0; i < 4; i++) {
            code += Math.floor(Math.random() * 10);
        }

        $(".hint").text('验证码是' + code);
        hint();
        return code;
    }


    var set; //计时器
    var userdata = []; //数据库里的用户信息数组
    var reqdata = []; //申请名单数组
    var regdata = {}; //本次申请信息
    var errnum = 0; //手机号出错提示
    var errentry = 0; //验证信息错误提示

    $(".icode").click(function () {
        var i = 5;
        if (DealRegulars("phone", $(".phone-number>input").val())) {

            var ind = -1;
            $.each(userdata, function (key, val) {
                if ($(".phone-number>input").val() == val.username) {
                    ind = key;
                }
            });
            if (ind !== -1) {
                $(".hint").text('用户已存在');
                hint();
                errnum = 1;
                $(".icode").attr({
                    "disabled": "disabled"
                });
            } else {
                regdata = {
                    mobilenum: $(".phone-number>input").val(),
                    vcode: getCode()
                };
                var has_requested = 0;
                $.each(reqdata, function (key, val) {
                    if (regdata.mobilenum == val.username) {
                        has_requested = 1;
                        val = regdata;
                    }
                });
                if (has_requested == 0) {
                    reqdata.push(regdata);
                    console.log(reqdata);
                    regdata = {};
                };
                $(".icode").val(i + "S后可重发").attr({
                    "disabled": "disabled"
                }).addClass("disabled");
                set = setInterval(function () {
                    i--;
                    if (i == 0) {
                        $(".icode").removeClass("disabled").removeAttr("disabled").val("重发验证码");
                        i = 5; //倒计时复位

                        clearInterval(set); //结束 
                    } else {
                        $(".icode").val(i + "S后可重发");
                    }
                }, 1000);
            }
        } else {
            errnum = 1;
            $(".hint").text("请输入正确的手机号码");
            hint();
            $(".icode").attr({
                "disabled": "disabled"
            });

        }
    });

    $(".phone-number>input").on('input change', function () {
        errnum == 0;
        $(".icode").removeAttr("disabled");
        errentry = 0;
        $(".verify").removeClass("disabled");
    });

    $(".CAPTCHA>input").on('input change', function () {
        errentry = 0;
        $(".verify").removeClass("disabled");
    });

    -
    $("body").on('click', '.verify:not(".disabled")', function () {
        var mobile = $(".phone-number>input").val();
        var vcode = $(".CAPTCHA>input").val();
        var ind = -1;
        if (mobile == '' || vcode == '') {
            $(".hint").text('有信息未填写');
            hint();
            errentry = 1;
            $(".verify").addClass("disabled");
        } else {
            $.each(reqdata, function (key, val) {
                if (mobile == val.mobilenum) {
                    ind = key;
                }
            });
            if (ind == -1) {
                if (DealRegulars("phone", mobile)) {
                    $(".hint").text('请重新申请验证码');
                    hint();
                } else {
                    $(".hint").text('请输入正确的手机号');
                    hint();
                    errentry = 1;
                    $(".verify").addClass("disabled");
                }
            } else {
                if (vcode !== reqdata[ind].vcode) {
                    $(".hint").text('您的验证码错误');
                    hint();
                    errentry = 1;
                    $(".verify").addClass("disabled");
                } else {
                    $(".hint").text('登陆成功');
                    hint();
                    //准备将审核通过的手机号发送到下一步

                }
            }
        }
    })
})
