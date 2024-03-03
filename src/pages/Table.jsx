import './table.css';
import axios from "axios";
import { useState } from 'react';
import { useLocation } from "react-router-dom";

function getParams(location) {
    const params = new URLSearchParams(location.search);
    
    const username = params.get('username');

    const startDate = params.get('startDate');
    const startDay = params.get('startDay');

    const endDate = params.get('endDate');
    const endDay = params.get('endDay');

    const timeControls = params.get('timeControls').split(',');

    const winLetter = params.get('winLetter');
    const drawLetter = params.get('drawLetter');
    const loseLetter = params.get('loseLetter');

    return {username,startDate,startDay,endDate,endDay,timeControls,winLetter,drawLetter,loseLetter};
}

export default function Table() {
    const location = useLocation();
    const [loaded, setLoaded] = useState(false);
    const [progressWidthPercentage, setProgressWidthPercentage] = useState(0);
    const [pastResults, setPastResults] = useState(undefined);
    const [monthResults, setMonthResults] = useState(undefined);

    const { username, startDate, startDay, endDate, endDay, timeControls, winLetter, drawLetter, loseLetter } = getParams(location);

    async function getUsefulData() {
        const { data: { archives } } = await axios.get(`https://api.chess.com/pub/player/${username}/games/archives`);
        
        let start = -1;
        let end = -1;
        for (let i = 0; i < archives.length; i++) {
            const current = archives[i];
            const formatted = current.substring(current.lastIndexOf('/')-4);
            if (formatted === startDate) {
                start = i;
                if (!endDate) break;
            }
            if (endDate && formatted === endDate) {
                end = i;
                break;
            }
        }
        
        const useful = [...archives];
        useful.splice(0, start);
        if  (end !== -1) useful.splice(end, archives.length);

        return useful;
    }

    async function load() {
        const useful = await getUsefulData();
        
        const pastResults = {win:0,draw:0,lose:0};
        const monthResults = {...pastResults};
        for (let currentIndex = 0; currentIndex < useful.length; currentIndex++) {
            const { data: { games } } = await axios.get(useful[currentIndex]);
        
            for (let i = 0; i < games.length; i++) {
                const game = games[i];
                const isLast = currentIndex === useful.length - 1;
                const result = processGame(game, currentIndex === 0, isLast);
                if (result) {
                    if (isLast) monthResults[result]++;
                    else pastResults[result]++;
                }
            }
            setProgressWidthPercentage((currentIndex+1)/useful.length*100);
        }
        setPastResults(pastResults);
        setMonthResults(monthResults);
    }

    function processGame(game, isFirst, isLast) {
        try {
            const timeControl = game['time_class'];
            if (!timeControls.includes(timeControl)) return undefined;
            const gameDay = game['pgn'].split("Date \"")[1].substring(8, 10);
            
            if (isFirst && startDay) {
                if (parseInt(gameDay) < parseInt(startDay)) return undefined;
            }
            if (isLast && endDay) {
                if (parseInt(gameDay) > parseInt(endDay)) return undefined;
            }

            const playerColor = game['white']['username'] === username ? 'white' : 'black';
            const officialResult = game[playerColor]['result'];

            if (officialResult === 'win') return 'win';
            else if (officialResult === 'resigned' || officialResult === 'checkmated' || officialResult === 'timeout' || officialResult === 'abandoned') return 'lose';
            return 'draw';
        } catch {
            return undefined;
        }
    }

    if (!loaded) {
        setLoaded(true);
        (async () => {
            await load();
            setInterval(async () => {
                const useful = await getUsefulData();
                const { data: { games } } = await axios.get(useful[useful.length - 1]);
                
                const results = {win:0,lose:0,draw:0};
                for (let i = 0; i < games.length; i++) {
                    const game = games[i];
                    const result = processGame(game, useful.length === 1, true);
                    if (result) {
                        results[result]++;
                    }
                }
                setMonthResults(results);
            }, 10000);
        })();
    }
    
    return (
        <>
        {monthResults === undefined && (
            <div className="table-progress">
                <p>Please, wait... we are building your table.</p>
                <div className="progress">
                    <p className="progress-percentage">{parseInt(progressWidthPercentage)}%</p>
                    <div style={{width:`${progressWidthPercentage}%`}} className="value"></div>
                </div>
            </div>
        )}
        {monthResults !== undefined && (
            <>
            <p className="please-dont-remove-credits">Table made by Matheus Abido</p>
            <table>
                <tbody>
                    <tr>
                        <th>{winLetter || 'W'}</th>
                        <th>{loseLetter || 'L'}</th>
                        <th>{drawLetter || 'D'}</th>
                    </tr>
                    <tr>
                        <td>{pastResults.win + monthResults.win}</td>
                        <td>{pastResults.lose + monthResults.lose}</td>
                        <td>{pastResults.draw + monthResults.draw}</td>
                    </tr>
                </tbody>
            </table>
            </>
        )}
        </>
    );
}