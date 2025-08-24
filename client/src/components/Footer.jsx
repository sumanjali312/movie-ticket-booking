import React from 'react';
import googlePlay from '../assets/googlePlay.svg'; // Make sure this path and name are correct
import appStore from '../assets/appStore.svg';     // Make sure this path and name are correct

const Footer = () => {
  return (
    <footer className="bg-black text-gray-400 py-10 px-6 md:px-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 border-b border-gray-700 pb-10 text-center md:text-left">
        {/* Left Section */}
        <div className="flex flex-col items-center md:items-start">
          <h2 className="text-white text-2xl font-semibold">
            <span className="text-red-500">Quick</span>Show
          </h2>
          <p className="mt-4 text-sm max-w-xs">
            Lorem Ipsum has been the industry’s standard dummy text ever since the 1500s.
          </p>
          <div className="flex gap-4 mt-6 justify-center md:justify-start">
            <img src={googlePlay} alt="Google Play" className="h-10" />
            <img src={appStore} alt="App Store" className="h-10" />
          </div>
        </div>

        {/* Middle Section */}
        <div className="flex flex-col items-center">
          <h3 className="text-white font-semibold mb-4">Company</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white">Home</a></li>
            <li><a href="#" className="hover:text-white">About us</a></li>
            <li><a href="#" className="hover:text-white">Contact us</a></li>
            <li><a href="#" className="hover:text-white">Privacy policy</a></li>
          </ul>
        </div>

        {/* Right Section */}
        <div className="flex flex-col items-center">
          <h3 className="text-white font-semibold mb-4">Get in touch</h3>
          <p className="text-sm mb-2">+1-212-456-7890</p>
          <p className="text-sm">contact@example.com</p>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-sm mt-6">
        © 2024 <span className="text-white font-medium">QuickShow</span>. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
