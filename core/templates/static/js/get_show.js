"use strict"

var running_date = function(){
    getdate();
    getUserInfo();
}

var userInfo = function(){
    var url = "api/v1/get_data/getData"
    console.log(url);

    $.get(url,function(data, status){
        if (status == 'success'){
            var tblInfoCode = dynamic_unitable(data)
            console.log(tblInfoCode)
            $("#userInfoTbl").html(tblInfoCode);
        } else {
            alert("NO DATA!!")
        }
    });
}

var getdate = function(){
    var url = "api/v1/get_data/getdate"
    console.log(url);

    $.get(url, function (data, status) {
        if (status == 'success') {
            console.log(data)
            var date = data
            var optionstring = '<option selected="selected" value="please">请选择</option>'
            for (var item in date) {
                optionstring += "<option value=\"" + date[item] + "\" >" + date[item] + "</option>";
            }
            $("#date_choose").html(optionstring);
        } else {
            alert("无数据")
        }
    });
}

var same_check = function () {
    var url = "/api/v1/get_data/currentShowUser";
    var date1 = $("#date_choose option:selected").val();
    var time1 = $("#time option:selected").val();
    var name1 = $("#name").val();
    var error_flat;
    var count = 0;
    var same_day_order_flat = 0;
    var currentCheck = {name:name1, order_day:date1, order_time:time1}
    var currentPerson = {order_day:date1, order_time:time1}
    console.log(url);

    if (name1 == ''){
        alert("请输入姓名")
        getUserInfo();
    }
    else if (date1 == 'please'){
        alert("请选择日期")
        getUserInfo();
    }
    else if (time1 == 'timechose'){
        alert("请选择时间")
        getUserInfo();
    }
    else{
        $.get(url,function (data, status){
        if (status = 'success'){
            //用以判断所预约的时间是否被人预约，设置标志为error_flat
            for (var i=0;i<data.length;i++){
                if (data[i]["order_day"]== currentPerson["order_day"]){
                    if(data[i]["order_time"]== currentPerson["order_time"]){
                        error_flat = 1;
                        break;
                    }
                    else {
                        error_flat = 0;
                    }
                }
            }
            //
            //用以判断同一个是否在同一天预约超过两次，设置标志为same_day_order_flat
            for (var i=0;i<data.length;i++){
                if (data[i]["name"]== currentCheck["name"]){
                    if(data[i]["order_day"]== currentCheck["order_day"]){
                        same_day_order_flat++;
                        continue;
                    }
                    else {
                        count++;
                    }
                }
            }

            console.log(error_flat)
            console.log(same_day_order_flat)
            if (error_flat == 1){
                alert("您选的时间已被预约，请重新选择")
                getUserInfo();
            }
            else if (same_day_order_flat == 2){
                alert("预约失败：您不能同一天预约两次")
                getUserInfo();
            }
            else{
                add_data();
            }
        }
    });
    }
}

var add_data = function () {
        var name = $("#name").val();
        var date = $("#date_choose").val();
        var time = $("#time").val();
        var postData = {
            "name":name,
            "date":date,
            "time":time
        }
        var url = "/api/v1/get_data/addData"
        console.log(url);
        console.log(postData);
        $.ajax({
            type:'POST',
            url:url,
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(postData), //data: {key:value},
            //添加额外的请求头
            success: function (data) {
                //函数参数 "data" 为请求成功服务端返回的数据
                alert("预约成功")
                getUserInfo();
                console.log(data)
                return data;
            },
        });

}


var deleteUser = function (obj) {
    var selectedTr = obj;
    if (confirm("确定要删除吗?")) {
//        获取当前行
        var row = selectedTr.parentNode.parentNode;
//        获取当前行第一个单元格的value值
        var id = row.cells[0].childNodes[0].nodeValue;
        console.log(id);
        var postData = {
            "id": id
        };
        var url = "/api/v1/get_data/deleteData"
        console.log(url);
        console.log(postData);
        $.ajax({
            //请求类型，这里为POST
            type: 'POST',
            //你要请求的api的URL
            url: url,
            //数据类型，这里我用的是json
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(postData), //data: {key:value},
            //添加额外的请求头
            success: function (data) {
                //函数参数 "data" 为请求成功服务端返回的数据
                getUserInfo();
                console.log(data)
                return data;
            },
        });
    }
}

var getUserInfo = function () {
    var url = "/api/v1/get_data/getUserInfo";
    console.log(url);

    $.get(url, function (data, status) {
        if (status == 'success') {
            var button = '<td><input type="button" id = "deleteUser" name="deleteUser" value="取消预约" onclick="deleteUser(this)"></td>'
            var tblInfoCode = dynamic_table(data, button)
            console.log(tblInfoCode)
            $("#InfoTbl").html(tblInfoCode);
        } else {
            alert("无数据")
        }
    });
}

