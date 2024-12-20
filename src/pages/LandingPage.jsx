import React from "react";
import MyButton from "../components/MyButton";
import { ServerVariables } from "../util/ServerVariables";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="font-sans flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="hero-section bg-black text-white text-center py-20 md:py-32 w-full flex-grow flex items-center justify-center">
        <div className="max-w-md mx-auto text-center"> {/* Existing container */}
          <div className="max-w-sm mx-auto"> {/* New outer container for centering */}
            <img
              src="/images/userImages/hub1.png"
              alt="Logo"
              className="h-32 w-32 mx-auto mb-4 md:h-48 md:w-48"
            />
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Welcome to ArtFlow</h1>
            <p className="text-base md:text-lg mb-4">
              Whether art is your passion or profession, you've come to the right place.
            </p>
            <p className="text-base md:text-lg mb-8">WHO ARE YOU?</p>
            {/* Buttons positioned directly under "WHO ARE YOU?" */}
            <div className="flex justify-center space-x-4"> {/* Center buttons with spacing */}
              <MyButton text="USER" onClick={() => navigate(ServerVariables.Login)} />
              <MyButton text="ARTIST" onClick={() => navigate(ServerVariables.ArtistLogin)} />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Content */}
      <section className="featured-content text-center py-10 md:py-16">
        <div className="max-w-screen-lg mx-auto px-4 overflow-hidden"> {/* Container for centering */}
          <h2 className="text-xl md:text-2xl font-bold mb-8">Featured Artworks</h2>
          <div className="flex flex-col md:flex-row justify-center items-center md:space-x-8 space-y-8 md:space-y-0">
            <div className="flex-none max-w-xs w-full"> {/* Ensures full width on mobile */}
              <img
                src="/images/userImages/img7.jpg"
                alt="Artwork 1"
                className="w-full h-auto rounded-lg" // Maintain original aspect ratio
              />
              <p className="mt-2">By AHAMMED AFNAN</p>
            </div>
            <div className="flex-none max-w-xs w-full"> {/* Ensures full width on mobile */}
              <img
                src="/images/userImages/img11.jpg"
                alt="Artwork 2"
                className="w-full h-auto rounded-lg" // Maintain original aspect ratio
              />
              <p className="mt-2">By BILAL MOHAMED</p>
            </div>
            {/* Add more featured artworks as needed */}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center p-4 bg-gray-800 text-white w-full">
        <p>&copy; 2023 ArtFlow. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
