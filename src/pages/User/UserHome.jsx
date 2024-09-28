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
    <div className="flex flex-wrap gap-4 justify-center md:justify-start">
      {/* Profile Card */}
      <div className="w-full md:w-1/5 p-4 md:p-6 order-2 md:order-1">
        <ProfileCard user={user} />
      </div>
      
      {/* Post Card */}
      <div className="w-full md:w-2/4 px-4 order-1 md:order-2">
        <div className="max-w-3xl mx-auto">
          <PostCard />
        </div>
      </div>
      
      {/* Contact Card */}
      <div className="w-full md:w-1/5 p-4 md:p-6 md:mt-0 order-3">
        <ContactCard />
      </div>
    </div>
  </>
);
};
export default UserHome;
