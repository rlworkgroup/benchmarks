createGraph(0);

function createGraph(num){
    fetch("./resources/progress.json")
    .then(function(response) {
        return response.json();
    })
    .then(function(resultJson) {
        var tasks = {
            0:"Hopper-v2",
            1:"HalfCheetah-v2",
            2:"InvertedPendulum-v2",
            3:"InvertedDoublePendulum-v2",
            4:"Swimmer-v2",
            5:"Reacher-v2",
            6:"Walker2d-v2"
        }
        var task = tasks[num];
        var algo = document.getElementById('algo');
        var time = document.getElementById('time');
   
        algo.textContent = "DDPG";
        time.textContent = resultJson.time_start;

        var data  = formatData(resultJson[task])
        console.log(data);
        plot(task, data);
    });
}

function formatData(task_data){
    var data = [];
    for(var key in task_data){
        if(task_data.hasOwnProperty(key)){
            data.push( formatDataLine(key+"_garage",task_data[key].garage.Epoch  , task_data[key].garage.AverageReturn , "dot"));
            data.push( formatDataLine(key+"_baselines",task_data[key].baselines["total/epochs"],task_data[key].baselines["rollout/return"] ,"line"));
        }
    }
    return data;
}
function plot( taskname, data){
    var chart = document.getElementById('tester');
    var layout = {
        title: taskname,
        xaxis: {
          title: 'Epochs',
          autorange: true
        },
        yaxis: {
          title: 'AverageReturns',
          autorange: true
        },
        legend: {
          y: 0.5,
          traceorder: 'reversed',
          font: {
            size: 16
          }
        }
    }
    Plotly.newPlot( chart, data, layout);
}

function formatDataLine(name, x, y, linetype){
    var trace = {
        x: jsonToArr(x),
        y: jsonToArr(y),
        mode: 'lines',
        name: name,
        line: {
          dash: linetype,
          width: 4
        }
      }
    return trace;
}

function jsonToArr(json_data){
    var result = [];
    for(var item in json_data){
        result.push(json_data[item]);
    }
    return result;
}

