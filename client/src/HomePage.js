import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Ensure you install this package
import { Link } from "react-router-dom";
import objectDetectionImage from "./KartScan-logo-removebg-preview.png";
import textRecognitionImage from "./KartScan-logo-removebg-preview.png";
import freshnessDetectionImage from "./KartScan-logo-removebg-preview.png";
import Header from "./Header";
import Footer from "./Footer";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 via-black to-gray-900 flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow py-12 px-4 flex flex-col lg:flex-row items-center lg:items-start justify-between max-w-6xl mx-auto">
        
        {/* Text and Button Section */}
        <div className="flex-1 lg:max-w-lg lg:mr-12">
          <h1 className="text-white text-4xl md:text-6xl font-bold mb-8">
            Welcome to KartScan
          </h1>
          <p className="text-white text-xl md:text-2xl mb-8">
            KartScan helps you detect objects, recognize text from packaging, and assess the freshness of fruits and vegetables with ease. Explore the power of ML technology for smarter shopping experiences!
          </p>
          <Link
            to="/upload"
            className="inline-block bg-yellow-400 text-black font-semibold py-4 px-8 rounded-lg shadow-lg text-lg hover:bg-yellow-500 hover:scale-105 transform transition-all"
          >
            Try It Now!
          </Link>
        </div>

        {/* Carousel Section */}
        <div className="flex-1 w-full lg:w-2/3 max-w-4xl mt-12 lg:mt-0">
          <Carousel
            showThumbs={false}
            showStatus={false}
            autoPlay={true}
            infiniteLoop={true}
            interval={5000}
            className="rounded-lg overflow-hidden shadow-lg"
          >
            {/* Object Detection */}
            <div className="relative">
              <img src={objectDetectionImage} alt="Object Detection" />
              <div className="absolute inset-0 bg-black bg-opacity-70 flex justify-center items-center">
                <h2 className="text-yellow-400 text-2xl md:text-4xl font-bold text-center px-4">
                  Object Detection
                </h2>
              </div>
            </div>
            {/* Text Recognition */}
            <div className="relative">
              <img src={textRecognitionImage} alt="Text Recognition" />
              <div className="absolute inset-0 bg-black bg-opacity-70 flex justify-center items-center">
                <h2 className="text-yellow-400 text-2xl md:text-4xl font-bold text-center px-4">
                  Text Recognition from Packaging
                </h2>
              </div>
            </div>
            {/* Freshness Detection */}
            <div className="relative">
              <img src={freshnessDetectionImage} alt="Freshness Detection" />
              <div className="absolute inset-0 bg-black bg-opacity-70 flex justify-center items-center">
                <h2 className="text-yellow-400 text-2xl md:text-4xl font-bold text-center px-4">
                  Detect Freshness of Fruits and Vegetables
                </h2>
              </div>
            </div>
          </Carousel>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
