'use client'

// Import required libraries

import React from 'react'
import Header from '../components/Header'
import Link from 'next/link'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from "react"

export default function page() {
    const router = useRouter()

    // Create states for accessability settings
    const [boldFont, setBoldFont] = useState(false)
    const [largeText, setLargeText] = useState(false)
    const [dyslexicFont, setDyslexicFont] = useState(false)


    // Use Effect for fetching accessability settings

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


    return (
        <div className='w-screen h-screen overflow-hidden flex flex-col'>
            <Header />
            <div className={`flex flex-grow bg-[#051C2F] w-screen justify-center items-center ${boldFont ? "font-bold" : ""} ${largeText ? "text-lg" : ""} ${dyslexicFont ? "font-dyslexic" : ""}`}>
                <h1 className='text-white font-bold text-4xl'>Terms and Conditions page</h1>
            </div>
        </div>

    )
}
