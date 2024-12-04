const mowStatsChart = document.getElementById('mowStatsChart');

const buildChart = async (mowStats) => {
    const ms = JSON.parse(mowStats);
    const dateArr = [];
    const grassHeightBeforeArr = [];
    const grassHeightAfterArr = [];

    const mapped = ms.map((v, i) => {
        return {i, date: v['mow-date']};
    })

    mapped.sort((a, b) => {
        if (a.date > b.date) {
          return 1;
        }
        if (a.date < b.date) {
          return -1;
        }
        return 0;
      });

    const sortedByDate = mapped.map((v) => ms[v.i]);

    sortedByDate.forEach((instance) => {
        for(let data in instance) {
            console.log(instance[data]);
            if (data == "mow-date") {
                dateArr.push(instance[data]);
                console.log('mowDate - instance[data]');
            } else if (data == 'mow-stats') {
                for (let stats in instance[data]) {
                    console.log(instance[data][stats]);
                    if (stats == 'grass-height-before' && instance[data][stats] < 10) {
                        grassHeightBeforeArr.push(instance[data][stats]);
                    } else if (stats == 'grass-height-after' && instance[data][stats] < 10) {
                        grassHeightAfterArr.push(instance[data][stats]);
                    }
                }
            }


        }
    });

    console.log(dateArr);
    console.log(grassHeightBeforeArr);
    console.log(grassHeightAfterArr);

    const canvasData = mowStatsChart.getContext('2d');

    try {
        var existing_chart = Chart.getChart('mowStatsChart')
        existing_chart.destroy();
        console.log('trying to destory then redraw chart');
    } catch(e) {
        console.log('chart does not exist yet to destroy');
    }

    const chartAll = new Chart(mowStatsChart, {
        type: 'line',
        data: {
            labels: dateArr,
            datasets: [{
                label: 'Grass Height Before Mow',
                data: grassHeightBeforeArr,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            },
            {
                label: 'Grass Height After Mow',
                data: grassHeightAfterArr,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
 };

const buildChartProfile = async (mowStats) => {
    const ms = JSON.parse(mowStats);
    const dateArr = [];
    const grassHeightStart = [];
    const grassHeightEnd = [];
    const grassHeightData = [];

    const mapped = ms.map((v, i) => {
        return {i, date: v['mow-date']};
    })

    mapped.sort((a, b) => {
        if (a.date > b.date) {
          return 1;
        }
        if (a.date < b.date) {
          return -1;
        }
        return 0;
      });

    const sortedByDate = mapped.map((v) => ms[v.i]);

    sortedByDate.forEach((instance) => {
        for(let data in instance) {
            console.log(instance[data]);
            if (data == "mow-date") {
                dateArr.push(instance[data]);
                console.log('mowDate - instance[data]');
            } else if (data == 'mow-stats') {
                for (let stats in instance[data]) {
                    console.log(instance[data][stats]);
                    if (stats == 'grass-height-before' && instance[data][stats] < 10) {
                        const tempObj = {};
                        tempObj['x'] = instance[data]['mowed-date'];
                        tempObj['y'] = instance[data][stats];
                        grassHeightData.push(tempObj);
                    } else if (stats == 'grass-height-after' && instance[data][stats] < 10) {
                        const tempObj = {};
                        tempObj['x'] = instance[data]['mowed-date'];
                        tempObj['y'] = instance[data][stats];
                        grassHeightData.push(tempObj);
                    }
                }
            }


        }
    });

    console.log(dateArr);
    console.log(grassHeightData);

    const canvasData = mowStatsChart.getContext('2d');

    try {
        var existing_chart = Chart.getChart('mowStatsChart')
        existing_chart.destroy();
        console.log('trying to destory then redraw chart');
    } catch(e) {
        console.log('chart does not exist yet to destroy');
    }

    const chartProfile = new Chart(mowStatsChart, {
        type: 'line',
        data: {
            labels: dateArr,
            datasets: [{
                label: 'Grass Height Profile',
                data: grassHeightData,
                backgroundColor: 'rgba(70, 161, 74, 0.75)',
                borderColor: 'rgba(99, 255, 132, 1)',
                borderWidth: 1,
                fill: true
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
 };

 const notifyChart = (mowStats, type) => {
    setTimeout(() => {
        if (type === 'profile') {
            buildChartProfile(mowStats);
        } else {
            buildChart(mowStats);
        }
    }, 100);
 }

const statsButton = document.getElementById('mowStatistics');
const statsButtonProfile = document.getElementById('viewGrassHeightProfile');
const statsButtonViewAll = document.getElementById('viewAllStats');
const knowMow = readFromLocalStorage('mow-history');

statsButton.addEventListener('click', (ev) => {
    console.log(ev.target);
    // statsView();
    toggleView('stats');
    
    buildChart(knowMow);
});

statsButtonProfile.addEventListener('click', (ev) => {
    console.log(ev.target);
    //buildChartProfile(knowMow);
    notifyChart(knowMow, 'profile');
});

statsButtonViewAll.addEventListener('click', (ev) => {
    console.log(ev.target);
    //buildChart(knowMow);
    notifyChart(knowMow, 'all');
});

