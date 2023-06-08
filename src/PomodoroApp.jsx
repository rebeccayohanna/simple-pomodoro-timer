import React, { useRef } from 'react';
import { useEffect, useState } from 'react';
import beep from './fade_in.mp3';
import { ReactComponent as PlayIcon } from './images/play.svg';
import { ReactComponent as StopIcon } from './images/stop.svg';
import { ReactComponent as ReloadIcon } from './images/reload.svg';
import { ReactComponent as PlusIcon } from './images/plus.svg';
import { ReactComponent as MinusIcon } from './images/minus.svg';
import './PomodoroApp.scss';

const PomodoroApp = () => {
    const [sessionTime, setSessionTime] = useState(25);
    const [breakTime, setBreakTime] = useState(5);
    const [currentTime, setCurrentTime] = useState(1500);
    const [timerActive, setTimerActive] = useState(false);
    const [timerMode, setTimerMode] = useState('session');
    const audioTune = useRef();

    useEffect(() => {
        // Jika active (play) dan currentTime > 0 
        if(timerActive && currentTime > 0) {
            const interval = setInterval(() => {
                setCurrentTime(currentTime-1);
            }, 1000);
            return () => clearInterval(interval);
        } else if (currentTime === 0 ) { // tidak aktif dan current time sudah di 0, waktunya gantian.
            audioTune.current.play();
            setCurrentTime(0)
            if(timerMode === 'session') {
                setCurrentTime(minToSec(breakTime));
                setTimerMode('break');
            } else {
                setCurrentTime(minToSec(sessionTime));
                setTimerMode('session');

            }
        } else {
            console.log('ELSE.');
        }
    }, [timerActive, currentTime]);

    const onStartClick = () => {
        setTimerActive(true);
    }

    const onStopClick = () => {
        setTimerActive(false);
    }

    const onRepeatClick = () => {
        setCurrentTime(minToSec(sessionTime));
        audioTune.current.pause();
        audioTune.current.time = 0;
    }

    const onIncreaseBreak = () => {
        if (breakTime < 60) {
            setBreakTime(breakTime + 1);
        }
    }

    const onDecreaseBreak = () => {
        if (breakTime > 0) {
            setBreakTime(breakTime - 1);
        }
    }

    const onIncreaseSession = () => {
        if (sessionTime < 60) {
            setSessionTime(sessionTime + 1);
        }
    }

    const onDecreaseSession = () => {
        if (sessionTime > 0) {
            setSessionTime(sessionTime - 1);
        }
    }

    const timeFormat = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time - minutes * 60;

        return `${minutes} : ${seconds}`;
    }

    const minToSec = (time) => {
        return time*60;
    }
    return (
        <div className='pomodoro__app'>
            <div className='pomodoro__app_cols'>
                <div className='title'>
                    TIMER
                </div>
                <div className='countdown-time'>
                    {timeFormat(currentTime)}
                </div>
                <div className='action-buttons'>
                    <button className='round-btn' onClick={onRepeatClick}><ReloadIcon /></button>
                    {
                        timerActive &&
                        <button className='round-btn' onClick={onStopClick}><StopIcon /></button>
                    }
                    {
                        !timerActive &&
                        <button className='round-btn' onClick={onStartClick}><PlayIcon /></button>
                    }
                    
                </div>
            </div>
            <div className='pomodoro__app_rows'>
                <div className='pomodoro__app_cols'>
                    <div className='title'>
                        BREAK TIME
                    </div>
                    <div className='time-counter'>
                        <button className='round-btn' onClick={onDecreaseBreak}><MinusIcon /></button>
                        <input type={"number"} value={breakTime} min={0} max={60}/>
                        <button className='round-btn' onClick={onIncreaseBreak}><PlusIcon /></button>
                    </div>
                </div>
                <div className='pomodoro__app_cols'>
                    <div className='title'>
                        SESSION TIME
                    </div>
                    <div className='time-counter'>
                        <button className='round-btn' onClick={onDecreaseSession}><MinusIcon /></button>
                        <input type={"number"} value={sessionTime} min={0} max={60}/>
                        <button className='round-btn' onClick={onIncreaseSession}><PlusIcon /></button>
                    </div>
                </div>
            </div>
            <audio id="beep" src={beep} ref={audioTune} preload='auto' />
        </div>
    );
}

export default PomodoroApp;