'use client'

import React from 'react'
import Header from '../components/Header'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Image from 'next/image'
import Footer from '../components/Footer'

export default function Page() {

    const [boldFont, setBoldFont] = useState(false)
    const [largeText, setLargeText] = useState(false)
    const [dyslexicFont, setDyslexicFont] = useState(false)


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
        <div className={`w-full h-full overflow-x-hidden flex flex-col text-white ${boldFont ? "font-bold" : ""} ${largeText ? "text-lg" : ""} ${dyslexicFont ? "font-dyslexic" : ""}`}>
            <Header />
            <div className='w-full h-[50vh] bg-[#051C2F] flex items-center px-10'>
                <div className='flex flex-row w-full max-w-6xl mx-auto'>
                    <div className='w-1/2 flex justify-center items-center'>
                        <div style={{ backgroundImage: "url('/HomePageImage.jpg')" }} className='w-[40vh] h-[40vh] bg-cover bg-center rounded-xl' />
                    </div>
                    <div className='w-1/2 flex justify-center items-center flex-col gap-4'>
                        <h1 className='text-xl'>Solar Panel Installation</h1>
                        <p className='text-justify text-[#B2C4D1]'>Solar panels convert sunlight into electricity, helping reduce reliance on fossil fuels while lowering energy bills. At Rolsa Technologies, we handle the entire process, starting with a consultation and site assessment to determine the best panel placement for maximum efficiency. Once approved, our team takes care of design, permitting, and professional installation, ensuring seamless integration with your home’s electrical system. After installation, we thoroughly test the system before activation, and we also offer ongoing maintenance services to keep your solar panels operating at peak performance.</p>
                    </div>
                </div>
            </div>
            <div className='w-full h-[50vh] bg-[#051C2F] flex items-center px-10'>
                <div className='flex flex-row w-full max-w-6xl mx-auto'>
                    <div className='w-1/2 flex justify-center items-center flex-col gap-4'>
                        <h1 className='text-xl'>EV Charger Installation</h1>
                        <p className='text-justify text-[#B2C4D1]'>A home EV charging station allows you to power your electric vehicle conveniently and efficiently. Our process begins with a consultation where we assess your vehicle’s charging needs and your home’s electrical setup. We then plan the best location for installation and ensure proper wiring. Our certified electricians install the charger safely and in compliance with all regulations, followed by a full system test to ensure everything functions correctly. Before we leave, we’ll guide you through how to use and maintain your charging station for long-term reliability.</p>
                    </div>
                    <div className='w-1/2 flex justify-center items-center'>
                        <div style={{ backgroundImage: "url('/EVChargerInstallation.jpg')" }} className='w-[40vh] h-[40vh] bg-cover bg-center rounded-xl' />
                    </div>
                </div>
            </div>
            <div className='w-full h-[50vh] bg-[#051C2F] flex items-center px-10'>
                <div className='flex flex-row w-full max-w-6xl mx-auto'>
                    <div className='w-1/2 flex justify-center items-center'>
                        <div style={{ backgroundImage: "url('/SmartHomeEnergyManagement.jpg')" }} className='w-[40vh] h-[40vh] bg-cover bg-center rounded-xl' />
                    </div>
                    <div className='w-1/2 flex justify-center items-center flex-col gap-4'>
                        <h1 className='text-xl'>Smart Home ENergy Management Systems</h1>
                        <p className='text-justify text-[#B2C4D1]'>Smart home energy management systems give you control over your electricity usage, helping you optimize energy efficiency and reduce costs. Our team first conducts a home energy audit to understand your current usage and needs. We then install smart energy monitors, meters, and compatible devices that allow you to track consumption in real time. The system is configured to work with your solar panels, EV charger, and other smart appliances, giving you full control through an intuitive dashboard. Once installed, we provide a walkthrough to ensure you understand how to monitor and manage your energy effectively.</p>
                    </div>
                </div>
            </div>
            <div className='w-full h-[30vh] bg-[#051C2F] flex items-center px-10 flex-col'>
                <div className='flex flex-col items-center h-full w-full text-[#39EC2A] gap-6'>
                    <h1 className='text-2xl'>How to reduce your Carbon Footprint</h1>
                    <p className='text-[#B2C4D1] w-2/5'>Reducing your carbon footprint doesn’t have to be complicated—small changes can make a big impact! Start by cutting down on energy use at home: switch to LED bulbs, turn off appliances when not in use, and consider renewable energy sources. Opt for walking, cycling, or public transport instead of driving whenever possible. Reduce waste by recycling, composting, and choosing reusable products over single-use plastics. Eating more plant-based meals and supporting local, sustainable businesses can also lower your environmental impact. Every step counts—so why not start today?</p>
                </div>
            </div>
            <Footer />
        </div>
    )
}
