(function(){

    fetch("./resources/progress.json")
        .then(function(response) {
            return response.json();
        })
        .then(function(results_json){

        $('#time')[0].textContent = results_json.timestamp

        this.tasks = results_json.tasks
        
        this.selected_task = this.tasks[0]
        this.algos = Object.keys(results_json.algos);

        $('#task_dropdown').empty()
        $.each( this.tasks, function( index, t ) {
            $('#task_dropdown').append(
                `<li onclick=\"selectTask(${index})\"> ${t}</li>`)
        });

        this.selectable_algos = get_algo_tasks(results_json, this.tasks, this.algos)[this.selected_task]
        this.selected_algos = this.selectable_algos.slice()

        update_algo_dropdown(this.selectable_algos)
        create_graph(results_json,  this.selected_algos, this.selected_task);

        this.selectTask = function (num){
            this.selected_task = this.tasks[num]
            this.selectable_algos = get_algo_tasks(results_json, this.tasks, this.algos)[this.selected_task]
            this.selected_algos = this.selectable_algos.slice()
            update_algo_dropdown(this.selectable_algos)
            create_graph(results_json,  this.selected_algos , this.selected_task);
        }

        this.selectAlgo = function(num){
            algo = this.selectable_algos[num]
            if( this.selected_algos.indexOf(algo) > -1){ 
                this.selected_algos = selected_algos.filter( (val) => val != algo)
            }
            else{
                this.selected_algos.push(algo)
            }
            create_graph(results_json,  this.selected_algos, this.selected_task);
        }

    })

    function update_algo_dropdown(selectable_algos){
        $('#algo_dropdown').empty()
        if(selectable_algos){
            $('#algo')[0].textContent = ""
            $.each( selectable_algos, function( index, a ) {
                $('#algo_dropdown').append(
                    `<li><input onclick=\"selectAlgo(${index})\" type=\"checkbox\" checked=true /> ${a}</li>`)
            });
        }
        else{
            $('#algo_dropdown').append("Task was not run")
        }
    }

    function create_graph(json, selected_algos, selected_task ){
        var taskElem = $('#task')[0].textContent = selected_task
        var data  = formatData(json, selected_task, selected_algos)//pass array of algos instead
        var layout = {
            // title: selected_task,
            xaxis: {
                title: 'Time Steps',
                autorange: true
            },
            yaxis: {
                title: 'Average Returns',
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
        Plotly.newPlot( document.getElementById('tester'), data, layout);
    }



    function formatData(json, selected_task, selected_algos){
        var data = [];
        selected_algos.forEach(function(algo){
            ["trail_1"].forEach(function(trail){
                data.push( 
                    formatDataLine( 
                        `garage_${algo}_${trail}`,
                        json.algos[algo][selected_task][trail].garage.time_steps  , 
                        json.algos[algo][selected_task][trail].garage.return , 
                        "dot"));
    
                data.push( 
                    formatDataLine( 
                        `baselines_${algo}_${trail}`,
                        json.algos[algo][selected_task][trail].baselines.time_steps  , 
                        json.algos[algo][selected_task][trail].baselines.return , 
                        "line"));
            })
        })
        return data;
    }

    function get_algo_tasks(resultsJson, tasks, algos){
        //return an object that lists which algorithms ran against a given task
        var algo_tasks = {}
        tasks.forEach( function(t){
            compatible_algos = []
            algos.forEach(function(a){
                if(resultsJson.algos[a].hasOwnProperty(t)){
                    compatible_algos.push(a) 
                }
            })
            algo_tasks[t]=compatible_algos
        })
        return algo_tasks
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

    
})()

