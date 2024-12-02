const mowStatsChart = document.getElementById('mowStatsChart');

const displayChart = (Chart) => {
    //console.log(Chart.ctx);
    // const chart = new Chart(mowStatsChart, {
    //     type: 'line',
    //     data: {
    //         labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    //         datasets: [{
    //             label: 'Mowed Yards',
    //             data: [12, 19, 3, 5, 2, 3, 9],
    //             backgroundColor: 'rgba(255, 99, 132, 0.2)',
    //             borderColor: 'rgba(255, 99, 132, 1)',
    //             borderWidth: 1
    //         },
    //         {
    //             label: 'Mowed Weeds',
    //             data: [2, 3, 1, 3, 2, 4, 1],
    //             backgroundColor: 'rgba(54, 162, 235, 0.2)',
    //             borderColor: 'rgba(54, 162, 235, 1)',
    //             borderWidth: 1
    //         }]
    //     },
    //     options: {
    //         scales: {
    //             y: {
    //                 beginAtZero: true
    //             }
    //         }
    //     }
    // });
}

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

    new Chart(mowStatsChart, {
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

const statsButton = document.getElementById('mowStatistics');

statsButton.addEventListener('click', (ev) => {
    console.log(ev.target);
    // statsView();
    toggleView('stats');
    const knowMow = readFromLocalStorage('mow-history');

    buildChart(knowMow);
});