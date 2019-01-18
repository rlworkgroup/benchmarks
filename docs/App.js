var tasks = [
    "Hopper-v2",
    "HalfCheetah-v2",
    "InvertedPendulum-v2",
    "InvertedDoublePendulum-v2",
    "Swimmer-v2",
    "Reacher-v2",
    "Walker2d-v2"
];
var algos=[
    "DDPG",
    "HER",
    "TRPO",
    "PPO"
];

var task = tasks[0];
var algo = algos[0];
var selectedAlgos = [algos[0],algos[1]];
renderPage();

function renderPage(){
    $.each( tasks, function( index, task ) {
        $('#task_dropdown').append(
            `<li onclick=\"selectTask(${index})\"> ${task}</li>`)
    });
    $.each( algos, function( index, algo ) {
        $('#algo_dropdown').append(
            `<li ><input type=\"checkbox\" /> ${algo}</li>`)
    });
    
    createGraph();
}
function selectTask(num){
    task = tasks[num];
    createGraph();
}

function selectAlgo(nums){
    algo = algos[num];
    createGraph();
}

function createGraph(){
    fetch("./resources/progress.json")
    .then(function(response) {
        return response.json();
    })
    .then(function(resultJson) {
        var algoElem = $('#algo')[0].textContent = algo;
        var timeElem = $('#time')[0].textContent = resultJson.time_start;//convert to MON/DD/YYYY
        var taskElem = $('#task')[0].textContent = task;

        var data  = formatData(resultJson[task], algo)
        plot(task, data);
    });
}

function formatData(task_data, algo){
    var data = [];
    for(var key in task_data){
        if(task_data.hasOwnProperty(key)){
            data.push( 
                formatDataLine( 
                    `garage_${algo}_${key}`,
                    task_data[key].garage.Epoch  , 
                    task_data[key].garage.AverageReturn , 
                    "dot"));

            data.push( 
                formatDataLine( 
                    `baselines_${algo}_${key}`,
                    task_data[key].baselines["total/epochs"],
                    task_data[key].baselines["rollout/return"] ,
                    "line"));
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
