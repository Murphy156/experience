"use strict"

//页面左侧菜单栏
function initTree() {
    var navWrap = document.getElementById("olTree");
    var nav1s = navWrap.getElementsByTagName("label");
    var nav2s = navWrap.getElementsByTagName("ol");
    var navA = navWrap.getElementsByTagName("a");
    for (var n = 0; n < navA.length; n++) {
        navA[n].onclick = (function (n) {
            return function () {
                for (var m = 0; m < navA.length; m++) {
                    navA[m].style.backgroundColor = "#f2f2f2";
                    navA[m].style.color = "#333333";
                }
                navA[n].style.backgroundColor = "#a7a7a7";
                navA[n].style.color = "#fff";
            }
        })(n)
    }
    for (var i = 0, len = nav1s.length; i < len; i++) {
        nav1s[i].onclick = (function (i) {
            return function () {
                for (var j = 0; j < len; j++) {
                    nav2s[j].style.display = "none";
                }
                nav2s[i].style.display = "block";
            }
        })(i)
    }
}

//伸缩功能
function slideBtn() {
    $('.leftBox').toggle();
    var status = $('.leftBox').css("display");
    if (status == 'none') {
        $('.rightBox').css("marginLeft", "0");
        $(this).css("background", "red");
    } else {
        $('.rightBox').css("marginLeft", "24px");
        $(this).css("background", "green");
    }
}

//获取房间号
var getRoomNum = function () {
    var region = $('#region option:selected').val();
    var url = "/api/v1/common/getRoomNum?region=" + region;
    console.log(url);

    $.get(url, function (data, status) {
        if (status == 'success') {
            console.log(data)
            var roomNumList = data.data
            var optionstring = '<option selected="selected">所有</option>'
            for (var item in roomNumList) {
                optionstring += "<option value=\"" + roomNumList[item] + "\" >" + roomNumList[item] + "</option>";
            }
            $("#roomNum").html(optionstring);
        } else {
            alert("无数据")
        }
    });
}
//获取单元分析的房间号
var getUniRoomNum = function () {
    var region = $('#region option:selected').val();
    var url = "/api/v1/common/getRoomNum?region=" + region;
    console.log(url);

    $.get(url, function (data, status) {
        if (status == 'success') {
            console.log(data)
            var roomNumList = data.data
            var optionstring = '<option selected="selected" value="please">请选择</option>'
            for (var item in roomNumList) {
                optionstring += "<option value=\"" + roomNumList[item] + "\" >" + roomNumList[item] + "</option>";
            }
            $("#roomNum").html(optionstring);
        } else {
            alert("无数据")
        }
    });
}

// 生成动态表格
function dynamic_table(rawData, operationBtn) {
//    set header
    var headers = rawData.header;
    var tbl_header = "<thead class='thead-dark'><tr>";
    for (var key in headers) {
        tbl_header += "<th>" + headers[key] + "</th>";
    }
    tbl_header += "<th>操作</th></tr></thead>";
//    console.log(tbl_header);

//    set body
    var body = rawData.body;
    var tbl_body = "";
    for (var index in body) {
        var rowID = '<tbody class=""><tr>'
        rowID = rowID.format({id: body[index]['id']})
//        tbl_body += "<tr>";
        for (var key in headers) {
            tbl_body += "<td value=\"" + body[index][key] + "\">" + body[index][key] + "</td>";
        }
        tbl_body += operationBtn + "</tr></tbody>";
    }
//    console.log(tbl_body);

    var table_output = tbl_header + tbl_body;
    return table_output;
}

// 生成unitEchart动态表格
function dynamic_unitable(rawData, operationBtn) {
//    set header
    var headers = rawData.header;
    var tbl_header = "<thead class='thead-dark'><tr>";
    for (var key in headers) {
        tbl_header += "<th>" + headers[key] + "</th>";
    }
    tbl_header += "</tr></thead>";
//    console.log(tbl_header);

//    set body
    var body = rawData.body;
    var tbl_body = "";
    for (var index in body) {
        var rowID = '<tbody class=""><tr>'
        rowID = rowID.format({id: body[index]['id']})
//        tbl_body += "<tr>";
        for (var key in headers) {
            tbl_body += "<td value=\"" + body[index][key] + "\">" + body[index][key] + "</td>";
        }
        tbl_body += operationBtn + "</tr></tbody>";
    }
//    console.log(tbl_body);

    var table_output = tbl_header + tbl_body;
    return table_output;
}


String.prototype.format = function (args) {
    var result = this;
    if (arguments.length > 0) {
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                if (args[key] != undefined) {
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        } else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    //var reg = new RegExp("({[" + i + "]})", "g");//这个在索引大于9时会有问题
                    var reg = new RegExp("({)" + i + "(})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
}