import React from "react";
import Navbar from "../../components/Navbar";
import PostCard from "../../components/PostCard";
import ContactCard from "../../components/userComponents/ContactCard";
import ProfileCard from "../../components/userComponents/ProfileCd";
import { useSelector } from "react-redux";

function ExplorePage() {
  const { user } = useSelector((state) => state.Auth);
  return (
<>
  <Navbar />
  <div className="flex flex-wrap justify-center gap-4"> {/* Centers the contents and adds space between them */}
    {/* Profile Card Section */}
    <div className="hidden md:block md:w-1/3 lg:w-1/5 p-6"> 
      {/* Adjusted widths for md and lg */}
      <ProfileCard user={user} />
    </div>

    {/* Post Card Section */}
    <div className="w-full md:w-1/2 lg:w-2/5 md:ml-0 lg:ml-8"> 
      {/* Full width on mobile, half width on tablet, 2/5 on large screens */}
      <div className="max-w-3xl mx-auto px-4">
        <PostCard />
      </div>
    </div>

    {/* Contact Card Section */}
    <div className="hidden md:block md:w-1/3 lg:w-1/5 lg:ml-8 mt-6"> 
      {/* Adjusted widths and margin for better positioning */}
      <ContactCard />
    </div>
  </div>
</>

  );
}

export default ExplorePage;
