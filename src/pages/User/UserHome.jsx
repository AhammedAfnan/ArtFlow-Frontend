import React from "react";
import ProfileCard from "../../components/userComponents/ProfileCd";
import { useSelector } from "react-redux";
import PostCard from "../../components/PostCard";
import Navbar from "../../components/Navbar";
import ContactCard from "../../components/userComponents/ContactCard";

const UserHome = () => {
  const { user } = useSelector((state) => state.Auth);
  return (
    <>
      <Navbar />
      <div className="flex gap-4 flex-wrap">
        {" "}
        {/* Added flex-wrap and gap */}
        <div className="hidden md:block w-1/5 p-6">
          <ProfileCard user={user} />
        </div>
        <div className="w-full md:w-2/4">
          <div className="max-w-3xl mx-auto px-4">
            {" "}
            {/* Container with max-width and padding */}
            <PostCard />
          </div>
        </div>
        <div className="hidden md:block mt-6 -ml-10 ">
          <ContactCard />
        </div>
      </div>
    </>
  );
};

export default UserHome;
