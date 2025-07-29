"use client";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const faqs = [
    {
      question: "What are the 3 classes of boiler engineers?",
      answer: "Details about the 3 classes of boiler engineers.",
    },
    {
      question:
        "What education and experience is required to apply for 3rd class boiler engineer competency certificate?",
      answer:
        "You must have completed basic engineering training and hands-on experience.",
    },
    {
      question:
        "What education and experience is required to apply for 2nd class boiler engineer competency certificate?",
      answer:
        "Requires experience as a 3rd class engineer and additional technical qualifications.",
    },
    {
      question:
        "What education and experience is required to apply for 1st class boiler engineer competency certificate?",
      answer:
        "You need extensive experience and must pass written and oral exams.",
    },
    {
      question:
        "Is experience/service certificate compulsory to apply for all classes of boiler engineering examination?",
      answer: "Yes, service certificates are mandatory to verify your experience.",
    },
  ];

  const [openStates, setOpenStates] = useState<boolean[]>(
    Array(faqs.length).fill(false)
  );

  const toggleOpen = (index: number) => {
    setOpenStates((prev) =>
      prev.map((isOpen, i) => (i === index ? !isOpen : isOpen))
    );
  };

  return (
    <>
    {/* Header Section */}
      <Header />
        {/* Intro Banner Section */}
      <section
        style={{ backgroundImage: "url('/banner-1.png')" }}
        className="bg-cover bg-center min-h-80 w-full"
      >
      </section>
      {/* Intro Banner Section */}
      {/* About Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              name: "Asif Ali Farrukh",
              title: "Director General BEBP",
              image: "/asif-ali-farrukh.png",
            },
            {
              name: "Muhammad Nawaz Cheema",
              title: "Chief Inspector BEBP",
              image: "/muhammad-nawaz-cheema-img.png",
            },
          ].map((person, idx) => (
            <div key={idx} className="bg-white shadow-lg rounded-xl overflow-hidden">
              <Image
                src={person.image}
                alt={person.name}
                width={600}
                height={400}
                className="object-cover w-full h-auto"
                quality={100}
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#004432] font-nato">
                  {person.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2 font-bold">{person.title}</p>
                <p className="text-gray-700 text-sm">
                  Board of Examination (For Boiler Engineers) has been successfully taking
                  examination of boiler engineers since 1926. It is a very joyous and
                  delightful occasion to launch official website of the Board...
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Icons Section */}
      <section className="bg-gray-100 py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center lg:justify-between gap-6 text-center max-w-screen-xl mx-auto">
            {[
              { icon: "/download-icon.png", label: "Downloads" },
              { icon: "/fee-structure-icon.png", label: "Fee Structure" },
              { icon: "/syllabus-icon.png", label: "Syllabus" },
              { icon: "/past-paper-icon.png", label: "Past Papers" },
              { icon: "/gallery-icon.png", label: "Photo Gallery" },
              { icon: "/roll-no-icon.png", label: "Roll Number" },
            ].map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center w-28 sm:w-32 transform transition duration-300 hover:scale-105 hover:-translate-y-1"
              >
                <div className="bg-[#004432] w-16 h-16 sm:w-20 sm:h-20 p-3 rounded-tl-2xl rounded-br-2xl flex items-center justify-center">
                  <Image
                    src={item.icon}
                    alt={item.label}
                    width={32}
                    height={32}
                    className="object-contain sm:w-10 sm:h-10 cursor-pointer"
                  />
                </div>
                <p className="mt-2 text-sm font-medium text-gray-800">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Updates Section */}
      <section className="bg-white py-10 px-4 md:px-20">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              image: "/info-img-1.png",
              title: "Datesheet section May 2025 announced",
              desc: "Boiler engineering examination has been announced on the website.",
            },
            {
              image: "/info-img-2.png",
              title: "Roll number slips are available now (class 3rd)",
              desc: "Boiler engineering examination has been uploaded on the website.",
            },
            {
              image: "/info-img-3.png",
              title: "Result for class 2nd are announced (April)",
              desc: "Date-sheet of examination session March/April 2025 is available on the website.",
            },
          ].map((item, index) => (
            <div key={index} className="flex flex-col items-center md:items-start space-y-3">
              <Image
                src={item.image}
                alt={item.title}
                width={208}
                height={224}
                className="object-contain rounded-md bg-gray-100 self-start mx-auto md:self-start md:mx-0"
              />
              <h3 className="text-base sm:text-lg md:text-xl font-semibold text-center md:text-left">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 text-center md:text-left">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs Section */}
      <section className="bg-[#004432] py-16 px-4">
        <h2 className="text-center text-2xl md:text-3xl font-bold mb-8 text-white">
          FREQUENTLY ASKED QUESTIONS
        </h2>
        <div className="max-w-5xl mx-auto bg-white rounded-tr-2xl rounded-bl-2xl p-6 shadow-xl text-black space-y-4 text-sm sm:text-base">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b">
              <button
                onClick={() => toggleOpen(index)}
                className="w-full flex justify-between items-center py-3 text-left"
              >
                <div className="flex items-start gap-3">
                  <span className="bg-[#004733] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold">
                    {index + 1}
                  </span>
                  <span>{faq.question}</span>
                </div>
                <span className="text-[#004432] text-2xl md:text-3xl font-bold cursor-pointer">
                  {openStates[index] ? "−" : "+"}
                </span>
              </button>
              {openStates[index] && (
                <p className="pl-9 pb-3 text-gray-700 text-sm">{faq.answer}</p>
              )}
            </div>
          ))}

          {/* <div className="flex justify-end pt-4">
            <button className="cursor-pointer bg-[#004733] text-white text-sm md:text-base px-4 py-2 rounded-md hover:bg-[#035c40] transition">
              VIEW MORE
            </button>
          </div> */}
        </div>
      </section>

      <Footer />
    </>
  );
}
