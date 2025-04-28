'use client'

import Header from "./components/Header";
import { FaArrowRight } from "react-icons/fa";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import Footer from "./components/Footer";
import { useRouter } from 'next/navigation'


export default function Home() {

  const [boldFont, setBoldFont] = useState(false)
  const [largeText, setLargeText] = useState(false)
  const [dyslexicFont, setDyslexicFont] = useState(false)

  const router = useRouter()

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

  function redirectServices() {
    try {
      router.push("/services")
    } catch (error) {
      console.error("error")
      alert("Error routing to services page.")
    }
  }

  return (
    <div className={`w-full h-full overflow-x-hidden flex flex-col text-white ${boldFont ? "font-bold" : ""} ${largeText ? "text-lg" : ""} ${dyslexicFont ? "font-dyslexic" : ""}`}>
      <Header />
      <div className="bg-black w-full h-[70vh] bg-cover bg-center flex justify-center items-center" style={{ backgroundImage: "url('/HomePageImage.jpg')" }}>
        <div className="h-full w-full flex justify-center items-center" style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}>
          <div className="flex flex-col justify-around items-center h-full">
            <div className="flex justify-center items-center flex-col text-white text-4xl font-bold">
              <h1>Powering a Sustainable Future,</h1>
              <h1>One Panel at a Time.</h1>
            </div>
            <div className="flex flex-row items-center justify-around text-white w-3/4">
              <div className="flex flex-col gap-5 w-1/2">
                <h2 className="text-2xl">
                  Power Your Future with Sustainable Energy
                </h2>
                <p>
                  At Rolsa Technologies, we make it easy to transition to green
                  energy. From solar panel installation to EV charging solutions
                  and smart home energy management, we help you reduce your
                  carbon footprint and take control of your energy usage.
                </p>
              </div>
              <div>
                <button type="button" className="p-4 flex text-xl flex-row justify-center items-center bg-[#39EC2A] text-[#051C2F] rounded-2xl hover:bg-[hsl(115,84%,45%)] hover:cursor-pointer transition gap-2" onClick={() => router.push("/services")}>Explore More <FaArrowRight /></button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#051C2F] w-full h-[90vh] flex flex-col justify-around items-center">
        <div className="flex flex-col gap-2 justify-center items-center">
          <h1 className="text-4xl font-bold">Comprehensive Renewable Energy Solution</h1>
          <p className="w-2/3 text-center text-[#CAD9E8]">We offer a range of services to help you take advantage of renewable energy and reduce your carbon footprint.</p>
        </div>
        <div className="flex flex-row gap-10">


          <div className="w-[20rem] h-96">
            <div className="bg-white w-full h-2/4 rounded-2xl mb-4 bg-cover bg-center" style={{ backgroundImage: "url('/EVChargerInstallation.jpg')" }} />
            <div className="flex flex-col gap-4">
              <h1 className="text-2xl">EV Charger Installation</h1>
              <p>Our skilled technicians will install high-quality EV chargers at your home or business, providing fast, reliable, and convenient charging for your electric vehicle</p>
              <div className="flex flex-row items-center gap-7 w-full">
                <Link href="/services" className="text-[#39EC2A]">Learn More</Link>
                <button onClick={redirectServices} type="button" className="bg-[hsl(207,27%,25%)] hover:bg-[hsl(207,27%,20%)] transition hover:cursor-pointer p-2 text-[#39EC2A]"><FaArrowRight /></button>
              </div>
            </div>
          </div>

          <div className="w-[20rem] h-96">
            <div className="bg-white w-full h-2/4 rounded-2xl mb-4 bg-cover bg-center" style={{ backgroundImage: "url('/SolarPanelInstallation.jpg')" }}></div>
            <div className="flex flex-col gap-4">
              <h1 className="text-2xl">Solar Panel Installations</h1>
              <p>Our team of experienced technicians will install high-quality solar panels on your property to provide clean, renewable energy.</p>
              <span />
              <div className="flex flex-row items-end gap-7 w-full">
                <Link href="/services" className="text-[#39EC2A]">Learn More</Link>
                <button onClick={redirectServices} type="button" className="bg-[hsl(207,27%,25%)] hover:bg-[hsl(207,27%,20%)] hover:cursor-pointer transition p-2 text-[#39EC2A]"><FaArrowRight /></button>
              </div>
            </div>
          </div>

          <div className="w-[20rem] h-96">
            <div className="bg-white w-full h-2/4 rounded-2xl mb-4 bg-cover bg-center" style={{ backgroundImage: "url('/SmartHomeEnergyManagement.jpg')" }}></div>
            <div className="flex flex-col gap-4">
              <h1 className="text-2xl">Smart Home Energy Solutions</h1>
              <p>Our experts install a cutting-edge smart energy system to optimize efficiency, cut costs, and reduce your carbon footprint.</p>
              <span />
              <div className="flex flex-row items-center gap-7 w-full">
                <Link href="/services" className="text-[#39EC2A]">Learn More</Link>
                <button onClick={redirectServices} type="button" className="bg-[hsl(207,27%,25%)] hover:bg-[hsl(207,27%,20%)] transition p-2 hover:cursor-pointer text-[#39EC2A]"><FaArrowRight /></button>
              </div>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
