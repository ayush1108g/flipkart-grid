import React from "react";
import Header from "./Header";
import Footer from "./Footer";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 via-black to-gray-900 flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow flex flex-col justify-center items-center py-12 px-4">
        <div className="bg-gray-800 p-6 md:p-8 rounded-lg shadow-lg w-full max-w-lg border border-gray-700">
          <h2 className="text-yellow-400 text-3xl font-bold text-center mb-4">
            Contact Us
          </h2>
          <h3 className="text-yellow-300 text-xl font-semibold text-center mb-2">
            Team – CODE CRAFTERS
          </h3>
          <div className="text-gray-300 text-lg mb-4">
            <p className="mb-1">Members:</p>
            <ul className="list-disc list-inside">
              <li>Ayush Gupta</li>
              <li>Mohd. Ishan</li>
              <li>Rachit Jain</li>
            </ul>
          </div>
          <h3 className="text-yellow-300 text-xl font-semibold text-center mb-2">
            College
          </h3>
          <p className="text-gray-300 text-lg text-center">
            Indian Institute of Technology (IIT), Bhubaneswar
          </p>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ContactPage;
