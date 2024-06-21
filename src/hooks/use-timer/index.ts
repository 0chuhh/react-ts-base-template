import { useSessionStorage } from "hooks/use-session-storage";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";

interface ITimer {
    hours: number,
    minutes: number,
    seconds: number;
}

export const useTimer = (keyId: string, initSeconds = 0, onExpired?: () => void) => {
    const [time, setTime] = useState<ITimer>({ hours: 0, minutes: 0, seconds: 0 });
    const [isStarted, setIsStarted] = useSessionStorage(`${keyId}-started`, false);
    const [isExpired, setIsExpired] = useState(false);
    const [endTime, setEndTime] = useSessionStorage<number>(`${keyId}-timer`);

    ///init timer values
    const initTime = useCallback(() => {
        let hours = 0;
        let minutes = 0;
        let seconds = 0;
        /// if timer already started and stored 
        /// get session end time and set timer from now to session end time
        if (endTime && isStarted) {
            const now = Date.now();
            const timeLeftInSec = Math.floor((endTime - now) / 1000);
            if (timeLeftInSec <= 0) return;
            hours = Math.floor(timeLeftInSec / 3600);
            minutes = Math.floor(timeLeftInSec / 60) % 60;
            seconds = timeLeftInSec % 60;
        } else {
            ///set timer with init values
            hours = Math.floor(initSeconds / 3600);
            minutes = Math.floor(initSeconds / 60) % 60;
            seconds = initSeconds % 60;

        }

        setTime({
            hours,
            minutes,
            seconds
        });
    }, [endTime, initSeconds, isStarted]);


    ///starts timer
    const startTimer = useCallback((callback?: () => void) => {
        /// set expiring time to session storage
        setEndTime(Date.now() + (initSeconds * 1000));
        initTime();
        setIsStarted(true);
        setIsExpired(false);
        if (callback) callback();
    }, [initSeconds, initTime, setEndTime, setIsStarted]);

    ///stops timer
    const stopTimer = useCallback((callback?: () => void) => {
        setIsStarted(false);
        setIsExpired(true);
        if (callback) callback();
    }, [setIsStarted]);

    ///checking that the timer has not expired
    const checkTimerNotExpired = useCallback(() => {
        if (!isStarted) return false;
        if (!endTime) return false;
        const now = Date.now();
        const timeLeft = endTime - now;
        if (timeLeft <= 0) {
            stopTimer();
            if (onExpired) onExpired();
            return false;
        }
        return true;

    }, [endTime, isStarted, onExpired, stopTimer]);

    /// formated time
    const formatTime = () => {
        return [time.hours, time.minutes, time.seconds]
            .map(v => v < 10 ? "0" + v : v)
            .filter((v, i) => v !== "00" || i > 0)
            .join(":");
    };

    /// if timer already started and stored 
    /// get end time from session and starts timer from now to session end time
    useLayoutEffect(() => {
        initTime();
    }, [initTime]);

    ///change time per sec
    useEffect(() => {
        let timer: string | number | NodeJS.Timeout | undefined;

        if (checkTimerNotExpired()) {
            timer = setTimeout(() => {
                setTime(prevTime => {
                    let hours: number = prevTime.hours;
                    let minutes: number = prevTime.minutes;
                    let seconds: number = prevTime.seconds;

                    if (prevTime.seconds > 0) {
                        seconds = seconds - 1;
                    }
                    if (prevTime.seconds === 0 && (prevTime.minutes > 0 || prevTime.hours > 0)) {
                        seconds = 59;
                    }

                    if (prevTime.seconds === 0 && prevTime.minutes > 0) {
                        minutes = prevTime.minutes - 1;
                    }
                    if (prevTime.seconds === 0 && prevTime.minutes === 0 && prevTime.hours > 0) {
                        minutes = 59;
                        hours = prevTime.hours - 1;
                    }

                    return {
                        seconds: seconds,
                        hours: hours,
                        minutes: minutes
                    };
                });
            }, 1000);
        }
        return () => clearTimeout(timer);
    }, [checkTimerNotExpired, time]);


    return {
        time: formatTime(),
        startTimer,
        stopTimer,
        isExpired: isExpired
    };
};