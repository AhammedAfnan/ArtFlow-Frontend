import React, { useEffect, useState } from "react";
import BannerCarousel from "../../components/BannerCourosel";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../redux/AlertSlice";
import { ArtistRequest } from "../../Helper/instance";
import { apiEndPoints } from "../../util/api";
import ArtistNavbar from "../../components/ArtistNav";

function ArtistAboutPage() {
  const [banners, setBanners] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    getArtistBanners();
  }, []);

 
  const getArtistBanners = async () => {
    dispatch(showLoading());
    ArtistRequest({
      url: apiEndPoints.getArtistBanners,
      method: "get",
    }).then((res) => {
      dispatch(hideLoading());
      if (res.data?.success) {
        setBanners(res.data?.banners);
      } else {
        toast.error(res.data?.error);
      }
    });
  };

  return (
    <>
      <ArtistNavbar />
      <BannerCarousel banners={banners} />
  
        {/* About Content */}
        <section className="bg-white py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Image */}
              <div className="md:order-2">
                <img
                  src="/images/userImages/art.jpg"
                  alt="About Us"
                  className="mx-auto w-full md:w-2/3 rounded-lg shadow-lg"
                />
              </div>
  
              {/* Text */}
              <div className="md:order-1">
                <h2 className="text-2xl md:text-3xl font-semibold mb-4">Why we?</h2>
                <p className="text-gray-700">
                  Robust Artist Network: Access a global network of top-tier artists.
                  Seamless Collaboration: Our platform ensures smooth communication
                  and artworks management. Verified Artists: Our subscription model
                  guarantees quality and commitment. Tailored Matches: Find artists
                  or artworks that align perfectly with your goals.
                </p>
                <h2 className="text-2xl md:text-3xl font-semibold mb-4 mt-6">Our Mission</h2>
                <p className="text-gray-700 mt-4">
                  At ArtFlow, we're on a mission to simplify artwork collaborations.
                  By providing artists with a subscription-based platform and
                  offering clients direct access to skilled artists, we're
                  revolutionizing the way websites are created.
                </p>
              </div>
            </div>
          </div>
        </section>
  
        {/* Team Section */}
        <section className="bg-gray-100 py-12">
          <div className="container mx-auto text-center px-4">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">Our Team</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {/* Team Member 1 */}
              <div className="bg-white rounded-lg p-4 shadow-md">
                <img
                  src="images/userImages/face17.jpg"
                  alt="Team Member 1"
                  className="w-24 h-24 md:w-32 md:h-32 mx-auto rounded-full"
                />
                <h3 className="text-lg md:text-xl font-semibold mt-2">John Doe</h3>
                <p className="text-gray-600">Co-founder</p>
              </div>
  
              {/* Team Member 2 */}
              <div className="bg-white rounded-lg p-4 shadow-md">
                <img
                  src="images/userImages/myoffice photo.jpg"
                  alt="Team Member 2"
                  className="w-24 h-24 md:w-32 md:h-32 mx-auto rounded-full"
                />
                <h3 className="text-lg md:text-xl font-semibold mt-2">Jane Smith</h3>
                <p className="text-gray-600">Designer</p>
              </div>
  
              {/* Team Member 3 */}
              <div className="bg-white rounded-lg p-4 shadow-md">
                <img
                  src="images/userImages/face21.jpg"
                  alt="Team Member 3"
                  className="w-24 h-24 md:w-32 md:h-32 mx-auto rounded-full"
                />
                <h3 className="text-lg md:text-xl font-semibold mt-2">David Johnson</h3>
                <p className="text-gray-600">Developer</p>
              </div>
  
              {/* Team Member 4 */}
              <div className="bg-white rounded-lg p-4 shadow-md">
                <img
                  src="images/userImages/face1.jpg"
                  alt="Team Member 4"
                  className="w-24 h-24 md:w-32 md:h-32 mx-auto rounded-full"
                />
                <h3 className="text-lg md:text-xl font-semibold mt-2">Emily Davis</h3>
                <p className="text-gray-600">Marketing</p>
              </div>
            </div>
          </div>
        </section>
  
        {/* Footer */}
        <footer className="bg-black dark:bg-gray-800">
          <div className="max-w-full p-4 py-6 lg:py-8">
            <div className="md:flex md:justify-between">
              <div className="mb-6 md:mb-0">
                <a href="https://flowbite.com/" className="flex items-center">
                  <img className="w-15 h-20" src="images/userImages/hub1.png" alt="ArtFlow Logo" />
                  <h1 className="self-center text-2xl font-semibold text-white">
                    ArtFlow
                  </h1>
                </a>
              </div>
              <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
                {/* Resources Section */}
                <div>
                  <h2 className="mb-6 text-sm font-semibold text-white uppercase">Resources</h2>
                  <ul className="text-yellow-500 font-medium">
                    <li className="mb-4"><a className="hover:underline">ArtFlow</a></li>
                    <li><a href="https://tailwindcss.com/" className="hover:underline">Tailwind CSS</a></li>
                  </ul>
                </div>
                {/* Follow Us Section */}
                <div>
                  <h2 className="mb-6 text-sm font-semibold text-white uppercase">Follow us</h2>
                  <ul className="text-yellow-500 font-medium">
                    <li className="mb-4"><a className="hover:underline">GitHub</a></li>
                    <li><a className="hover:underline">Discord</a></li>
                  </ul>
                </div>
                {/* Legal Section */}
                <div>
                  <h2 className="mb-6 text-sm font-semibold text-white uppercase">Legal</h2>
                  <ul className="text-yellow-500 font-medium">
                    <li className="mb-4"><a className="hover:underline">Privacy Policy</a></li>
                    <li><a className="hover:underline">Terms & Conditions</a></li>
                  </ul>
                </div>
              </div>
            </div>
            <hr className="my-6 border-gray-200 dark:border-gray-700 lg:my-8" />
            <div className="sm:flex sm:items-center sm:justify-between">
              <span className="text-sm text-yellow-500 sm:text-center">© 2023 ArtFlow™. All Rights Reserved.</span>
              <div className="flex mt-4 space-x-5 sm:justify-center sm:mt-0">
                {/* Social Media Icons */}
                <a href="#" className="text-yellow-500 hover:text-yellow-500 dark:hover:text-white">
                  {/* Facebook Icon */}
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 8 19">
                    <path d="M6.135 3H8V0H6.135A4.147 4.147 0 0 0 1.993 4.142V6H0v3h2v9.938h3V9h2.021l.592-3H5V3.591A.6.6 0 0 1 5.592 3h.543Z" />
                  </svg>
                  <span className="sr-only">Facebook</span>
                </a>
                <a href="#" className="text-yellow-500 hover:text-white">
                  {/* Discord Icon */}
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 21 16">
                    <path d="M16.942 1.556a16.3 16.3 0 0 0-4.126-1.3 12.04 12.04 0 0 0-.529 1.1 15.175 15.175 0 0 0-4.573 0 11.585 11.585 0 0 0-.535-1.1 16.274 16.274 0 0 0-4.129 1.3A17.392 17.392 0 0 0 .182 13.218a15.785 15.785 0 0 0 4.963 2.521c.41-.564.773-1.16 1.084-1.785a10.63 10.63 0 0 1-1.706-.83c.143-.106.283-.217.418-.334 3.313 1.528 6.91 1.528 10.18 0 .14.117.28.228.418.334-.543.314-1.114.597-1.706.83.311.625.674 1.22 1.084 1.785a15.791 15.791 0 0 0 4.963-2.521 17.37 17.37 0 0 0-3.876-11.662Zm-10.59 9.19c-.987 0-1.79-.892-1.79-1.991 0-1.098.793-1.99 1.79-1.99.996 0 1.803.9 1.79 1.99 0 1.1-.793 1.992-1.79 1.992Zm6.36 0c-.987 0-1.79-.892-1.79-1.991 0-1.098.793-1.99 1.79-1.99.997 0 1.803.9 1.79 1.99 0 1.1-.793 1.992-1.79 1.992Z" />
                  </svg>
                  <span className="sr-only">Discord</span>
                </a>
              </div>
            </div>
          </div>
        </footer>    
    </>
  );
}

export default ArtistAboutPage;
