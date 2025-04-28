'use client'

// Importing required libraries

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { FaArrowRight } from 'react-icons/fa'
import axios from "axios"
import { useRouter } from 'next/navigation'

export default function Header() {

    // Creating states for required variables and toggles

    const [isLoggedIn, setIsLoggedIn] = useState(null)

    const [boldFont, setBoldFont] = useState(false)
    const [largeText, setLargeText] = useState(false)
    const [dyslexicFont, setDyslexicFont] = useState(false)

    // UseEffect to send request to check if user is logged in and fetch their accessability settings if they are logged i

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


    const router = useRouter()

    // Function to redirect user to dashboard page

    function redirectDashboard() {
        router.push("/dashboard")
    }

    // Function to redirect user to login page

    function redirectLogin() {
        router.push("/login")
    }

    // Sending request to backend to check if the user is logged in

    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await axios.get("/api/isLoggedIn", { withCredentials: true });
                setIsLoggedIn(response.data.isLoggedIn);
            } catch (error) {
                console.error("Error fetching session:", error)
                setIsLoggedIn(false)
            }
        };
        checkSession()
    }, [])
    return (
        <div className={`w-screen h-[10vh] bg-[#051C2F] flex justify-around items-center flex-row ${boldFont ? "font-bold" : ""} ${largeText ? "text-lg" : ""} ${dyslexicFont ? "font-dyslexic" : ""}`}>
            <h1 className=' text-3xl bg-gradient-to-bl from-[#39EC2A] to-[hsl(115,84%,35%)] bg-clip-text leading-normal text-transparent font-semibold'>Rolsa Technologies</h1>
            <ul className={`text-white flex flex-row gap-10 justify-center items-center `}>
                <li className='hover:text-gray-300'><Link href="/">Home</Link></li>
                <li className='hover:text-gray-300'><Link href="/services">Services</Link></li>
                <li className='hover:text-gray-300'><Link href="/carbonCalculator">Carbon Footprint Calculator</Link></li>
            </ul>
            {isLoggedIn === null ? null : isLoggedIn ? (
                <button onClick={redirectDashboard} type='button' className='bg-[#39EC2A] hover:bg-[hsl(115,84%,45%)] hover:cursor-pointer py-4 px-6 rounded-xl transition flex items-center justify-center gap-2 text-[#051C2F]'>My Account <FaArrowRight /></button>
            ) : ( // If user is logged in show the dashboard button, if they are not then show the login button
                <button onClick={redirectLogin} type='button' className='bg-[#39EC2A] hover:bg-[hsl(115,84%,45%)] hover:cursor-pointer py-4 px-6 rounded-xl transition flex items-center justify-center gap-2 text-[#051C2F]'>Login <FaArrowRight /></button>
            )}
        </div>
    )
}
