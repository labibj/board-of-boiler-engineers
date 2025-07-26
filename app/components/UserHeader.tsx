"use client";

import Image from "next/image"; // Next.js optimized Image component
import Link from "next/link"; // Next.js Link component for client-side navigation

export default function UserHeader() {
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
          {/* Container for logo, title and login button */}
          <div className="max-w-[1280px] mx-auto px-4 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 items-center justify-items-center gap-y-4 text-center">

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

            {/* Registration/Login button - now visible on all screens */}
            <div className="flex gap-5 justify-center lg:justify-end">
              <a
                href="/user/register"
                className="inline-block bg-[#004432] text-white px-4 py-2 sm:py-3 rounded-tl-lg rounded-br-lg hover:bg-[#03614d] font-medium whitespace-nowrap transition text-xs sm:text-sm md:text-base"
              >
                Registration
              </a>
              <a
                href="/user/login"
                className="inline-block bg-[#004432] text-white px-4 py-2 sm:py-3 rounded-tl-lg rounded-br-lg hover:bg-[#03614d] font-medium whitespace-nowrap transition text-xs sm:text-sm md:text-base"
              >
                Login
              </a>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
