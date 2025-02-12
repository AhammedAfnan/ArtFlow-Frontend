import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import EditIcon from "../../components/icons/EditIcon";
import Navbar from "../../components/Navbar";
import Modal from "react-modal";
import { ServerVariables } from "../../util/ServerVariables";
import { useNavigate } from "react-router-dom";
import FollowingsModal from "../../components/Followings";
import { motion } from "framer-motion";
import BASE_URL from "../../config/api";

function UserProfile() {
  const { user } = useSelector((state) => state.Auth);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const handleBackButton = () => {
      if (isModalOpen) {
        closeModal();
      }
    };

    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [isModalOpen]);

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

  return (
    <>
      <Navbar />
      {/* Responsive container without any border or background color */}
      <div className="container mx-auto px-4 flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg p-6"
        >
          <div className="card bg-gray-200 text-gray-800 w-full">
            <img
              className="w-36 mx-auto rounded-full -mt-16 border-4 border-gray-800"
              src={user.profile}
              alt=""
            />
            <div className="uppercase text-center mt-4 text-3xl font-medium">
              {user.name}
            </div>
            <div className="uppercase text-center mt-2 font-semibold text-sm">
              <h2>Email: {user?.email}</h2>
            </div>
            <div className="uppercase text-center mt-2 font-semibold text-sm">
              <h2>Mobile: {user?.mobile}</h2>
            </div>

            <hr className="mt-8" />
            <div className="flex p-4 justify-center" onClick={openModal}>
              <p className="font-bold text-center cursor-pointer">
                {user?.followings?.length} Following
              </p>
            </div>
            <div className="flex justify-center">
              <p
                className="font-bold text-center cursor-pointer"
                onClick={() => navigate(ServerVariables.editUserProfile)}
              >
                <EditIcon />
              </p>
            </div>
            <Modal
              isOpen={isModalOpen}
              onRequestClose={closeModal}
              ariaHideApp={false}
              style={customStyles}
            >
              <FollowingsModal isOpen={isModalOpen} closeModal={closeModal} />
            </Modal>
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default UserProfile;
