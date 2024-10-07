import React from "react";
import { motion } from "framer-motion";
import { FaFacebook, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const ContactCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.012 }}
      className="bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-500 p-2 rounded-md shadow-md text-white fixed top-40 w-64 mx-auto" // Set width to w-64 (16rem) and center with mx-auto
    >
      {/* Heading */}
      <h2 className="text-md font-medium mb-2 text-center">Contact Us</h2>

      {/* Icons Row */}
      <div className="flex justify-between text-lg">
        {/* Email Icon */}
        <a
          href="mailto:afnanballoor44@gmail.com"
          className="hover:scale-110 transition-transform duration-200"
        >
          <span role="img" aria-label="Email" className="text-lg">&#128231;</span>
        </a>

        {/* Facebook Icon */}
        <a
          href="https://www.facebook.com/ahammedafnan.ani/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:scale-110 transition-transform duration-200"
        >
          <FaFacebook className="text-lg" />
        </a>
        
        {/* Instagram Icon */}
        <a
          href="https://www.instagram.com/a.ffn.n/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:scale-110 transition-transform duration-200"
        >
          <FaInstagram className="text-lg" />
        </a>
        
        {/* LinkedIn Icon */}
        <a
          href="https://www.linkedin.com/in/ahammed-afnan-208a88270/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:scale-110 transition-transform duration-200"
        >
          <FaLinkedinIn className="text-lg" />
        </a>
      </div>
    </motion.div>
  );
};

export default ContactCard;
