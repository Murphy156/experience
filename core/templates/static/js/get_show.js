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
            var optionstring = '<option selected="selected"></option>'
            for (var item in date) {
                optionstring += "<option value=\"" + date[item] + "\" >" + date[item] + "</option>";
            }
            $("#date_choose").html(optionstring);
        } else {
            alert("无数据")
        }
    });
}

var sleep = function (milliSeconds) {
        var startTime = new Date().getTime();
        while (new Date().getTime() < startTime + milliSeconds) {
            console.log(new Date().getTime());
        }//暂停一段时间 10000=1S。
    }

var same_check = function () {
    var url = "/api/v1/get_data/currentShowUser";
    var date1 = $("#date_choose").val();
    var time1 = $("#time").val();
    var error_flat;
    var currentPerson = {order_day:date1, order_time:time1}
    console.log(url);

    $.get(url,function (data, status){
        if (status = 'success'){
            console.log(data)
            console.log(currentPerson)
            console.log(data[0]["order_day"])
            console.log(currentPerson["order_day"])
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
            console.log(error_flat)
            if (error_flat == 1){
                alert("时间已被预约")
                getUserInfo();
            }
            else{
                add_data();
            }
        }
    });


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
