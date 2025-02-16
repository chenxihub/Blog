// project util.js
$(function () {

    // 登录注册切换
    $('.j_userTab span').on('click', function () {
        let _index = $(this).index();
        $(this).addClass('user_cur').siblings().removeClass('user_cur');
        $('.user_login,.user_register').hide();
        if (_index == 0) {
            $('.user_login').css('display', 'inline-block');
            $('.user_register').hide();
        } else {
            $('.user_login').hide();
            $('.user_register').css('display', 'inline-block');
        }
    });


    // 登录校验
    let reg = /^[^<>"'$\|?~*&@(){}]*$/;
    let $login = $('#login');
    let $register = $('#register');
    // $('.user_login_btn').on('click', function () {
    //     if ($login.find('.user_input').eq(0).find('input').val().trim() == '') {
    //         $login.find('.user_err span').text('用户名不能为空').show();
    //         return false;
    //     }
    //     if (!reg.test($login.find('.user_input').eq(0).find('input').val().trim())) {
    //         $login.find('.user_err span').text('用户名不能含有特殊字符').show();
    //         return false;
    //     }
    //     if ($login.find('.user_input').eq(1).find('input').val().trim() == '') {
    //         $login.find('.user_err span').text('密码不能为空').show();
    //         return false;
    //     }
    //     if (!reg.test($login.find('.user_input').eq(1).find('input').val().trim())) {
    //         $login.find('.user_err span').text('密码不能含有特殊字符').show();
    //         return false;
    //     }
    //     $login.find('.user_err span').text('').hide();
    // });
    //
    // $('.user_register_btn').on('click', function () {
    //     if ($register.find('.user_input').eq(0).find('input').val().trim() == '') {
    //         $register.find('.user_err span').text('用户名不能为空').show();
    //         return false;
    //     }
    //     if (!reg.test($register.find('.user_input').eq(0).find('input').val().trim())) {
    //         $register.find('.user_err span').text('用户名不能含有特殊字符').show();
    //         return false;
    //     }
    //     if ($register.find('.user_input').eq(1).find('input').val().trim() == '') {
    //         $register.find('.user_err span').text('密码不能为空').show();
    //         return false;
    //     }
    //     if (!reg.test($register.find('.user_input').eq(1).find('input').val().trim())) {
    //         $register.find('.user_err span').text('密码不能含有特殊字符').show();
    //         return false;
    //     }
    //     if ($register.find('.user_input').eq(1).find('input').val().trim() !=
    //         $register.find('.user_input').eq(2).find('input').val().trim()
    //     ) {
    //         $register.find('.user_err span').text('两次输入的密码不一致').show();
    //         return false;
    //     }
    //     $register.find('.user_err span').text('').hide();
    // });


    //注册
    $('.user_register_btn').on('click', function () {
        //通过Ajax请求数据
        $.ajax({
            type: 'post',
            url: '/api/user/register',
            data: {
                username: $register.find('[name="username"]').val(),
                password: $register.find('[name="password"]').val(),
                repassword: $register.find('[name="repassword"]').val()
            },
            dataType: 'json',
            success: function (result) {
                console.log(result);
                if (!result.code) {
                    $('.user_err').html(result.message);
                }
                setTimeout(function () {
                    $('.user_err').html('');
                }, 1000)
            },
            error: function (err) {
                console.log(err)
            }
        })
    });
    //登录
    $('.user_login_btn').on('click', function () {
        //通过ajax请求数据
        $.ajax({
            type: 'post',
            url: '/api/user/login',
            data: {
                username: $login.find('[name="username"]').val(),
                password: $login.find('[name="password"]').val()
            },
            dataType: 'json',
            success: function (result) {
                console.log(result);
                if (!result.code) {
                    window.location.reload();
                }
            },
            error: function (err) {
                console.log(err)
            }
        })
    });
    //退出
    $('.user_loginOut').on('click', function () {
        //通过ajax请求数据
        $.ajax({
            type: 'get',
            url: '/api/user/logout',
            success: function (result) {
                if (!result.code) {
                    window.location.reload();
                }
            }
        })
    });


    //评论
    $('#comment').on('click', function () {
        $.ajax({
            type: 'POST',
            url: '/api/comment',
            data: {
                contentid: $('#contentId').val(),
                content: $('.discuss_input').val()
            },
            success: function (responseData) {
                $('.discuss_input').val('');
                console.log(responseData);
                renderComment(responseData.data.conments.reverse());
            }
        })
    });
    //自调用函数去请求评论
    (function loadData() {
        $.ajax({
            type: 'GET',
            url: '/api/comment',
            data: {
                contentid: $('#contentId').val()
            },
            success: function (responseData) {
                console.log(responseData);
                renderComment(responseData.data.reverse());
            }
        })
    }());

    function renderComment(comments) {
        $('#count').html(comments.length);
        let html = '';
        let len = comments.length;
        for (let i = 0; i < len; i++) {
            html += `
                <li>
                <p class="discuss_user"><span>${comments[i].username}</span><i>发表于 ${formatDate(comments[i].postTime)}</i></p>
                <div class="discuss_userMain">${comments[i].content}</div></li>
            `;
        }
        $('.discuss_list').html(html);
    }

    function formatDate(date) {
        let date1 = new Date(date);
        let formatDate = date1.getFullYear() + '/' + (date1.getMonth() + 1) + '/' + date1.getDate() + '/  ' + date1.getHours() + ':' + date1.getMinutes() + ':' + date1.getSeconds();
        return formatDate;
    }

    // 打字效果
    let str = 'hello world';
    let i = 0;

    function typing() {
        let divTyping = $('.banner h2');
        if (i <= str.length) {
            divTyping.text(str.slice(0, i++) + '_');
            setTimeout(function () {
                typing()
            }, 200);
        } else {
            divTyping.text(str);
        }
    }

    typing();
});