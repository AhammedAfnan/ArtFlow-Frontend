import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutArtist } from "../../redux/ArtistAuthSlice";
import Modal from "react-modal";
import { motion } from "framer-motion";
// import StarRating from "../../components/StarRating";
import FollowersModal from "../../components/FollowersModal";
import ArtistNavbar from "../../components/ArtistNav";
import { useNavigate } from "react-router-dom";
import { ServerVariables } from "../../util/ServerVariables";
// import RatedUsersModal from "../../components/RatedUsersModal";
import BASE_URL from "../../config/api";

const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function ArtistHome() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { artist } = useSelector((state) => state.ArtistAuth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  // const averageRating =
  //   artist.ratings?.reduce((acc, rating) => acc + rating?.rating, 0) /
  //     artist?.ratings?.length || 0;

  // const openRatingModal = () => {
  //   setIsRatingModalOpen(true);
  // };
  // const closeRatingModal = () => {
  //   setIsRatingModalOpen(false);
  // };
  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const customStyles = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.0)",
    },
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "30%",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };
  const handleLogout = async () => {
    dispatch(logoutArtist());
  };

  return (
    <>
      <ArtistNavbar />

      <div className="flex justify-center items-center min-h-screen">
  <div className="text-center">
    <h1 className="text-center font-semibold text-slate-500 mt-5 text-2xl sm:text-3xl">
      My Profile
    </h1>
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-2xl mx-auto min-w-0 break-words w-full mb-6 shadow-lg rounded-xl mt-10 sm:mt-20 bg-gray-100"
    >
      <div className="px-4 sm:px-6">
        <div className="flex flex-wrap justify-center">
          <div className="w-full flex justify-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <img
                src={`https://artflow.onrender.com/artistProfile/${artist?.profile}`}
                className="shadow-xl rounded-full align-middle absolute -m-12 sm:-m-16 -ml-16 lg:-ml-16 max-w-[100px] sm:max-w-[150px] border-2 border-[#0d0a17]"
                alt=""
              />
            </motion.div>
          </div>
          <div className="w-full text-center mt-16 sm:mt-20">
            <div className="flex justify-center lg:pt-4 pt-8 pb-0">
              <div
                className="p-2 sm:p-3 text-center cursor-pointer"
                onClick={() => navigate(ServerVariables.artistPosts)}
              >
                <span className="text-lg sm:text-xl font-bold block uppercase tracking-wide text-slate-500">
                  {artist?.posts?.length}
                </span>
                <span className="text-xs sm:text-sm text-slate-500">Posts</span>
              </div>

              <div
                className="p-2 sm:p-3 text-center cursor-pointer"
                onClick={openModal}
              >
                <span className="text-lg sm:text-xl font-bold block uppercase tracking-wide text-slate-500">
                  {artist?.followers?.length}
                </span>
                <span className="text-xs sm:text-sm text-slate-500">Followers</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-2">
          <h3 className="uppercase text-xl sm:text-2xl text-slate-500 font-bold leading-normal mb-1">
            {artist?.name}
          </h3>
          <div className="text-xs sm:text-sm mt-0 mb-2 text-slate-400 font-bold uppercase">
            {artist?.field} Artist
          </div>
        </div>

        <div className="mt-4 sm:mt-6 py-4 sm:py-6 border-t border-slate-500 text-center">
          <div className="flex flex-wrap justify-center">
            <div className="w-full px-2 sm:px-4">
              <p className="text-sm sm:text-base font-medium leading-relaxed text-slate-500 mb-4">
                INTEREST: {artist.interest ? `${artist.interest} images` : "Not Given"}, 
                QUALIFICATION: {artist.educationalQualifications ? `${artist.educationalQualifications}` : "Not Given"},
                WORKS DONE(count): {artist.worksDone ? `${artist.worksDone} works` : "Not Given"}, 
                EXPERIENCE(years/month): {artist.YearOfExperience ? `${artist.YearOfExperience}` : "Not Given"}, 
                COMMUNICATION LANGUAGE: {artist.communicationLangauge}, 
                EMAIL: {artist.email}, 
                MOBILE NO: {artist.mobile}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  </div>
</div>
    </>
  );
}

export default ArtistHome;
