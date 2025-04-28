'use client'

import React from 'react'
import Header from '../components/Header'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

export default function Page() {

    const router = useRouter()

    // Declaring relevant states and toggles for variables

    const [checked, setIsChecked] = useState(false)
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")

    const [boldFont, setBoldFont] = useState(false)
    const [largeText, setLargeText] = useState(false)
    const [dyslexicFont, setDyslexicFont] = useState(false)

    async function registerUser() {
        try {
            // Sending request to the register route containing informatio
            const response = await axios.post("/auth/register", {
                firstName,
                lastName,
                email,
                password
            });
            if (response.status === 201) { // if response = ok
                router.push("/login") // Route user to login page
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return alert(error.response.data.message) // Alert error message
            }
            alert("An error occurred. Please try again later.") // Log error message
            console.log(error) // Log errors to console
        }
    }

    // Attempt register function
    async function attemptRegister(event: React.FormEvent) {
        try {
            event.preventDefault() // Prevents the page from refreshing upon form submission
            // Checking all inputs
            if (!firstName || !lastName || !email || !password || !password2) {
                return alert("Please fill out all inputs.")
            }
            if (!checked) {
                return alert("You must agree to our terms and conditions.")
            }
            if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
                return alert("Please enter a valid email.")
            }
            if (password !== password2) {
                return alert("Ensure both passwords match.")
            }
            if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
                return alert("Ensure your password is 8 characters long, contains at least one number and one special character.")
            }
            registerUser()
        } catch (error) { // catch any errors
            alert(error) // alert any errors
        }
    }

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
        <div className={`w-screen h-screen overflow-hidden flex flex-col ${boldFont ? "font-bold" : ""} ${largeText ? "text-lg" : ""} ${dyslexicFont ? "font-dyslexic" : ""}`}>
            <Header />
            <div className='flex flex-grow bg-[#051C2F] w-screen justify-center items-center'>
                <form onSubmit={attemptRegister} className='bg-[#041625] text-white flex justify-center items-center flex-col gap-6 p-4 rounded-xl'>
                    <h1 className='text-2xl mb-2 p-3'>Create Account</h1>
                    <div className='flex flex-col gap-2'>
                        <div className='flex flex-row gap-2'>
                            <div className='flex flex-col gap-2 justify-center'>
                                <label htmlFor="firstNameInput">First Name</label>
                                <input type="text" id='firstNameInput' className='bg-[#0C2D48] rounded-xl p-2 outline-none' value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                            </div>
                            <div className='flex flex-col gap-2 justify-center'>
                                <label htmlFor="firstNameInput">Last Name</label>
                                <input type="text" id='firstNameInput' className='bg-[#0C2D48] rounded-xl p-2 outline-none' value={lastName} onChange={(e) => setLastName(e.target.value)} />
                            </div>
                        </div>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor="emailInput">Email</label>
                            <input type="text" className='bg-[#0C2D48] rounded-xl p-2 outline-none' value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor="emailInput">Password</label>
                            <input type="password" className='bg-[#0C2D48] rounded-xl p-2 outline-none' value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor="emailInput">Re-Enter Password</label>
                            <input type="password" className='bg-[#0C2D48] rounded-xl p-2 outline-none' value={password2} onChange={(e) => setPassword2(e.target.value)} />
                        </div>
                    </div>
                    <div className='w-full px-6'>
                        <div className='flex flex-row items-center gap-2 mb-2'>
                            <input type="checkbox" name="" id="checkbox" checked={checked} onChange={(e) => setIsChecked(e.target.checked)} />
                            <label htmlFor="checkbox"><Link href="/terms" className='hover:underline'>Agree to our terms and conditions</Link></label>
                        </div>
                        <button type="submit" className='bg-[#39EC2A] text-[#051C2F] w-full p-3 rounded-xl hover:bg-[hsl(115,84%,45%)] hover:cursor-pointer transition'>Create Account</button>
                    </div>
                    <div>
                        <p>Already have an account? <Link href="login" className='text-[#39EC2A] underline'>Login Instead</Link></p>
                    </div>
                </form>
            </div>
        </div>

    )
}
