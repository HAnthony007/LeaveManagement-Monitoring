"use client"
import { Scheduler } from "@bitnoi.se/react-scheduler";
export const SchedulerPlaning = () => {
    return (
        <>
            <h1>
                Voici le scheduler
            </h1>
            <Scheduler data={[]}
                config={{
                    zoom: 0,
                    lang: "fr",
                }}
            />      
        </>
    )
}