import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { userRequest } from "../../Helper/instance";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import { CheckCircleIcon, VideoCameraIcon } from "@heroicons/react/24/outline";
import { hideLoading, showLoading } from "../../redux/AlertSlice";
import { apiEndPoints } from "../../util/api";
import { formatDistanceToNow } from "date-fns";

const ChatWithArtist = () => {
  const [artists, setArtists] = useState([]);
  const navigate = useNavigate();
  const [chatHistory, setChatHistory] = useState([]);   
  const [newMessage, setNewMessage] = useState("");
  const [filterData, setFilterData] = useState([]);
  const [chatPartner, setChatPartner] = useState(null);
  const [selectedArtistId, setSelectedArtistId] = useState(null);
  const [showChat, setShowChat] = useState(false); // For toggling views on mobile/tablets
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    getAllArtistsYouFollow();
  }, []);

  const getAllArtistsYouFollow = async () => {
    dispatch(showLoading());
    try {
      const res = await userRequest({
        url: apiEndPoints.getArtistsFollowed,
        method: "get",
      });
      dispatch(hideLoading());
      if (res.data.success) {
        setArtists(res.data.artists);
        setFilterData(res.data.artists);
      } else {
        toast.error(res.data.error);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Failed to load artists.");
    }
  };

  const fetchChatMessages = async (artistId) => {
    dispatch(showLoading());
    try {
      const response = await userRequest({
        url: apiEndPoints.getChatMessages,
        method: "post",
        data: { artistId },
      });
      dispatch(hideLoading());
      if (response.data.success) {
        setNewMessage("");
        setChatPartner(response.data.Data);
        setChatHistory(response.data.msg);
        setShowChat(true); // Switch to chat view on mobile/tablets
      }
    } catch (err) {
      dispatch(hideLoading());
      toast.error("Something went wrong!");
    }
  };

  const handleArtistClick = (artistId) => {
    setSelectedArtistId(artistId);
    fetchChatMessages(artistId);
  };

  const handleFilter = (e) => {
    const newData = filterData.filter((item) =>
      item.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setArtists(newData);
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  return (
    <>
      <Navbar />
      <div className="flex flex-col lg:flex-row h-screen overflow-hidden">
        {/* Sidebar for artist list */}
        <div
          className={`w-full lg:w-1/4 bg-white border-r border-gray-300 flex flex-col ${
            showChat ? "hidden lg:flex" : "flex"
          }`}
        >
          <header className="p-4 border-b border-gray-300 bg-gray-400 text-white flex flex-col sm:flex-row justify-between items-center">
            <h1 className="text-lg font-bold mb-2 sm:mb-0">My Chats</h1>
            <input
              type="text"
              placeholder="Search..."
              className="w-full sm:w-40 md:w-56 p-2 rounded-md text-black"
              onChange={handleFilter}
            />
          </header>
          <div className="flex-1 overflow-y-auto h-full">
            {artists.length ? (
              artists.map((artist) => (
                <motion.div
                  key={artist._id}
                  className={`p-3 flex items-center cursor-pointer rounded-md ${
                    selectedArtistId === artist._id
                      ? "bg-green-100"
                      : "hover:bg-green-50"
                  }`}
                  onClick={() => handleArtistClick(artist._id)}
                >
                  <img
                    src={`https://artflow.onrender.com/artistProfile/${artist.profile}`}
                    alt={`Avatar of ${artist.name}`}
                    className="w-12 h-12 rounded-full mr-3"
                  />
                  <div className="flex-1">
                    <h2 className="font-semibold truncate">{artist.name}</h2>
                    <p className="text-sm text-gray-600 truncate">
                      {artist.latestMessage || "No messages yet"}
                    </p>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-center text-gray-500 mt-4">No artists found</p>
            )}
          </div>
        </div>

        {/* Chat Section */}
        <div
          className={`flex-1 flex flex-col overflow-hidden ${
            showChat ? "flex" : "hidden lg:flex"
          }`}
        >
          <header className="bg-green-100 p-4 border-b border-gray-300 flex items-center justify-between">
            {chatPartner ? (
              <>
                {/* <button
                    onClick={() => setShowChat(false)}
                    className="lg:hidden px-4 py-2 bg-gray-400 text-white rounded-md"
                  >
                    Back
                  </button> */}
                <div className="flex items-center">
                  <img
                    src={`https://artflow.onrender.com/artistProfile/${chatPartner?.artistId?.profile}`}
                    alt={`Avatar of ${chatPartner?.artistId?.name}`}
                    className="w-12 h-12 rounded-full"
                  />
                </div>
                <h1 className="uppercase font-semibold text-lg text-center flex-1">
                  {chatPartner?.artistId?.name}+
                </h1>
                <VideoCameraIcon
                  height={40}
                  onClick={() =>
                    navigate(
                      // `/userVideoCall/${chatPartner?.userId._id}/${chatPartner?.artistId?._id}`  
                      `/userVideoCall/${chatPartner?.userId?._id}/${chatPartner?.artistId?._id}`
                    )
                  }
                />
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <h1 className="text-2xl font-semibold">
                  Select an artist to message
                </h1>
              </div>
            )}
          </header>

          <div
            className="flex-1 overflow-y-auto p-4 bg-gray-200"
            ref={chatContainerRef}
          >
            {chatHistory.length ? (
              chatHistory.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.senderId === message.userId
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`p-3 rounded-lg ${
                      message.senderId === message.userId
                        ? "bg-indigo-500 text-white"
                        : "bg-gray-300 text-black"
                    }p-3 m-2 rounded-xl max-w-xs`}
                  >
                    {message.message}
                    <div className="text-xs text-gray-600 mt-2">
                      {formatDistanceToNow(new Date(message.time), {
                        addSuffix: true,
                      })}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">Start a conversation</p>
            )}
          </div>

          {chatPartner && (
            <footer className="bg-gray-100 p-4">
              <div className="flex items-center">
                <input
                  type="text"
                  ref={inputRef}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 p-2 border rounded-md"
                />
                <button className="ml-2 bg-indigo-500 text-white px-4 py-2 rounded-md">
                  Send
                </button>
              </div>
            </footer>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatWithArtist;
