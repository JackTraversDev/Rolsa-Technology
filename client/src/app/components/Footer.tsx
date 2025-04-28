import React from 'react'

export default function Footer() {
    return (
        <div className="w-full h-[30vh] bg-[#051C2F] flex flex-col justify-center items-center">
            <div className="flex flex-row gap-10 justify-between items-start w-full max-w-6xl px-10 mx-auto">
                <div className="flex flex-col gap-5 w-1/3">
                    <div className="flex flex-col">
                        <h1 className="text-[#39EC2A] text-2xl">Rolsa Technology</h1>
                        <p className="text-[#B2C4D1]">Solar & Renewable Energy</p>
                    </div>
                    <div>
                        <p className="text-[#B2C4D1] w-70">At Rolsa Technology, we believe in the power of renewable energy to create a more sustainable future.</p>
                    </div>
                </div>

                <div className="flex flex-col gap-5 w-1/3">
                    <div className="flex flex-col">
                        <h1 className="text-[#FFFFFF] text-2xl">Services</h1>
                    </div>
                    <div>
                        <p className="text-[#B2C4D1]">Solar Panel Installation</p>
                        <p className="text-[#B2C4D1]">Smart Home Management System Installations</p>
                        <p className="text-[#B2C4D1]">EV Charger Installations</p>
                        <p className="text-[#B2C4D1]">Consultation</p>
                    </div>
                </div>

                <div className="flex flex-col gap-5 w-1/3">
                    <div className="flex flex-col">
                        <h1 className="text-[#FFFFFF] text-2xl">Contact Info</h1>
                    </div>
                    <div>
                        <p className="text-[#B2C4D1]">Address: 123-Rolsa Road</p>
                        <p className="text-[#B2C4D1]">Phone: +44 1234 567890</p>
                        <p className="text-[#B2C4D1]">Email: Rolsa@tech.com</p>
                    </div>
                </div>
            </div>
            <span className="w-2/3 bg-[#B2C4D1] h-0.5 mt-5" />
            <p className="mt-2">Copyright © 2025 Rolsa Technology</p>
        </div>
    )
}
