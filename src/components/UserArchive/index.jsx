import { useState } from 'react';
import './index.css';
import Input from '../Input';
import Button from '../Button';

export default function UserArchive({ userArchive }) {
    const [shouldEnd, setShouldEnd] = useState(false);
    const [buildMessage, setBuildMessage] = useState(undefined);

    function formatApiStringDate(apiString) {
        return apiString.substring(apiString.lastIndexOf('/')-4);
    }

    function updateShouldEnd() {
        setShouldEnd(document.querySelector("#should-end").checked)
    }

    function buildTable() {
        const url = new URL(`${window.location.href}table`);

        url.searchParams.append('username', document.querySelector('#username').value);

        const startDateElement = document.querySelector('#start-date');
        const startDateOption = startDateElement.options[startDateElement.selectedIndex];
        url.searchParams.append('startDate', startDateOption.innerText);

        const specificStart = document.querySelector('#specific-start');
        if (specificStart.value) url.searchParams.append('startDay', specificStart.value);

        const shouldEnd = document.querySelector('#should-end').checked;
        if (shouldEnd) {
            const endDateElement = document.querySelector('#end-date');
            const endDateOption = endDateElement.options[endDateElement.selectedIndex];
            url.searchParams.append('endDate', endDateOption.innerText);

            const specificEnd = document.querySelector('#specific-end');
            if (specificEnd.value) url.searchParams.append('endDay', specificEnd.value);
        }

        let timeControls = ['bullet', 'blitz', 'rapid', 'daily'];
        timeControls = timeControls.map(e => document.querySelector(`#${e}`))
        .filter(e => e.checked)
        .map(e => e.id);

        if (!timeControls.length) {
            setBuildMessage("At least one time control must be selected");
            return;
        }
        
        url.searchParams.append('timeControls', timeControls.join(','));

        const winLetter = document.querySelector("#win-letter").value;
        const drawLetter = document.querySelector("#draw-letter").value;
        const loseLetter = document.querySelector("#lose-letter").value;
        if (winLetter) url.searchParams.append('winLetter', winLetter);
        if (drawLetter) url.searchParams.append('drawLetter', drawLetter);
        if (loseLetter) url.searchParams.append('loseLetter', loseLetter);

        window.location.href = url.href;
    }

    let optionKey = 0;
    return (
    <div className="user-archive">
        <p><strong>Minimum Date:</strong> {formatApiStringDate(userArchive[0])}</p>
        <p><strong>Maximum Date:</strong> {formatApiStringDate(userArchive[userArchive.length-1])}</p>
        
        <div className="date-selector">
            <div>
                <p>Select a valid starting date:</p>
                <select id="start-date">
                    {userArchive.map(e => <option key={optionKey++}>{formatApiStringDate(e)}</option>)}
                </select>
            </div>
            <Input id="specific-start" placeholder="Day to start" hint="Specific day to start. If you want the whole month, leave it empty.">Day to start:</Input>
        </div>
        <div className="mode-selector">
            <span>
                <input type="checkbox" id="should-end" onClick={updateShouldEnd} />
                <label htmlFor="should-end">Should end</label>
            </span>
        </div>
        {shouldEnd && (
        <div className="date-selector">
            <p>Select a valid ending date:</p>
            <select id="end-date">
                {userArchive.map(e => <option key={optionKey++}>{formatApiStringDate(e)}</option>)}
            </select>
            <Input id="specific-end" placeholder="Day to end" hint="Specific day to end. If you want the whole month, leave it empty.">Day to end:</Input>
        </div>
        )}
        <div className="mode-selector">
            <p>Select the desired time controls</p>
            <span>
                <input id="bullet" type="checkbox" />
                <label htmlFor="bullet">Bullet</label>
            </span>
            <span>
                <input id="blitz" type="checkbox" />
                <label htmlFor="blitz">Blitz</label>
            </span>
            <span>
                <input id="rapid" type="checkbox" />
                <label htmlFor="rapid">Rapid</label>
            </span>
            <span>
                <input id="daily" type="checkbox" />
                <label htmlFor="daily">Daily</label>
            </span>
        </div>
        <div style={{marginTop:'1rem'}}>
            <input type="text" placeholder="Win Letter" id="win-letter" />
            <h3 className="input-hint">The letter used to represent wins. If you don't set this field, it'll be W.</h3>
            
            <input type="text" placeholder="Lose Letter" id="lose-letter" />
            <h3 className="input-hint">The letter used to represent losses. If you don't set this field, it'll be L.</h3>

            <input type="text" placeholder="Draw Letter" id="draw-letter" />
            <h3 className="input-hint">The letter used to represent draws. If you don't set this field, it'll be D.</h3>
        </div>
        <div className="build-button">
            <Button onClick={buildTable}>Build Table</Button>
            {buildMessage && <h3 className="input-hint">{buildMessage}</h3>}
        </div>
    </div>
    );
}