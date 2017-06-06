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

    //    function getCode() {
    //        var code;
    //        code = (Math.random() * 10).toFixed(3) * 1000;
    //        $(".hint").text('验证码是' + code);
    //        hint();
    //        return code;
    //    }
    function getCode() {
        var code = '';
        for (var i = 0; i < 4; i++) {
            code += Math.floor(Math.random() * 10);
        }

        $(".hint").text('验证码是' + code);
        hint();
        return code;
    }

    var pwd_visible = 0;
    var errnum = 0;
    var errentry_pwd = 0;
    var errentry_code = 0;
    var userdata = [{
        username: "13675116640",
        userpwd: "123123",
        online: 0
    }, {
        username: "13675116641",
        userpwd: "123456",
        online: 1
    }];
    var reqdata = [];
    var regdata = {};
    var set;

    $(".login-style li").on("click", function () {
        $(this).addClass("on-chosen").siblings("li").removeClass("on-chosen");
        if ($(this).hasClass("username-login")) {
            $(".containers").stop(true).animate({
                "margin-left": 0
            }, 100);
        } else {
            $(".containers").stop(true).animate({
                "margin-left": -100 + "%"
            }, 100);
        }
    })


    $(".password .visible-or-not").on('click', function () {
        if (pwd_visible == 0) {
            pwd_visible = 1;
            $(".password .visible-or-not").html("&#xe63a;");
            $(".password input").prop("type", "text");
        } else {
            pwd_visible = 0;
            $(".password .visible-or-not").html("&#xe623;");
            $(".password input").prop("type", "password");
        }
    });

    $(".username input").on('input change', function () {
        if ($(this).val() !== "") {
            $(".clearusername").show();
        } else {
            $(".clearusername").hide();
        }
        errentry_pwd = 0;
        $(".login.with-pwd").removeClass("disabled");
    });

    $(".password input").on('input change', function () {
        if ($(this).val() !== "") {
            $(".clearpwd").show();
        } else {
            $(".clearpwd").hide();
        }
        errentry_pwd = 0;
        $(".login.with-pwd").removeClass("disabled");
    });

    $(".phone-number input").on('input change', function () {
        if ($(this).val() !== "") {
            $(".clearphonenum").show();
        } else {
            $(".clearphonenum").hide();
        }
        errnum = 0
        $(".getcode").removeAttr("disabled");
        errentry_code = 0;
        $(".login.with-code").removeClass("disabled");
    });

    $(".icode input").on('input change', function () {
        if ($(this).val() !== "") {
            $(".clearcode").show();
        } else {
            $(".clearcode").hide();
        }
        errentry_code = 0;
        $(".login.with-code").removeClass("disabled");
    });

    $(".password .clearpwd").on('click', function () {
        $(".password input").val("");
        $(".clearpwd").hide();
        errentry_pwd = 0;
        $(".login.with-pwd").removeClass("disabled");
    });

    $(".username .clearusername").on('click', function () {
        $(".username input").val("");
        $(".clearusername").hide();
        errentry_pwd = 0;
        $(".login.with-pwd").removeClass("disabled");
    });

    $(".phone-number .clearphonenum").on('click', function () {
        $(".phone-number input").val("");
        errnum = 0
        $(".getcode").removeAttr("disabled");
        errentry_code = 0;
        $(".login.with-code").removeClass("disabled");
        $(".clearphonenum").hide();
    });

    $(".icode .clearcode").on('click', function () {
        $(".icode input").val("");
        $(".clearcode").hide();
        errentry_code = 0;
        $(".login.with-code").removeClass("disabled");
    });

    //手机号直接登录-验证码获取
    $(".getcode").click(function () {
        var i = 5;
        if (DealRegulars("phone", $(".phone-number>input").val())) {
            var ind = -1;
            $.each(userdata, function (key, val) {
                if ($(".phone-number>input").val() == val.username) {
                    ind = key;
                }
            });
            if (ind == -1) {
                $(".hint").text('用户不存在,请去注册');
                hint();
                errnum = 1;
                $(".getcode").attr({
                    "disabled": "disabled"
                });
            } else {
                if (userdata[ind].online == 1) {
                    $(".hint").text('该用户已在线');
                    hint();
                    errnum = 1;
                    $(".getcode").attr({
                        "disabled": "disabled"
                    });
                } else {
                    //生成手机号+验证码申请，如果已经在申请列表里，则替换，否则添加
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
                    };
                    $(".getcode").val(i + "S后可重发").attr({
                        "disabled": "disabled"
                    }).addClass("disabled");
                    set = setInterval(function () {
                        i--;
                        if (i == 0) {
                            $(".getcode").removeClass("disabled").removeAttr("disabled").val("重发验证码");
                            i = 5; //倒计时复位

                            clearInterval(set); //结束 
                        } else {
                            $(".getcode").val(i + "S后可重发");
                        }
                    }, 1000);
                }
            }
        } else {
            errnum = 1;
            $(".hint").text("请输入正确的手机号码");
            hint();
            $(".getcode").attr({
                "disabled": "disabled"
            });
        }
    });
    //账号密码登录方式验证
    $("body").on('click', '.login.with-pwd:not(".disabled")', function () {
        var name = $(".username>input").val();
        var pwd = $(".password>input").val();
        var ind = -1;
        if (name == '' || pwd == '') {
            $(".hint").text('有信息未填写');
            hint();
            errentry_pwd = 1;
            $(".login.with-pwd").addClass("disabled");
        } else {
            $.each(userdata, function (key, val) {
                if (name == val.username) {
                    ind = key;
                }
            });
            if (ind == -1) {
                $(".hint").text('该用户名不存在');
                hint();
                errentry_pwd = 1;
                $(".login.with-pwd").addClass("disabled");
            } else {
                if (pwd !== userdata[ind].userpwd) {
                    $(".hint").text('您的密码错误');
                    hint();
                    errentry_pwd = 1;
                    $(".login.with-pwd").addClass("disabled");
                } else {
                    if (userdata[ind].online == 1) {
                        $(".hint").text('该用户已在线');
                        hint();
                        errentry_pwd = 1;
                        $(".login.with-pwd").addClass("disabled");
                    } else {
                        $(".hint").text('登陆成功');
                        hint();
                        userdata[ind].online = 1;
                    }
                }
            }
        }
    })
    //手机号快捷登录方式验证
    $("body").on('click', '.login.with-icode:not(".disabled")', function () {
        var mobile = $(".phone-number>input").val();
        var vcode = $(".icode>input").val();
        var ind = -1;
        if (mobile == '' || vcode == '') {
            $(".hint").text('有信息未填写');
            hint();
            errentry_code = 1;
            $(".login.with-icode").addClass("disabled");
        } else {
            $.each(reqdata, function (key, val) {
                if (mobile == val.mobilenum) {
                    ind = key;
                }
            });
            if (ind == -1) {
                if (DealRegulars("phone", mobile)) {
                    $(".hint").text('请申请验证码');
                    hint();
                } else {
                    $(".hint").text('请输入正确的手机号');
                    hint();
                    errentry_code = 1;
                    $(".login.with-icode").addClass("disabled");
                }
            } else {
                if (vcode !== reqdata[ind].vcode) {
                    $(".hint").text('您的验证码错误');
                    hint();
                    errentry_code = 1;
                    $(".login.with-icode").addClass("disabled");
                } else {
                    $(".hint").text('登陆成功');
                    hint();
                    reqdata.splice(ind, 1);
                    $.each(userdata, function (key, val) {
                        if (mobile == val.username) {
                            val.online = 1;
                        }
                    });

                }
            }
        }
    })
})
