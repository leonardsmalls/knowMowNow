const writeToLocalStorage = (key, value) => {
    window.localStorage.setItem(key, value);
}

const growGrass = () => {
    const grassContainer = document.querySelector('.grass-container');

    const clipGrass = () => {
        const grass = document.querySelectorAll('.grass-top');
    
        grass.forEach((g, index) => {
            if (index % 3 === 0) {
                setTimeout(() => {
                    g.classList.add('clip-grass3');
                }, index * 10);
            } else if (index % 5 === 0) {
                setTimeout(() => {
                    g.classList.add('clip-grass2');
                }, index * 10);
            } else {
                setTimeout(() => {
                    g.classList.add('clip-grass1');
                }, index * 10);
            }
        });
    }

    for (let i = 0; i < 100; i++) {
        const grass = document.createElement('div');
        const grassTop = document.createElement('div');
        const grassBottom = document.createElement('div');
        grass.classList.add('grass');
        grassTop.classList.add('grass-top');
        grassBottom.classList.add('grass-bottom');
        grassTop.style.cssText = `transform: rotate(${Math.floor(Math.random() * 180)}deg);`;
        grass.appendChild(grassTop);
        grass.appendChild(grassBottom);
        grass.style.cssText = `transform: rotate(${Math.floor(Math.random() * 10)}deg); top: ${Math.floor(Math.random() * 100)}%; left: ${Math.floor(Math.random() * 100)}%;`
        grassContainer.appendChild(grass);
    }

    clipGrass();
}

const addSummary = (goodDays, okDays, badDays) => {
    const summary = document.querySelector('.summary');
    const pGood = document.createElement('p');
    const pOk = document.createElement('p');
    const pBad = document.createElement('p');

    if (goodDays.length > 1) {
        pGood.textContent = `The best days to mow are: `;
    } else if (goodDays.length === 0) {
        pGood.textContent = `There are no best days to mow. \uD83D\uDCA9`;
    } else {
        pGood.textContent = `The best day to mow is: `;
    }

    goodDays.forEach((day, index) => {
        pGood.textContent += day.querySelector('h2').textContent;
        if (index < goodDays.length - 1) {
            pGood.textContent += '\u{1F31E}, ';
        } else {
            pGood.textContent += '\u{1F31E}';
        }
    });

    if (okDays.length > 1) {
        pOk.innerHTML = `The <i>iffy</i> days to mow are: `;
    } else if (okDays.length === 0) {
        pOk.innerHTML = `There are no <i>iffy</i> days to mow. \u{1F937}`;
    } else {
        pOk.innerHTML = `The <i>iffy</i> day to mow is: `;
    }

    okDays.forEach((day, index) => {
        pOk.textContent += day.querySelector('h2').textContent;
        if (index < okDays.length - 1) {
            pOk.textContent += '\u{1F91E}, ';
        } else {
            pOk.textContent += '\u{1F91E}';
        }
    });

    if (badDays.length > 1) {
        pBad.textContent = `The worst days to mow are: `;
    } else if (badDays.length === 0) {
        pBad.textContent = `There are no bad days! \u{1F919}`;
    } else {
        pBad.textContent = `The worst day to mow is: `;
    }

    badDays.forEach((day, index) => {
        pBad.textContent += day.querySelector('h2').textContent;
        if (index < badDays.length - 1) {
            pBad.textContent += '\uD83D\uDCA9, ';
        } else {
            pBad.textContent += '\uD83D\uDCA9';
        }
    });

    summary.appendChild(pGood);
    summary.appendChild(pOk);
    summary.appendChild(pBad);


    
}

const displayWeather = (data) => {
    const localeName = data[0].location.name;
    const localeTemp = data[0].current.temperature;
    const forecast = data[0].forecast;

    //weatherDisplay.innerHTML = `The current temperature in ${localeName} is ${localeTemp} degrees.`;

    if ("content" in document.createElement("template")) {
      const template = document.querySelector("#weathertemplate");
      const templateDivCurrent = document.querySelector(".row.current");
      const templateDivForecast = document.querySelector(".row.forecast");

      const clone = template.content.cloneNode(true);
      let h2 = clone.querySelector("h2");
      let p = clone.querySelector("p");

      h2.textContent = "Weather in " + localeName;
      p.textContent = "The current temperature is " + localeTemp + " degrees.";

      templateDivCurrent.appendChild(clone);

      forecast.forEach((day, index) => {
        const rateMowPoints = (day, index) => {
            let prevDayI = index - 1;
            let nextDayI  = index + 1;
            const prevDay = forecast[prevDayI];
            const nextDay = forecast[nextDayI];

            let mowPoints = 0;

            if (index > 0) {
                if (prevDay['precip'] > 70) {
                    mowPoints -= 5;
                } else if (prevDay['precip'] > 50) {
                    mowPoints -= 3;
                } else if (prevDay['precip'] > 30) {
                    mowPoints -= 1;
                } else {
                    mowPoints += 5;
                }

            }

            console.log(`the mowpoints after prevDay check for ${day.day} are: ` + mowPoints)

            if (index < forecast.length - 1) {
                if (nextDay.precip > 70) {
                    mowPoints += 10;
                } else if (nextDay.precip > 50) {
                    mowPoints += 8;
                } else if (nextDay.precip > 30) {
                    mowPoints += 5;
                } else if (nextDay.precip > 20) {
                    mowPoints += 3;
                } else if (nextDay.precip > 10) {
                    mowPoints += 2;
                } else if (nextDay.precip > 0) {
                    mowPoints += 1;
                }
            }

            console.log(`the mowpoints after nextDay check for ${day.day} are: ` + mowPoints)

            if (day.precip >= 0 && day.precip < 10) {
                mowPoints += 10;
            } else if (day.precip >= 10 && day.precip < 20) {
                mowPoints += 8;
            } else if (day.precip >= 20 && day.precip < 35) {
                mowPoints += 5;
            } else if (day.precip >= 35) {
                mowPoints = 0;
            } else {
                mowPoints = 0;
            }

            console.log(`the mowpoints after self check for ${day.day} are: ` + mowPoints);
            return mowPoints;
        }

        const mowScore = rateMowPoints(day, index);
        const clone = template.content.cloneNode(true);
        let h2 = clone.querySelector("h2");
        let pHigh = clone.querySelector("p.high");
        let pLow = clone.querySelector("p.low");
        let pPrecip = clone.querySelector("p.precip");
        let pSkyTextDay = clone.querySelector("p.skytextday");
        let skyTextDayClass = day.skytextday.replace(' ', '-').toLowerCase();
        h2.textContent = day.day;
        pHigh.textContent = "High: " + day.high;
        pLow.textContent = "Low: " + day.low;
        pPrecip.textContent = "Precipitation: " + day.precip;
        pSkyTextDay.textContent = "Sky: " + day.skytextday;
        pSkyTextDay.parentElement.classList.add(skyTextDayClass);
        pSkyTextDay.parentElement.dataset.mowScore = mowScore;

        templateDivForecast.appendChild(clone);
      })

      const mowScores = document.querySelectorAll('.row.forecast div[data-mow-score]');
      const goodDays = [];
      const okDays = [];
      const badDays = [];

      mowScores.forEach((score,  index) => {
            let mowScore = score.dataset.mowScore;
            if (mowScore >= 10) {
                score.classList.add('good-mow');
                goodDays.push(score);
            } else if (mowScore >= 5) {
                score.classList.add('ok-mow');
                okDays.push(score);
            } else {
                score.classList.add('bad-mow');
                badDays.push(score);
            }
      });

        const highestMowScore = Array.from(mowScores).reduce((highest, element, index) => {
            const scoreValue = parseInt(element.dataset.mowScore);
            return scoreValue > highest.score ? { score: scoreValue, element } : highest;
        }, {score: 0, element: null});

        console.log(highestMowScore.score);
        console.log(highestMowScore.element);

        highestMowScore.element.classList.add('best-day-to-mow');
        addSummary(goodDays, okDays, badDays);
        //growGrass();

    } else {
      // Find another way to add the rows to the table because
      // the HTML template element is not supported.
    }

}

const fetchZipData = async (zipCode) => {
   await fetch('/api/weather?zipcode=' + zipCode)
  .then(response => response.json())
  .then(data => displayWeather(data))
  .catch((error) => {
    console.error('Error:', error);
  });
};

const clearPreviousData = () => {
    console.log('EMPTY');
    document.querySelector('.row.current').innerHTML = '';
    document.querySelector('.row.forecast').innerHTML = '';
    document.querySelector('.summary').innerHTML = '';
}

const zipCodeInput = () => {
    const zipCode = document.getElementById('zipCode');
    const zipCodeError = document.getElementById('zipCodeError');
    const submitButton = document.getElementById('zipSubmit');

    zipCode.addEventListener('input', () => {
        if (zipCode.value.length !== 5) {
            zipCodeError.innerHTML = 'Please enter a valid 5 digit zip code';
        } else {
            zipCodeError.innerHTML = '';
        }
    });

    submitButton.addEventListener('click', () => {
        console.log('submitClicked');
        if (zipCode.value.length !== 5) {
            zipCodeError.innerHTML = 'Please enter a valid 5 digit zip code';
        } else {
            zipCodeError.innerHTML = '';
            clearPreviousData();
            console.log("Zip: " + zipCode.value);
            writeToLocalStorage('zipCode', zipCode.value);
            fetchZipData(zipCode.value);
            //putData('/weather', { zipcode: zipCode.value });
        }
    });
}

const main = () => {
    zipCodeInput();
}

main();
