var jsondata;

$(document).ready(function () {
    //off('click').on(
    $('button#drawChart').click(function () {
        var socket = io.connect('http://localhost:8081');
        $.get('http://localhost:8080/onload', function (data) {// $.get('http://10.109.218.19:8080/onload', function (data) {
            
            //$(".result").html(data);
            //alert(data);
            var arr = new Array(data.length);
            var offset = new Date().getTimezoneOffset() * 60000;
            for (var i = 0; i < data.length; i++)
            {
                var obj = {};
                obj['y'] = data[i]['y'];
                obj['x'] = Date.UTC(data[i]['YEAR'], data[i]['MONTH'], data[i]['DATE'], data[i]['Hour'], data[i]['MINUTE'], data[i]['SECOND'], data[i]['MILLISECOND']) + offset;
                arr[i] = obj;
            }
            jsondata = arr;
           
         // var socket = io.connect('http://localhost:8081');// var socket = io.connect('http://10.109.218.19:8081');


            Highcharts.setOptions({
                global: {
                    useUTC: false
                }

            });

            $('#container').highcharts({
                chart: {
                    type: 'spline',
                    animation: Highcharts.svg, // don't animate in old IE
                    marginRight: 10,
                    events: {
                    load:    
                        function () {
                            
                            //set up the updating of the chart each second
                            var series = this.series[0];
                          //  setInterval(function () {
                            //    $.get('http://10.109.219.24:8081/live', function (data) {
                            //        var offset = new Date().getTimezoneOffset() * 60000;
                            //        //var x1 = new Date(data[0]['YEAR'], data[0]['MONTH'], data[0]['DATE'], data[0]['Hour'], data[0]['MINUTE'], data[0]['SECOND'], data[0]['MILLISECOND']);
                            //        var x1 = Date.UTC(data[0]['YEAR'], data[0]['MONTH'], data[0]['DATE'], data[0]['Hour'], data[0]['MINUTE'], data[0]['SECOND'], data[0]['MILLISECOND']) + offset;
                            //        var y1 = data[0]['y'];
                            //        console.log(x1);
                            //        series.addPoint([x1, y1], true, true);
                            //    });
                            //}, 3000);

                            socket.on('message', function (data) {
                                        var x1 = Date.UTC(data[0]['YEAR'], data[0]['MONTH'], data[0]['DATE'], data[0]['Hour'], data[0]['MINUTE'], data[0]['SECOND'], data[0]['MILLISECOND']);
                                        var y1 = data[0]['y'];
                                       // alert(y1);
                                        series.addPoint([x1, y1], true, true);
                            });
                        }
                    }
                },
                title: {
                    text: 'NodeJS POC'
                },
                global: {
                    useUTC: false
                },
                xAxis: {
                    type: 'datetime',
                    tickPixelInterval: 150
                },
                yAxis: {
                    title: {
                        text: 'Value'
                    },
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }]
                },
                tooltip: {
                    formatter: function () {
                        return '<b>' + this.series.name + '</b><br/>' +
          Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
          Highcharts.numberFormat(this.y, 2);
                    }
                },
                legend: {
                    enabled: false
                },
                exporting: {
                    enabled: false
                },
                series: [{
                    name: 'Random sensor data',
                    data: jsondata
                }]
            });


        });



    });
});
window.onbeforeunload = function (e) {
//    socket.emit('forceDisconnect');
//    socket.disconnect();
//    // WebSocket.CLOSED = true;
//    socket.close();
var io = io();
io.emit('end');
};
