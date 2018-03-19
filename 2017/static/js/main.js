let index_names = ['동학사', '갑사', '신원사', '수통골']
let coords = [
    [36.3544853, 127.2243804],
    [36.3660026, 127.186083],
    [36.3352365, 127.1839334],
    [36.3442277, 127.2870457]   
]

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function parseLocation(location) {
    if (location == 'all') {
        return ['갑사', '동학사', '수통골', '신원사'];
    }
    else if (location == '?') {
        return [];
    }
    else {
        ret = [];
        for (var i = 0; i < location.length; i++) {
            if (location[i] == '갑') ret.push('갑사');
            else if (location[i] == '동') ret.push('동학사');
            else if (location[i] == '수') ret.push('수통사');
            else if (location[i] == '신') ret.push('신원사');
        }
        return ret;
    }
}
var jsonCacheData = null;
function getData(callback) {
    if(jsonCacheData == null) {
        $.getJSON("static/imp.json", function (data) {
            for (var i = 0; i < data.length; i++) {
                data[i]['locations'] = parseLocation(data[i]['notes']);
            }
            jsonCacheData = data;
            callback(data);
        });   
    } else {
        callback(jsonCacheData);
    }
}
function commaSeperate(list) {
    if (list.length == 0) {
        return '-';
    } else {
        ret = "";
        for (var i = 0; i < list.length - 1; i++) {
            ret += list[i] + ', ';
        }
        ret += list[list.length - 1];
        return ret;
    }
}

function drawTableWorks() {
    getData(function (data) {
        for (var i = 0; i < data.length; i++) {
            $("#table-work > tbody").append(
                "<tr>"
                + "<td><a href=\"detail.html?id=" + i.toString() + "\">" + data[i].title + "</a></td>"
                + "<td>" + data[i].authors + "</td>"
                + "<td>" + commaSeperate(data[i].locations) + "</td>"
                + "</tr>"
            );
        }
    });
}
function getMarkerClickHandler(ind) {
    return function(e) {
        getData(function(data) {
            $('#modal-loc-content').html('');
            var workCount = 0;
            for(var i=0;i<data.length;i++) {
                if($.inArray(index_names[ind], data[i].locations)) {
                    workCount++;
                    $('#modal-loc-content').append("<li class=\"study-modal-item\"><a href=\"detail.html?id="+i+"\">"+data[i].title+"</a></li>");
                    $('#modal-loc-content').append("<span class=\"study-modal-author\"> by "+data[i].authors+"</span></li>");
                }
            }
            $('#modal-loc-title').text(index_names[ind]+"에서 진행된 연구 "+ workCount.toString()+"개");

            $('#modal-loc').modal();
        })
    }
}

function setupMap() {
    var mapOptions = {
        center: new naver.maps.LatLng(36.3481676, 127.2373303),
        zoom: 9,
        zoomControl: true
    };
    var map = new naver.maps.Map('map', mapOptions);
    var donghaksa = new naver.maps.Marker({
        position: new naver.maps.LatLng(36.3544853, 127.2243804),
        map: map
    });
    for(var i=0;i<4;i++) {
        var now = new naver.maps.Marker({
            position: new naver.maps.LatLng(coords[i][0], coords[i][1]),
            map: map
        });
        naver.maps.Event.addListener(now, 'click', getMarkerClickHandler(i));
    }
}

function loadDetail() {
    getData(function(data) {
        var id = parseInt(getParameterByName('id'));
        $("#study-title").html(data[id].title);
        $("#study-authors").html(data[id].authors);
        $("#study-locations").html(commaSeperate(data[id].locations));
        $("#btn-download-pdf").attr("href", "static/files/"+data[id].file+".pdf");
        $("#btn-download-pdf").attr("target", "_blank");
        PDFObject.embed("static/files/"+data[id].file+".pdf", "#pdf-wrapper");
    });
}
