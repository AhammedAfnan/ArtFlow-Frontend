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
      {/* Main container */}
      <div className="flex flex-col sm:flex-row gap-6 md:gap-8 justify-center md:justify-between p-4">
        {/* Profile Card - Hidden on mobile, visible on tablet and above */}
        <div className="hidden sm:block sm:w-1/4 md:w-1/4 lg:w-1/5 xl:w-1/6 order-1 mb-4 md:mb-0 flex-shrink-0 md:mr-4 lg:mr-6">
          <ProfileCard user={user} />
        </div>

        {/* Post Card - Dynamic width on larger screens */}
        <div className="w-full sm:w-2/3 md:w-1/2 lg:w-3/5 xl:w-1/2 order-2 mb-4 md:mb-0 flex-grow">
          <PostCard />
        </div>

        {/* Contact Card - Hidden on mobile, visible on tablet and above */}
        <div className="hidden sm:block sm:w-1/4 md:w-1/4 lg:w-1/5 xl:w-1/6 order-3 flex-shrink-0 max-w-xs md:ml-4">
          <ContactCard />
        </div>
      </div>
    </>
  );
};

export default UserHome;
