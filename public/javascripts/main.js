const mowedForm = () => {
    const body = document.querySelector('body');
    const mowdalBG = document.createElement('div');
    const mowdal = document.createElement('div');

    mowdalBG.classList.add('mowdal-backdrop', 'fade', 'show');
    
    mowdal.classList.add('modal');
    mowdal.setAttribute('id', 'mowedFormModal');
    mowdal.setAttribute('tabindex', '-1');
    mowdal.setAttribute('aria-labelledby', 'mowedFormLabel');
    mowdal.setAttribute('aria-hidden', 'true');

    mowdal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <form id="mowedForm">
                    <div class="modal-header">
                        <button type="button" class="btn-close" data-mowdal-dismiss="modal" aria-label="Close">X</button>
                    </div>
                    <input type="hidden" id="mowed-id">
                    <div class="modal-body" id="mowedFormBody">
                        <div class="mb-3">
                            <label for="mowedYardState" class="form-label">Grass Height</label>
                            <div class="mb-3-group">
                                <legend>Before</legend>
                                <fieldset>
                                    <div class="grass-height-before">
                                        <input name="grass-height-before" type="number" step="0.25" class="form-control grass-height-before" id="grassHeightBefore" min="0" placeholder="0.0" required>
                                        <span>inches</span>
                                    </div>
                                </fieldset>
                            </div>
                            <div class="mb-3-group">
                                <legend>After</legend>
                                <fieldset>
                                    <div class="grass-height-after">
                                        <input name="grass-height-after" type="number" step="0.25" class="form-control grass-height-after" id="grassHeightAfter" min="0" placeholder="0.0" required>
                                        <span>inches</span>
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="mowedYardState" class="form-label">Yard State</label>
                            <div class="form-control mowed-yard-state" id="mowedYardState">
                                <button class="yard-state-button">Bare</button>
                                <button class="yard-state-button">Bare Spots</button>
                                <button class="yard-state-button">Average</button>
                                <button class="yard-state-button">Lush</button>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="mowedWeedsState" class="form-label">Weeds State</label>
                            <div class="form-control mowed-weeds-state" id="mowedWeedsState">
                                <button class="weeds-state-button">None</button>
                                <button class="weeds-state-button">Sparce</button>
                                <button class="weeds-state-button">Mostly</button>
                                <button class="weeds-state-button">All</button>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="mowed-date" class="form-label">Date Mowed</label>
                            <input name="mowed-date" type="date" class="form-control mowed-date" id="mowedDate" required>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="submit" class="btn btn-primary disabled" data-mowdal-save="modal">Save</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    mowdalBG.appendChild(mowdal);
    body.appendChild(mowdalBG);

    const mowdalDismiss = mowdal.querySelector('button[data-mowdal-dismiss="modal"]');
    mowdalDismiss.addEventListener('click', () => {
        mowdalBG.remove();
    });

    const mowdalInputs = mowdal.querySelectorAll('input.form-control');
    mowdalInputs.forEach((input) => {
        input.addEventListener('click', (ev) => {
            const parent = ev.target.parentElement;
            if(ev.target.classList.contains('error') || parent.classList.contains('error')) {
                parent.classList.remove('error');
                ev.target.classList.remove('error');
            }
        });
    });

    const mowdalButtons = mowdal.querySelectorAll('.form-control button');
    mowdalButtons.forEach((button) => {
        button.addEventListener('click', (ev) => {
            ev.preventDefault();
            const parent = ev.target.parentElement;
            const buttons = parent.querySelectorAll('button');
            buttons.forEach((btn) => {
                btn.classList.remove('selected');
            });
            ev.target.classList.add('selected');
            
            if (parent.classList.contains('error')) {
                parent.classList.remove('error');
            }
        });
    });

    const findErrors = (errArr) => {
        console.log(errArr);
        let yardCounter = 0;
        let weedsCounter = 0;

        errArr.forEach((err) => {
            if (err == "mowedYardState") {
                yardCounter++;
            } else if (err == "mowedWeedsState") {
                weedsCounter++;
            } else {
                document.querySelector(`.${err}`).classList.add('error');
            }

            if (yardCounter > 3) {
                document.querySelector('#mowedYardState').classList.add('error');
            }

            if (weedsCounter > 3) {
                document.querySelector('#mowedWeedsState').classList.add('error');
            }
        });
    }

    const mowdalSave = mowdal.querySelector('button[data-mowdal-save="modal"]');
    mowdalSave.addEventListener('click', (ev) => {
        ev.preventDefault();
        
        // const knowMow = localStorage.readFromLocalStorage('mow-history');
        const knowMow = readFromLocalStorage('mow-history');

        const form = document.getElementById("mowedForm");
        const submitter = ev.target;
        const formData = new FormData(form, submitter);
        const mowArr = [];
        const mowObj = {};
        const mowStats = {};
        const mowDate = document.getElementById('mowedDate').value;
        const errArr = [];
        let isValid;
        let validCount = 0;

        for (let [key, value] of formData) {
            if(value === "" || value < 0.1) {
                isValid = false;
                console.log(`${key} is blank`);
                errArr.push(key);
            } else {
                mowStats[key] = value;
                validCount++;
            }
        }

        for (let button of mowdalButtons) {
            if (button.classList.contains('selected')) {
                mowStats[button.parentElement.id] = button.textContent;
                console.log(`${button.parentElement.id} has been selected`);
                validCount++;
            } else {
                errArr.push(button.parentElement.id);
            }
        }

        validCount === 5 ? isValid = true : isValid = false;

        console.log(validCount);

        mowObj['mow-date'] = mowDate;
        mowObj['mow-stats'] = mowStats

        console.log(mowStats);
        console.log(mowObj);

        if (isValid) {
            submitter.classList.remove('disabled');

            if (knowMow) {
                const knowMowArr = JSON.parse(knowMow);
                knowMowArr.push(mowObj);
                // localStorage.writeToLocalStorage('mow-history', JSON.stringify(knowMowArr));
                writeToLocalStorage('mow-history', JSON.stringify(knowMowArr));
            } else {
                mowArr.push(mowObj);
                // localStorage.writeToLocalStorage('mow-history', JSON.stringify(mowArr));
                writeToLocalStorage('mow-history', JSON.stringify(mowArr));
            }

            console.log('mowdal saved');
            mowdalBG.remove();
        } else {
            findErrors(errArr);
        }
    });

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
    console.log(data);
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
        let skyTextDayClass = day.skytextday.replaceAll(' ', '-').toLowerCase();
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

const prepopulatePreviousZipCode = () => {
    // const zipCode = localStorage.readFromLocalStorage('zipCode');
    const zipCode = readFromLocalStorage('zipCode');
    if (zipCode && window.location.pathname === '/') {
        document.getElementById('zipCode').value = zipCode;
        fetchZipData(zipCode);
    } else {
        document.getElementById('zipCode').value = zipCode;
    }
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
        console.log('submitButtonClicked');
        if (zipCode.value.length !== 5) {
            zipCodeError.innerHTML = 'Please enter a valid 5 digit zip code';
        } else {
            zipCodeError.innerHTML = '';
            console.log("Zip: " + zipCode.value);
            // localStorage.writeToLocalStorage('zipCode', zipCode.value);
            writeToLocalStorage('zipCode', zipCode.value);
            toggleView('main');
            clearPreviousData();
            fetchZipData(zipCode.value);
        }
    });
}

const iMowedButton = document.getElementById('iMowed');

iMowedButton.addEventListener('click', () => {
    console.log('mowed');
    //mowedForm.mowedForm();
    mowedForm();
});

const main = () => {
    prepopulatePreviousZipCode();
    zipCodeInput();
}

main();
