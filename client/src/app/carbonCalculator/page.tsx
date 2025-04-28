'use client'

// Import required libraries

import React from 'react'
import axios from 'axios'
import { useState } from 'react'
import { useEffect } from 'react'
import Header from '../components/Header'

export default function Page() {

    // Set states for accessability settings and variables needed for calculation

    const [boldFont, setBoldFont] = useState(false)
    const [largeText, setLargeText] = useState(false)
    const [dyslexicFont, setDyslexicFont] = useState(false)

    const [electricity, setElectricity] = useState(0)
    const [appliances, setAppliances] = useState({
        airConditioner: false,
        washingMachine: false,
        fridge: false,
    })
    const [carbonFootprint, setCarbonFootprint] = useState(0)

    // Use effect to send request to isLoggedIn and GetAccessabilitySettings 

    useEffect(() => {
        const fetchAccessibilitySettings = async () => {
            try {
                const sessionResponse = await axios.get("/api/isLoggedIn");
                const isLoggedIn = sessionResponse.data.isLoggedIn;

                if (!isLoggedIn) {
                    return;
                }

                const response = await axios.get("/api/getAccessabilitySettings");
                if (response.status === 201) {
                    const { boldFont, largeText, dyslexicFont } = response.data;
                    setBoldFont(boldFont);
                    setLargeText(largeText);
                    setDyslexicFont(dyslexicFont);
                } else if (response.status === 200) {
                    console.log("Accessibility settings not found.");
                    return; // Explicitly stop further execution
                }
            } catch (error) {
                console.error("Error fetching accessibility settings:", error);
                if (error.response?.status !== 404) {
                    alert("Error fetching accessibility settings");
                }
            }
        };
        fetchAccessibilitySettings();
    }, []);


    // Function to calculate carbonFootprint 

    function calculateFootprint() {
        try {
            const electricityEmissionFactor = 0.92
            let applianceFootprint = 0

            if (appliances.airConditioner) applianceFootprint += 50
            if (appliances.washingMachine) applianceFootprint += 30
            if (appliances.fridge) applianceFootprint += 40

            const electricityFootprint = electricity * electricityEmissionFactor
            const totalFootprint = electricityFootprint * applianceFootprint

            setCarbonFootprint(totalFootprint)

        } catch (error) {
            alert("Error calculating footprint")
        }
    }

    // Function that toggles appliances on or off
    function toggleAppliance(appliance: string) {
        setAppliances((prev) => ({
            ...prev,
            [appliance]: !prev[appliance]
        }))
    }

    return (
        <div className={`w-full h-screen overflow-x-hidden flex flex-col text-white ${boldFont ? "font-bold" : ""} ${largeText ? "text-lg" : ""} ${dyslexicFont ? "font-dyslexic" : ""}`}>
            <Header />
            <div className='h-full bg-[#051C2F] w-screen'>
                <div className='w-full h-full flex justify-center items-center'>
                    <div className='bg-[#041625] w-3/5 h-[60vh] rounded-2xl p-5'>
                        <h1 className='text-2xl font-bold mb-4'>Carbon Footprint Calculator</h1>
                        <div className='mb-4'>
                            <label>Electricity Usage (kWh): </label>
                            <input type="number" value={electricity} onChange={(e) => setElectricity(Number(e.target.value))} className='w-full p-2 rounded bg-gray-800 text-white' />
                        </div>
                        <div>
                            <h2 className='text-lg font-bold mb-2'>Appliances</h2>
                            <div className='mb-4'>
                                <input type="checkbox" id='airConditionerCheck' checked={appliances.airConditioner} onChange={() => toggleAppliance("airConditioner")} className='mr-2' />
                                <label htmlFor='airConditionerCheck'>Air Conditioner</label>
                            </div>
                            <div className='mb-4'>
                                <input type="checkbox" id='washingMachineCheck' checked={appliances.washingMachine} onChange={() => toggleAppliance("washingMachine")} className='mr-2' />
                                <label htmlFor='washingMachineCheck'>Washing Machine</label>
                            </div>
                            <div className='mb-4'>
                                <input type="checkbox" id='fridgeCheck' checked={appliances.fridge} onChange={() => toggleAppliance("fridge")} className='mr-2' />
                                <label htmlFor='fridgeCheck'>Fridge</label>
                            </div>
                        </div>
                        <div className='w-full flex justify-center items-center mt-10'>
                            <button onClick={calculateFootprint} type='button' className='bg-[#39EC2A] hover:bg-[hsl(115,84%,45%)] text-[#051C2F] py-4 px-6 rounded-xl transition w-2/3'>Calculate</button>
                        </div>
                        {carbonFootprint !== null && (
                            <div className='mt-4 w-full flex justify-center items-center flex-col'>
                                <h2 className='text-lg font-bold'>Your Carbon Footprint:</h2>
                                <p className='text-2xl'>{carbonFootprint.toFixed(2)} kg CO₂</p>

                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
