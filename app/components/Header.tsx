"use client";

import { useState } from "react"; // React hook for managing component state
import Image from "next/image"; // Next.js optimized Image component
import Link from "next/link"; // Next.js Link component for client-side navigation
import { FaGlobe, FaBars, FaTimes } from "react-icons/fa"; // FontAwesome icons for UI
import { usePathname } from "next/navigation"; // Next.js hook to get current pathname

export default function Header() {
  // Get current URL path to highlight active menu item
  const pathname = usePathname();

  // State to control mobile offcanvas menu visibility
  const [offcanvasOpen, setOffcanvasOpen] = useState(false);

  return (
    <>
      {/* Top banner with department name */}
      <div className="bg-[#004432] md:py-4 py-3">
        <p className="text-center text-white lg:text-xl md:text-base text-sm font-nato">
          Industries, Commerce, Investment & Skills Development Department
        </p>
      </div>

      {/* Main header section with background image */}
      <header>
        {/* Inner header image section */}
        <div
          className="w-full bg-cover bg-center bg-no-repeat lg:min-h-[15vh]"
          style={{ backgroundImage: "url('/header-image.png')" }}
        >
          {/* Container for logo, title, language selector and login button */}
          <div className="max-w-[1280px] mx-auto px-4 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-center justify-items-center gap-y-4 text-center">

            {/* Logo and title section */}
            <div className="flex flex-col items-center justify-center text-center lg:flex-row lg:items-center lg:justify-start lg:text-left space-x-0 lg:space-x-1">
              <Link href="/">
                <Image
                  src="/boiler-board-logo.png"
                  alt="Logo"
                  width={140}
                  height={75}
                />
              </Link>
              <div>
                <h2 className="font-bold font-poppins text-[1.1rem] sm:text-[1.3rem] whitespace-nowrap text-center sm:text-left">
                  BOARD OF <span className="text-[#004432] font-bold">EXAMINATION</span>
                </h2>
                <p className="font-poppins mt-1 text-black font-bold text-base text-center sm:text-left">
                  (FOR BOILER ENGINEERS)
                </p>
              </div>
            </div>

            {/* Language selector - visible only on large screens */}
            <div className="hidden lg:flex justify-center items-center space-x-2">
              <div className="bg-[#004432] rounded-full p-2 flex items-center justify-center">
                <FaGlobe className="text-white" size={20} />
              </div>
              <span className="text-[#004432] font-nato select-none text-sm sm:text-base font-medium">
                SELECT LANGUAGE
              </span>
              <select
                className="text-sm sm:text-base bg-[#d9d4ce] border border-black rounded-md px-0 py-0 cursor-pointer"
                defaultValue=""
              >
                <option value="" disabled hidden></option>
                <option value="en">English</option>
                <option value="ur">Urdu</option>
                <option value="es">Spanish</option>
              </select>
            </div>

            {/* Registration/Login button - visible only on large screens */}
            <div className="flex justify-center lg:justify-end">
              <a
                href="/user/register"
                className="hidden lg:inline-block bg-[#004432] text-white px-4 py-3 rounded-tl-lg rounded-br-lg hover:bg-[#03614d] font-medium whitespace-nowrap transition text-sm sm:text-base"
              >
                Registration / Login
              </a>
            </div>
          </div>
        </div>

        {/* Navigation bar */}
        <nav className="bg-black lg:bg-black relative z-50">
          <div className="max-w-[1280px] mx-auto px-4 flex items-center justify-between h-[60px]">

            {/* Desktop navigation menu (hidden on mobile) */}
            <ul className="hidden lg:flex space-x-4 h-full">
              {/* Each list item has a link, and highlights if current page */}
              <li className="h-full flex items-center">
                <Link
                  href="/"
                  className={`text-white h-full flex items-center px-6 font-medium font-open-sans transition ${
                    pathname === "/" ? "bg-[#004432]" : "hover:bg-[#004432]"
                  }`}
                >
                  Home
                </Link>
              </li>

              {/* Repeat similar links for other pages */}
              <li className="h-full flex items-center">
                <Link
                  href="/about-us"
                  className={`text-white h-full flex items-center px-6 font-medium font-open-sans transition ${
                    pathname === "/about-us" ? "bg-[#004432]" : "hover:bg-[#004432]"
                  }`}
                >
                  About Us
                </Link>
              </li>
              <li className="h-full flex items-center">
                <Link
                  href="/members-of-board"
                  className={`text-white h-full flex items-center px-6 font-medium font-open-sans transition ${
                    pathname === "/member-of-board" ? "bg-[#004432]" : "hover:bg-[#004432]"
                  }`}
                >
                  Members of Board
                </Link>
              </li>
              <li className="h-full flex items-center">
                <Link
                  href="/eligibility-criteria"
                  className={`text-white h-full flex items-center px-6 font-medium font-open-sans transition ${
                    pathname === "/eligibility-criteria" ? "bg-[#004432]" : "hover:bg-[#004432]"
                  }`}
                >
                  Eligibility Criteria
                </Link>
              </li>
              <li className="h-full flex items-center">
                <Link
                  href="/results"
                  className={`text-white h-full flex items-center px-6 font-medium font-open-sans transition ${
                    pathname === "/results" ? "bg-[#004432]" : "hover:bg-[#004432]"
                  }`}
                >
                  Results
                </Link>
              </li>
              <li className="h-full flex items-center">
                <Link
                  href="/related-laws"
                  className={`text-white h-full flex items-center px-6 font-medium font-open-sans transition ${
                    pathname === "/related-laws" ? "bg-[#004432]" : "hover:bg-[#004432]"
                  }`}
                >
                  Related Laws
                </Link>
              </li>
              <li className="h-full flex items-center">
                <Link
                  href="/gallery"
                  className={`text-white h-full flex items-center px-6 font-medium font-open-sans transition ${
                    pathname === "/gallery" ? "bg-[#004432]" : "hover:bg-[#004432]"
                  }`}
                >
                  Gallery
                </Link>
              </li>
              <li className="h-full flex items-center">
                <Link
                  href="/venue-datesheet"
                  className={`text-white h-full flex items-center px-6 font-medium font-open-sans transition ${
                    pathname === "/venue-datesheet" ? "bg-[#004432]" : "hover:bg-[#004432]"
                  }`}
                >
                  Venue / Datesheet
                </Link>
              </li>
            </ul>

            {/* Mobile menu button (hamburger icon) */}
            <button
              className="lg:hidden text-white text-2xl cursor-pointer"
              onClick={() => setOffcanvasOpen(true)} // Open offcanvas menu on click
              aria-label="Open menu"
            >
              <FaBars />
            </button>
          </div>

          {/* Mobile offcanvas side menu */}
          <div
            className={`fixed top-0 left-0 h-full w-64 bg-black z-[999] transform transition-transform duration-300 ease-in-out ${
              offcanvasOpen ? "translate-x-0" : "-translate-x-full" // Slide in/out based on state
            }`}
          >
            {/* Close button inside mobile menu */}
            <div className="flex justify-end p-4">
              <button
                className="text-white text-2xl cursor-pointer"
                onClick={() => setOffcanvasOpen(false)} // Close offcanvas on click
                aria-label="Close menu"
              >
                <FaTimes />
              </button>
            </div>

            {/* Mobile navigation links */}
            <ul className="flex flex-col space-y-4 px-6">
              {/* Each link closes the menu on click and highlights active page */}
              <li>
                <Link
                  href="/"
                  onClick={() => setOffcanvasOpen(false)}
                  className={`block text-white px-4 py-2 rounded-md font-medium font-open-sans transition ${
                    pathname === "/" ? "bg-[#004432]" : "hover:bg-[#004432]"
                  }`}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about-us"
                  onClick={() => setOffcanvasOpen(false)}
                  className={`block text-white px-4 py-2 rounded-md font-medium font-open-sans transition ${
                    pathname === "/about-us" ? "bg-[#004432]" : "hover:bg-[#004432]"
                  }`}
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/members-of-board"
                  onClick={() => setOffcanvasOpen(false)}
                  className={`block text-white px-4 py-2 rounded-md font-medium font-open-sans transition ${
                    pathname === "/member-of-board" ? "bg-[#004432]" : "hover:bg-[#004432]"
                  }`}
                >
                  Members of Board
                </Link>
              </li>
              <li>
                <Link
                  href="/eligibility-criteria"
                  onClick={() => setOffcanvasOpen(false)}
                  className={`block text-white px-4 py-2 rounded-md font-medium font-open-sans transition ${
                    pathname === "/eligibility-criteria" ? "bg-[#004432]" : "hover:bg-[#004432]"
                  }`}
                >
                  Eligibility Criteria
                </Link>
              </li>
              <li>
                <Link
                  href="/results"
                  onClick={() => setOffcanvasOpen(false)}
                  className={`block text-white px-4 py-2 rounded-md font-medium font-open-sans transition ${
                    pathname === "/results" ? "bg-[#004432]" : "hover:bg-[#004432]"
                  }`}
                >
                  Results
                </Link>
              </li>
              <li>
                <Link
                  href="/related-laws"
                  onClick={() => setOffcanvasOpen(false)}
                  className={`block text-white px-4 py-2 rounded-md font-medium font-open-sans transition ${
                    pathname === "/related-laws" ? "bg-[#004432]" : "hover:bg-[#004432]"
                  }`}
                >
                  Related Laws
                </Link>
              </li>
              <li>
                <Link
                  href="/gallery"
                  onClick={() => setOffcanvasOpen(false)}
                  className={`block text-white px-4 py-2 rounded-md font-medium font-open-sans transition ${
                    pathname === "/gallery" ? "bg-[#004432]" : "hover:bg-[#004432]"
                  }`}
                >
                  Gallery
                </Link>
              </li>
              <li>
                <Link
                  href="/venue-datesheet"
                  onClick={() => setOffcanvasOpen(false)}
                  className={`block text-white px-4 py-2 rounded-md font-medium font-open-sans transition ${
                    pathname === "/venue-datesheet" ? "bg-[#004432]" : "hover:bg-[#004432]"
                  }`}
                >
                  Venue / Datesheet
                </Link>
              </li>

              {/* Mobile Registration/Login button */}
              <li>
                <a
                  href="/login"
                  className="block bg-[#004432] text-white px-4 py-3 rounded-tl-lg rounded-br-lg hover:bg-[#03614d] font-medium whitespace-nowrap text-center transition"
                >
                  Registration / Login
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </header>
    </>
  );
}
