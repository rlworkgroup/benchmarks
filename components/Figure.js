import React from "react"
import Chart from "chart.js"

import { colorPattern, colorPattern_Alpha } from './Colors'

import styles from '../styles/Figure.module.css'

class Figure extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.updateChart();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.updateChart();
    }

    updateChart() {
        if (this.chart) {
            this.chart.destroy();
        }

        let datasets = this.props.lines.map((line, index) => {
            let indices = [...Array(line['xs'].length).keys()];
            let data = indices.map(i => {
                let x = Math.round(line['xs'][i]);
                let y = Math.round(line['ys'][i]);
                return {
                    x: x,
                    y: y
                }
            });

            return ({
                index: index,
                label: line['algo'],
                fill: false,
                data: data,
                borderColor: colorPattern[index],
                pointRadius: 1.2,
                pointHoverRadius: 2.4,
                pointBackgroundColor: colorPattern[index],
                backgroundColor: colorPattern_Alpha[index],
                borderWidth: 1.2,
                showLine: true,
                hidden: (line['algo'].includes('test'))
            });
        });

        let datasets_up = this.props.lines.map((line, index) => {
            let indices = [...Array(line['xs'].length).keys()];
            let data = indices.map(i => { return {
                x: line['xs'][i],
                y: line['ys_max'][i],
            } });

            return ({
                index: index,
                label: line['algo']+ 'up',
                fill: index,
                data: data,
                borderColor: 'transparent',
                backgroundColor: colorPattern_Alpha[index],
                pointRadius: 0,
                pointHoverRadius: 0,
                showLine: true,
                hidden: (line['algo'].includes('test'))
            });
        });

        let datasets_down = this.props.lines.map((line, index) => {
            let indices = [...Array(line['xs'].length).keys()];
            let data = indices.map(i => { return {
                x: line['xs'][i],
                y: line['ys_min'][i],
            } });

            return ({
                index: index,
                label: line['algo']+ 'down',
                fill: index,
                data: data,
                borderColor: 'transparent',
                backgroundColor: colorPattern_Alpha[index],
                pointRadius: 0,
                pointHoverRadius: 0,
                showLine: true,
                hidden: (line['algo'].includes('test'))
            });
        });

        datasets = datasets.concat(datasets_up);
        datasets = datasets.concat(datasets_down);

        let shown;
        let cursorPositionX;
        let that = this;

        this.chart = new Chart(this.myCanvas, {
            type: 'scatter',
            data: {
                datasets: datasets
            },
            options: {
                scales: {
                    xAxes: [{
                        ticks: {
                            callback: function(tick) {
                                return tick.toLocaleString();
                            }
                        },
                        scaleLabel: {
                            display: true,
                            labelString: this.props.lines[0]['x_label']
                        }
                    }],
                    yAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: this.props.lines[0]['y_label']
                        }
                    }],
                },
                tooltips: {
                    mode: 'x',
                    filter: function (tooltipItem, data) {
                        let L = data.datasets.length / 3;
                        if (tooltipItem.datasetIndex >= L) {
                            return false;
                        }
                        else {
                            if (cursorPositionX === that.chart.tooltip._eventPosition.x) {
                                if (shown.has(tooltipItem.datasetIndex)) {
                                    return false;
                                }
                                else {
                                    shown.add(tooltipItem.datasetIndex);
                                    return true;
                                }
                            }
                            else {
                                shown = new Set();
                                cursorPositionX = that.chart.tooltip._eventPosition.x;
                                shown.add(tooltipItem.datasetIndex);
                                return true;
                            }
                        }
                    }
                },
                legend: {
                    labels: {
                        filter: function(item, chart) {
                            return !(item.text.includes('up') || item.text.includes('down'));
                        }
                    },
                    onHover: function(e) {
                        e.target.style.cursor = 'pointer';
                    },
                    onClick: function(e, item) {
                        let is_hidden = item.hidden;
                        datasets.forEach((each) => {
                            if (each.index === item.datasetIndex) {
                                each.hidden = !is_hidden;
                            }
                        });
                        this.chart.update();
                    }
                },
                hover: {
                    onHover: function(e) {
                        let point = this.getElementAtEvent(e);
                        if (point.length) e.target.style.cursor = 'pointer';
                        else e.target.style.cursor = 'default';
                    }
                }
            }
        });
    }

    round(num) {
        return Math.round((num + Number.EPSILON) * 10) / 10;
    }

    render() {
        return(
            <div className={styles['canvas-section']}>
                <canvas className={styles['canvas-chart']} ref={node =>{this.myCanvas=node}} />
            </div>
        );
    }
}

export default Figure;
