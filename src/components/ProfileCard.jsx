import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { apiEndPoints } from "../util/api";
import { userRequest } from "../Helper/instance";
import { hideLoading, showLoading } from "../redux/AlertSlice";
import { updateUser } from "../redux/AuthSlice";
import Modal from "react-modal";
import { updateArtist } from "../redux/ArtistAuthSlice";
import toast from "react-hot-toast";
import { IoArrowBackCircle } from "react-icons/io5";
import FollowersModal from "./FollowersModal";
// import RatingModal from "./RatingModal";
// import StarRating from "./StarRating";
import BASE_URL from "../config/api";

function ProfileCard({ Artist }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.Auth);
  const [artist, setArtist] = useState(Artist);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  // const averageRating = artist.ratings?.reduce((acc,rating)=>acc + rating?.rating,0)/artist?.ratings?.length || 0

  const openModal = () => {
    setIsModalOpen(true);
  };
  // const openRatingModal = () => {
  //   setIsRatingModalOpen(true);
  // };
  // const closeRatingModal = () => {
  //   setIsRatingModalOpen(false);
  // };

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

  const handleFollow = async (artistId) => {
    dispatch(showLoading());
    userRequest({
      url: apiEndPoints.followArtist,
      method: "post",
      data: { artistId },
    })
      .then((res) => {
        dispatch(hideLoading());
        if (res.data?.success) {
          dispatch(updateUser(res.data.updatedUser));
          dispatch(updateArtist(res.data.updatedArtist));
          setArtist(res.data.updatedArtist);
          return;
        }
        return toast.error(res.data.error);
      })
      .catch((err) => {
        dispatch(hideLoading());
        console.log(err.message);
        toast.error("Something went wrong");
      });
  };
  const handleUnFollow = async (artistId) => {
    dispatch(showLoading());
    userRequest({
      url: apiEndPoints.unFollowArtist,
      method: "post",
      data: { artistId },
    })
      .then((res) => {
        dispatch(hideLoading());
        if (res.data?.success) {
          dispatch(updateUser(res.data.updatedUser));
          dispatch(updateArtist(res.data.updatedArtist));
          setArtist(res.data.updatedArtist);
          return;
        }
        return toast.error(res.data.error);
      })
      .catch((err) => {
        dispatch(hideLoading());
        console.log(err.message);
        toast.error("Something went wrong");
      });
  };

  return (
    <>
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="relative max-w-md mx-auto md:max-w-2xl min-w-0 break-words w-full mb-6 shadow-lg rounded-xl mt-8 md:mt-20 bg-gray-100 p-4 md:p-6">
        {/* Back Button */}
        <IoArrowBackCircle
          size={30}
          fill="gray"
          onClick={() => window.history.back()}
          className="absolute top-4 left-4 cursor-pointer"
        />

        <div className="px-4 md:px-6">
          {/* Profile Image */}
          <div className="flex flex-wrap justify-center">
            <div className="w-full flex justify-center">
              <div className="relative">
                <img
                  src={`${BASE_URL}/artistProfile/${artist?.profile}`}
                  className="shadow-xl rounded-full align-middle absolute -m-16 md:-ml-20 lg:-ml-16 max-w-[100px] md:max-w-[150px] border-2 border-[#0d0a17]"
                  alt=""
                />
              </div>
            </div>
            {/* Posts and Followers */}
            <div className="w-full text-center mt-16 md:mt-20">
              <div className="flex justify-center lg:pt-4 pt-6 pb-0 space-x-4 md:space-x-8">
                <div className="p-2 text-center">
                  <span className="text-xl font-bold block uppercase tracking-wide text-slate-500">
                    {artist?.posts?.length}
                  </span>
                  <span className="text-sm text-slate-500">Posts</span>
                </div>

                <div
                  className="p-2 text-center cursor-pointer"
                  onClick={openModal}
                >
                  <span className="text-xl font-bold block uppercase tracking-wide text-slate-500 ">
                    {artist?.followers?.length}
                  </span>
                  <span className="text-sm text-slate-500">Followers</span>
                </div>
              </div>
            </div>
          </div>

          {/* Artist Name and Field */}
          <div className="text-center mt-10">
            <h3 className="uppercase text-xl md:text-2xl text-slate-500 font-bold leading-normal mb-1">
              {artist?.name}
            </h3>
            <div className="text-xs md:text-sm mt-0 mb-2 text-slate-400 font-bold uppercase">
              {artist?.field} Artist
            </div>
          </div>

          {/* Artist Details */}
          <div className="mt-4 md:mt-6 py-4 md:py-6 border-t border-slate-500 text-center">
            <div className="flex flex-wrap justify-center">
              <div className="w-full px-4">
                <p className="font-medium leading-relaxed text-slate-500 mb-4 text-xs md:text-sm lg:text-base">
                  INTEREST:{" "}
                  {artist.interest ? `${artist.interest} images` : "Not Given"},
                  QUALIFICATION:{" "}
                  {artist.educationalQualifications
                    ? `${artist.educationalQualifications}`
                    : "Not Given"}
                  , WORKS DONE(count):{" "}
                  {artist.worksDone ? `${artist.worksDone} works` : "Not Given"}
                  , EXPERIENCE(years/month):{" "}
                  {artist.YearOfExperience
                    ? `${artist.YearOfExperience}`
                    : "Not Given"}
                  , COMMUNICATION LANGUAGE: {artist.communicationLangauge},
                  EMAIL: {artist.email}, MOBILE NO: {artist.mobile}
                </p>

                {/* Follow/Unfollow Button */}
                <a
                  href="javascript:;"
                  className="font-normal text-slate-700 hover:text-slate-400"
                >
                  {artist?.followers?.includes(user._id) ? (
                    <button
                      className="w-24 h-9 text-white bg-gray-600 rounded hover:bg-gray-700"
                      onClick={() => handleUnFollow(artist._id)}
                    >
                      Following
                    </button>
                  ) : (
                    <button
                      className="w-24 h-9 text-white bg-gray-800 rounded hover:bg-gray-950"
                      onClick={() => handleFollow(artist._id)}
                    >
                      Follow
                    </button>
                  )}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Followers Modal */}
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          ariaHideApp={false}
          style={customStyles}
        >
          <FollowersModal
            isOpen={isModalOpen}
            closeModal={closeModal}
            artistId={artist._id}
          />
        </Modal>
      </div>
      </div>
    </>
  );
}

export default ProfileCard;
