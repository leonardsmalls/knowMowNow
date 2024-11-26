import * as localStorage from './localStorage.js';

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
        
        const knowMow = localStorage.readFromLocalStorage('mow-history');

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
                localStorage.writeToLocalStorage('mow-history', JSON.stringify(knowMowArr));
            } else {
                mowArr.push(mowObj);
                localStorage.writeToLocalStorage('mow-history', JSON.stringify(mowArr));
            }

            console.log('mowdal saved');
            mowdalBG.remove();
        } else {
            findErrors(errArr);
        }
    });

}

export { mowedForm }