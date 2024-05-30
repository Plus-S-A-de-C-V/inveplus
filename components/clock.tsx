"use client";

import React, { useEffect, useState } from 'react';
import { format, getHours } from "date-fns";

export default function Clock() {
    const [time, setTime] = useState<Date | null>();
    const [date, setDate] = useState<Date | null>(new Date());

    useEffect(() => {
        const timerId = setInterval(refreshTime, 1000);
        const dateId = setInterval(refreshDate, 1000 * 60 * 60 * 24);
        return function cleanup() {
            clearInterval(dateId);
            clearInterval(timerId);
        };
    }, [])

    const refreshTime = () => {
        const currentTime = new Date();
        setTime(currentTime);
    };

    const refreshDate = () => {
        const currentDate = new Date();
        setDate(currentDate);
    }
    return (
        <>
            <div className="align-middle object-center m-auto">
                <h1 className="text-7xl font-bold align-middle object-center">
                    {
                        time ? (
                            format(time, "h:mm:ss a")
                        ) : "-:--:-- --"
                    }
                </h1>
            </div>
            <div className="align-middle object-center m-auto">
                {
                    date ? (
                        format(date, "MMMM, iiii dd yyy")
                    ) : "--, -- -- --"
                }
            </div>
        </>

    )
}