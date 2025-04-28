'use client'


// Importing required libraries

import React, { use, useEffect, useState } from 'react'
import Header from '../components/Header'
import { FaUserCog, FaChartLine, FaUniversalAccess, FaCalendarAlt, FaCalendarCheck, FaLifeRing, FaSignOutAlt } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import axios from 'axios'

export default function Page() {

    // Setting states and toggles for needed variables

    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [activeTab, setActiveTab] = useState("account")

    const [address, setAddress] = useState("")
    const [bookingType, setBookingType] = useState("")
    const [bookingTime, setBookingTime] = useState("")


    const [bookings, setBookings] = useState([])

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")

    const [boldFont, setBoldFont] = useState(false)
    const [largeText, setLargeText] = useState(false)
    const [dyslexicFont, setDyslexicFont] = useState(false)

    const [userData, setUserData] = useState<{ firstName: string; lastName: string; email: string } | null>(null)

    const router = useRouter()


    async function deleteAccount() {
        try {
            const response = await axios.delete("/api/deleteAccount")
            if (response.status === 201) {
                alert("Account Deleted Successfully")
                router.push("/login")
            } else {
                return alert("Error deleting account, please try again later.")
            }
        } catch (error) {
            return alert("Error deleting account, please try again later.")
        }
    }

    // Function to allow user to create a booking

    async function createBooking(event: React.FormEvent) {
        event.preventDefault(); // Preventing page refresh when the user submits the form

        try {
            const [bookingDate, bookingTimeValue] = bookingTime.split("T"); // Splitting at T to allow me to store the bookingDate and Time in different variables

            // Send API request to the booking backend API to store the booking
            const response = await axios.post("/api/booking", {
                address,
                bookingType,
                bookingDate,
                bookingTime: bookingTimeValue,
            });

            if (response.status === 201) { // Upon Success alert the user saying booking was successful
                alert("Booking created successfully!");
                // Make the inputs blank
                setAddress("");
                setBookingType("");
                setBookingTime("");
            } else {
                alert("Failed to create booking."); // IF there is an error then alert saying their was an error
            }
        } catch (error) {
            console.error("Error creating booking:", error); // Log the error
            alert("An error occurred while creating the booking."); // Alert error message
        }
    }

    // Logout function
    async function logout() {
        try {
            // send request to the logout route in the backend
            const response = await axios.post("/api/logout")
            if (response.status !== 201) { // if Fail alert the user
                return alert("Internal Server error.")
            }
            router.push("/login") // Upon Success automatically rout the user to the login page
        } catch (error) { // Catch any errors
            console.log(error) // Log eny errors to the console
            return alert("Internal server error") // Alert error message informing the user
        }
    }

    // Use effect to send api request to the islogged in route 
    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await axios.get("/api/isLoggedIn", { withCredentials: true })
                if (response.data.isLoggedIn) {
                    setIsLoggedIn(true)
                } else {
                    router.push("/login") // If the user is not logged in then route them back to the login page
                }
            } catch (error) {
                console.error("Error fetching session:", error)
                router.push("/login") // Any errors will route the user back to the login page
            }
        }
        checkSession()
    }, [router])

    // Use effect to fetch the logged in users data
    useEffect(() => {
        axios.get("/api/getDetails").then(response => {
            if (response.data.firstName && response.data.lastName && response.data.email) { // If statement checking that all of the information has been retrieved from the api route
                setUserData(response.data) // Set the user data with the returned data from the request
            } else {
                router.push("/login") // If there is any errors, route the user back to the login page
            }
        })
            .catch(error => { // catch any errors
                console.log("Error fetching session data", error) // Log any errors to console
                router.push("/login") // If there is any errors then route the user to the login page
            })
    }, [router])

    // Use effect to fetch bookings made by the user upon page load
    useEffect(() => {
        const getBookings = async () => {
            try {
                const response = await axios.get("/api/getBookings"); // Sending request to the backend
                if (response.status === 201 && Array.isArray(response.data)) { // If the response status is 201 and the response contains an array
                    setBookings(response.data) // Set bookings
                } else {
                    alert("Unable to fetch bookings"); // If there is any errors alert the user
                }
            } catch (error) { // Catch any errors
                console.error("Error fetching bookings:", error); // Log any errors to the console
                alert("Error fetching bookings."); // Alert error message to the user informing them of any errors
            }
        };

        getBookings();
    }, []);


    // async function to edit user profile
    async function editProfile(event: React.FormEvent) {
        event.preventDefault(); // Prevent page from refreshing upon form submission

        try {
            // Update the variables
            const updatedFirstName = firstName || userData?.firstName;
            const updatedLastName = lastName || userData?.lastName;
            const updatedEmail = email || userData?.email;

            // Check new email against email regex
            if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(updatedEmail)) {
                return alert("Please enter a valid email address."); // If email is not valid then send alert the user
            }

            if (password) { // If the user entered a new password
                if (password !== password2) { // Make sure the password matches re-enter password
                    return alert("Passwords do not match."); // If not return alert to user 
                }
                if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) { // Test the new password against a password regex
                    return alert("Password must be at least 8 characters long and include a letter, a number, and a special character."); // If the password does not pass the regex test, alert to the user
                }
            }

            const payload: any = {
                firstName: updatedFirstName,
                lastName: updatedLastName,
                email: updatedEmail,
            };
            if (password) {
                payload.password = password;
            }
            const response = await axios.post("/api/editProfile", payload);

            if (response.status === 201) { // If response = ok
                alert("Profile updated successfully."); // Alert success
                // Clear and Reset all input fields
                setFirstName("");
                setLastName("");
                setEmail("");
                setPassword("");
                setPassword2("");
            } else {
                alert("Error updating profile.");
            }
        } catch (error) {
            console.error("Error updating profile:", error.response?.data || error.message);
            alert(error.response.data.message)
        }
    }
    // Function to save new accessability settings
    async function saveAccessabilitySettings() {
        try {
            const response = await axios.post("/api/saveAccessabilitySettings", { // Send request to the saveAccessabilitySettings route in the backend containing new data
                boldFont,
                largeText,
                dyslexicFont
            })
            if (response.status === 201) { // If response = ok
                alert("Accessability settings updated successfully") // Alert success message
            } else { // If failure
                alert("Failed to update accessability settings") // Alert error message
            }
        } catch (error) { // catch any errors
            console.error(error) // Log any errors
            alert("An error occurred whilst saving the changes") // Alert error message
        }
    }

    // Use Effect to fetch users accessability settings
    useEffect(() => {
        const fetchAccessibilitySettings = async () => {
            try {
                // Send get request to the isLoggedin Route
                const sessionResponse = await axios.get("/api/isLoggedIn");
                const isLoggedIn = sessionResponse.data.isLoggedIn;

                if (!isLoggedIn) { // if user is not logged in, do not fetch for accessabilityDetails
                    return;
                }
                // Send get request to the backend getAccessabilitySettings api route
                const response = await axios.get("/api/getAccessabilitySettings");
                if (response.status === 201) { // if status = ok
                    const { boldFont, largeText, dyslexicFont } = response.data; // set the variables to response data
                    setBoldFont(boldFont);
                    setLargeText(largeText);
                    setDyslexicFont(dyslexicFont);
                } else if (response.status === 404) { // If any errors
                    return; // Stop
                }
            } catch (error) { // Catch any errors
                console.error(error); // Log any errors to console
                alert("Error fetching accessibility settings"); // Alert error message
            }
        };
        fetchAccessibilitySettings();
    }, []);

    return (
        <div className={`w-screen h-screen overflow-hidden flex flex-col ${boldFont ? "font-bold" : ""} ${largeText ? "text-lg" : ""} ${dyslexicFont ? "font-dyslexic" : ""}`}>
            <Header />
            <div className='flex h-screen w-screen bg-[hsl(207,81%,8%)] justify-center items-center'>
                {isLoggedIn ? (
                    <div className='flex flex-row w-full h-full'>
                        <div className='bg-[hsl(207,81%,10%)] h-full w-[30vh] flex items-center justify-between text-md flex-col text-[#B2C4D1]'>
                            <ul className='flex flex-col gap-3'>
                                <li><button type="button" className={`flex items-center gap-2 transition ${activeTab === "account" ? "text-[#39EC2A]" : "hover:text-[#39EC2A]"}`} onClick={() => setActiveTab("account")}><FaUserCog /> Account Settings</button></li>
                                <li><button type="button" className={`flex items-center gap-2 transition ${activeTab === "accessibility" ? "text-[#39EC2A]" : "hover:text-[#39EC2A]"}`} onClick={() => setActiveTab("accessibility")}><FaUniversalAccess /> Accessibility Settings</button></li>
                                <li><button type="button" className={`flex items-center gap-2 transition ${activeTab === "createBooking" ? "text-[#39EC2A]" : "hover:text-[#39EC2A]"}`} onClick={() => setActiveTab("createBooking")}><FaCalendarAlt />Create Booking</button></li>
                                <li><button type="button" className={`flex items-center gap-2 transition ${activeTab === "appointments" ? "text-[#39EC2A]" : "hover:text-[#39EC2A]"}`} onClick={() => setActiveTab("appointments")}><FaCalendarCheck /> View Appointments</button></li>
                                <li><button type="button" className={`flex items-center gap-2 transition ${activeTab === "support" ? "text-[#39EC2A]" : "hover:text-[#39EC2A]"}`} onClick={() => setActiveTab("support")}><FaLifeRing /> Support</button></li>
                            </ul>
                            <ul className='flex self-start justify-center items-center w-full mb-10'>
                                <li className='flex flex-row'><button onClick={logout} className='flex flex-row gap-2 justify-center items-center hover:cursor-pointer hover:text-red-500 transition' type="button">Logout <FaSignOutAlt className='text-red-500' /></button></li>
                            </ul>
                        </div>
                        {activeTab === "account" && (
                            <div className='bg-[hsl(207,81%,15%)] w-full h-full p-8 flex flex-col justify-center items-center'>
                                <div className='flex justify-center items-center text-3xl text-white pb-8 font-bold'>
                                    <h1>Account Settings</h1>
                                </div>
                                <div className='flex flex-col gap-6 w-1/3'>
                                    <div className='flex flex-col gap-2'>
                                        <label htmlFor="firstName" className='text-white text-lg'>First Name</label>
                                        <input type="text" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} className='outline-none border-2 border-slate-700 rounded-lg px-4 py-2 bg-[hsl(207,81%,10%)] text-white' placeholder={userData.firstName || "Enter your first name"} />
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label htmlFor="lastName" className='text-white text-lg'>Last Name</label>
                                        <input type="text" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} className='outline-none border-2 border-slate-700 rounded-lg px-4 py-2 bg-[hsl(207,81%,10%)] text-white' placeholder={userData.lastName || "Enter your last name"} />
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label htmlFor="email" className='text-white text-lg'>Email</label>
                                        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className='outline-none border-2 border-slate-700 rounded-lg px-4 py-2 bg-[hsl(207,81%,10%)] text-white' placeholder={userData.email || "Enter your email"} />
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label htmlFor="password" className='text-white text-lg'>New Password</label>
                                        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className='outline-none border-2 border-slate-700 rounded-lg px-4 py-2 bg-[hsl(207,81%,10%)] text-white' placeholder="Enter your new password" />
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label htmlFor="rePassword" className='text-white text-lg'>Re-enter New Password</label>
                                        <input type="password" id="rePassword" value={password2} onChange={(e) => setPassword2(e.target.value)} className='outline-none border-2 border-slate-700 rounded-lg px-4 py-2 bg-[hsl(207,81%,10%)] text-white' placeholder="Re-enter your new password" />
                                    </div>
                                    <div className='flex justify-center pt-4 flex-row gap-4'>
                                        <button type="button" onClick={editProfile} className='bg-[#39EC2A] text-black font-semibold px-6 py-2 rounded-lg hover:bg-[#2dbb20] transition'>Save Changes</button>
                                        <button type="button" className='bg-red-500 text-black font-semibold px-6 py-2 rounded-lg hover:bg-red-600 transition' onClick={deleteAccount}>Delete Account</button>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === "accessibility" && (
                            <div className='bg-[hsl(207,81%,15%)] w-full h-full'>
                                <div className='w-full mb-4 text-white font-bold text-2xl flex justify-center items-center'>
                                    <h1>Accessability Settings</h1>
                                </div>
                                <div className='flex flex-col gap-4 text-white pl-5'>
                                    <div className='flex flex-row gap-2'>
                                        <input type="checkbox" id='boldFont' checked={boldFont} onChange={(e) => setBoldFont(e.target.checked)} />
                                        <label htmlFor="boldFont" className='text-lg'>Enable Bold Font</label>
                                    </div>
                                    <div className='flex flex-row gap-2'>
                                        <input type="checkbox" id='largeText' checked={largeText} onChange={(e) => setLargeText(e.target.checked)} />
                                        <label htmlFor="largeText" className='text-lg'>Enable Large Text</label>
                                    </div>
                                    <div className='flex flex-row gap-2'>
                                        <input type="checkbox" id='dyslexicFont' checked={dyslexicFont} onChange={(e) => setDyslexicFont(e.target.checked)} />
                                        <label htmlFor="dyslexicFont" className='text-lg'>Enable Dyslexic Font</label>
                                    </div>
                                    <div className='flex flex-row gap-2'>
                                        <button type='button' className='bg-[#39EC2A] text-black font-semibold px-6 py-2 rounded-lg hover:bg-[#2dbb20] transition' onClick={saveAccessabilitySettings}>Save Settings</button>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === "createBooking" && (
                            <div className='bg-[hsl(207,81%,15%)] w-full h-full'>
                                <div className='w=full flex justify-center items-center'>
                                    <h1 className='text-2xl font-bold text-white mb-4'>Create a booking</h1>
                                </div>
                                <form onSubmit={createBooking} className='flex flex-col gap-4 max-w-md mx-auto bg-[hsl(207,81%,10%)] p-6'>
                                    <div className='flex flex-col gap-2'>
                                        <label htmlFor="addressInput" className='text-white text-lg'>Address</label>
                                        <input type="text" id="addressInput" value={address} onChange={(e) => setAddress(e.target.value)} className='outline-none border-2 border-slate-700 rounded-lg px-4 py-2 bg-[hsl(207,81%,20%)] text-white' placeholder='Enter the address' required />
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label htmlFor="bookingTypeInput" className='text-white text-lg'>Booking Type</label>
                                        <select required name="bookingTypeInput" id="bookingTypeInput" value={bookingType} onChange={(e) => setBookingType(e.target.value)} className='outline-none border-2 border-slate-700 rounded-lg px-4 py-2 bg-[hsl(207,81%,20%)] text-white'>
                                            <option value="" disabled>Select a booking type</option>
                                            <option value="Installation">Installation</option>
                                            <option value="Consultation">Consultation</option>
                                        </select>
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label htmlFor="bookingTime" className='text-white text-lg'>Booking Time</label>
                                        <input type="datetime-local" id='bookingTime' value={bookingTime} onChange={(e) => setBookingTime(e.target.value)} className='outline-none border-2 border-slate-700 rounded-lg px-4 py-2 bg-[hsl(207,81%,20%)] text-white' required />
                                    </div>
                                    <button type='submit' className='bg-[#39EC2A] text-black font-semibold px-6 py-2 rounded-lg hover:bg-[#2dbb20] transition'>Create Booking</button>
                                </form>
                            </div>
                        )}
                        {activeTab === "appointments" && (
                            <div className='bg-[hsl(207,81%,15%)] w-full h-full p-8'>
                                <div className='w-full flex justify-center items-center'>
                                    <h1 className='text-2xl font-bold text-white mb-4'>Your Appointments</h1>
                                </div>
                                {bookings.length > 0 ? (
                                    <table className="table-auto w-full bg-white">
                                        <thead>
                                            <tr className="bg-[#051C2F] text-white">
                                                <th className="px-4 py-2">Booked Date</th>
                                                <th className="px-4 py-2">Booking Date</th>
                                                <th className="px-4 py-2">Booking Time</th>
                                                <th className="px-4 py-2">Address</th>
                                                <th className="px-4 py-2">Booking Type</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {bookings.map((booking, index) => (
                                                <tr key={index} className="text-center text-white">
                                                    <td className="bg-[hsl(207,81%,20%)] px-4 py-2">{booking.BookedDate}</td>
                                                    <td className="bg-[hsl(207,81%,20%)] px-4 py-2">{booking.bookingDate}</td>
                                                    <td className="bg-[hsl(207,81%,20%)] px-4 py-2">{booking.bookingTime}</td>
                                                    <td className="bg-[hsl(207,81%,20%)] px-4 py-2">{booking.address}</td>
                                                    <td className="bg-[hsl(207,81%,20%)] px-4 py-2">{booking.bookingType}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p className="text-white">No appointments found.</p>
                                )}
                            </div>
                        )}
                        {activeTab === "support" && (
                            <div className='bg-[hsl(207,81%,15%)] w-full h-full flex items-center justify-center'>
                                <h1 className='text-4xl font-bold text-white'>Unfinished.</h1>
                            </div>
                        )}


                    </div>
                ) : (
                    <div className='flex flex-row w-full h-full justify-center items-center'>
                        <h1 className='text-4xl text-white font-bold'>Redirecting...</h1>
                    </div>
                )}
            </div>
        </div>
    )
}