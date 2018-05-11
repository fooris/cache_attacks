

google.charts.load('current', { 'packages': ['line'] });
google.charts.setOnLoadCallback(drawChart);


var evictionBuffer = new ArrayBuffer(8 * 1024 * 1024);
var evictionView = new DataView(evictionBuffer);

var probeBuffer = new ArrayBuffer(8 * 1024 * 1024);
var probeView = new DataView(probeBuffer);

var offset = 64;
var fixed = true;

var k = 100;

function drawChart(datapoints) {

    var data = new google.visualization.DataTable();
    data.addColumn('number', fixed ? 'round' : 'addr');
    data.addColumn('number', 'acces time evicted');
    data.addColumn('number', 'acces time cached');

    console.log("start measuring...");
    var d = new Array();

    for (var r = 0; r < k; r++) {
        /* purge L3 */
        for (var i = 0; i < ((8192 * 1023) / offset); i++) {
            current = evictionView.getUint32(i * offset);
        }
        var x = fixed ? 0 : r * offset;
        /* evicted */
        var y1 = timeAccessVar(x)*1000;
        /* cached */
        var y2 = timeAccessVar(x)*1000;
        d.push([fixed ? r : x, y1, y2])
    }

    console.log("done");
    console.log("start plotting...");

    data.addRows(d);

    var options = {
        chart: {
          title: 'time to acces cached vs evicted memory',
          subtitle: 'in µs'
        },
        width: 2000,
        height: 800,

        series: {
            1: {
              targetAxisIndex:0
            }
          },
        vAxes: {
            0: {
                title: 'time in µs',
                viewWindow: {
                    max: 4
              }
            }
          }
        
            
      };

      var chart = new google.charts.Line(document.getElementById('plot1'));

      chart.draw(data, google.charts.Line.convertOptions(options));
      console.log("done");
}

function timeAccessVar(addr) {
    var t1 = performance.now();
    var c = probeView.getUint8(addr);
    var t2 = performance.now();
    return t2 - t1;

}

