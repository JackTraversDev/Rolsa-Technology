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

    // set variables and toggles 

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    // Function for attempting login

    async function attemptLogin(event: React.FormEvent) {
        try {
            event.preventDefault() // Prevent page from refreshing upon submission
            if (!email || !password) { // If email or password is not filled in
                return alert("Please fill out all fields.") // Alert error message
            }
            loginUser() // Run the loginUser route if the email and password is filled in
        } catch (error) { // Catch any errors
            console.error(error) // Log any errors to console
            alert("There was an error... Please try again later") // If there are any errors alert error message to the user
        }
    }

    // Function or logging in the user
    async function loginUser() {
        try {

            const response = await axios.post("/auth/login", { // end request to login route containing email and password
                email,
                password
            })
            if (response.status === 201) { // if status = ok
                router.push("/") // push the user to the main page
            }
        } catch (error) { // catch any errors
            if (axios.isAxiosError(error) && error.response) { // Error checking 
                return alert(error.response.data.message) // Alert error message
            }
            alert("An error occurred. Please try again later.") // Alert Error message
            console.log(error) // Log errors to console
        }
    }

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
                <form onSubmit={attemptLogin} className='bg-[#041625] text-white flex justify-center items-center flex-col gap-6 p-4 rounded-xl w-[25rem]'>
                    <h1 className='text-2xl p-3'>Welcome Back</h1>
                    <div className='flex flex-col gap-2 w-full'>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor="emailInput">Email</label>
                            <input type="text" id='emailInput' className='bg-[#0C2D48] rounded-xl p-2 outline-none' value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor="passwordInput">Password</label>
                            <input type="password" id='passwordInput' className='bg-[#0C2D48] rounded-xl p-2 outline-none' value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                    </div>
                    <div className='w-full px-6'>
                        <button type="submit" className='bg-[#39EC2A] text-[#051C2F] w-full p-3 rounded-xl hover:bg-[hsl(115,84%,45%)] hover:cursor-pointer transition'>Login</button>
                    </div>
                    <div>
                        <p>Don't have an account? <Link href="register" className='text-[#39EC2A] underline'>Create an Account</Link></p>
                    </div>
                </form>
            </div>
        </div>

    )
}
