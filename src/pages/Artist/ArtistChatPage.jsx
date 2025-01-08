import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../redux/AlertSlice";
import { ArtistRequest } from "../../Helper/instance";
import { apiEndPoints } from "../../util/api";
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import socket from "../../components/SocketIo";
import ArtistNavbar from "../../components/ArtistNav";
import { CheckCircleIcon, VideoCameraIcon } from "@heroicons/react/24/outline";
import BASE_URL from "../../config/api";

const ArtistChatPage = () => {
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [chatHistory, setChatHistory] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatPartner, setChatPartner] = useState(null);
  const [filterData, setFilterData] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isSidebarVisible, setSidebarVisible] = useState(true); // Default to true for mobile visibility
  const inputRef = useRef(null);

  useEffect(() => {
    getAllMessagedUsers();
  }, []);

  const getAllMessagedUsers = async () => {
    dispatch(showLoading());
    try {
      const res = await ArtistRequest({
        url: apiEndPoints.getAllMessagedUsers,
        method: "get",
      });
      dispatch(hideLoading());
      if (res.data.success) {
        setUsers(res?.data?.users);
        setFilterData(res?.data?.users);
      } else {
        toast.error(res.data.error);
      }
    } catch (err) {
      dispatch(hideLoading());
      toast.error("Something went wrong!");
    }
  };

  const fetchChatMessages = async (userId) => {
    dispatch(showLoading());
    try {
      const response = await ArtistRequest({
        url: apiEndPoints.getPrevMessages,
        method: "post",
        data: { userId },
      });
      dispatch(hideLoading());
      if (response.data.success) {
        setNewMessage("");
        socket.emit("setup", response.data?.artistId);
        socket.emit("join", response.data?.room_id);
        setChatPartner(response.data?.Data);
        setChatHistory(response.data?.msg);
        setSidebarVisible(false); // Hide sidebar on mobile when chat opens
        getAllMessagedUsers();
      }
    } catch (err) {
      dispatch(hideLoading());
      toast.error("Something went wrong!");
    }
  };

  const updateChatHistory = (message) => {
    setChatHistory((prevHistory) => [...(prevHistory || []), message]);
  };

  useEffect(() => {
    socket.on("message received", (message) => {
      if (message.userId === selectedUserId) {
        updateChatHistory(message);
        fetchChatMessages(selectedUserId);
      } else {
        getAllMessagedUsers();
      }
    });
    return () => {
      socket.off("message received");
    };
  }, [selectedUserId]);

  const sendNewMessage = async (room_id, userId) => {
    if (newMessage.trim() === "") return;

    const Data = {
      newMessage: newMessage,
      rid: room_id,
      userId,
      time: new Date(),
    };

    dispatch(showLoading());
    try {
      const response = await ArtistRequest({
        url: apiEndPoints.sendArtistNewMsg,
        method: "post",
        data: Data,
      });
      dispatch(hideLoading());
      if (response.data.success) {
        setNewMessage("");
        fetchChatMessages(userId);
        const obj = response.data.data;
        if (!obj.senderId) {
          obj.senderId = response.data.data.userId;
        }
        socket.emit("chatMessage", obj);
        setChatHistory([...chatHistory, obj]);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  };

  const handleUserClick = (userId) => {
    setSelectedUserId(userId);
    fetchChatMessages(userId);
    setSidebarVisible(false);
    inputRef.current && inputRef.current.focus();
  };

  const chatContainerRef = useRef(null);
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleFilter = (e) => {
    const newData = filterData.filter((item) =>
      item.userName.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setUsers(newData);
  };

  return (
    <>
      <ArtistNavbar />
      <div className="flex flex-col h-screen lg:flex-row overflow-hidden">
        {/* Sidebar */}
        <div
          className={`${
            isSidebarVisible ? "flex" : "hidden"
          } w-full lg:w-1/4 bg-white border-r border-gray-300 flex-col lg:flex`}
        >
          {/* Sidebar Header */}
          <header className="p-4 border-b border-gray-300 bg-gray-400 text-white flex flex-col sm:flex-row justify-between items-center">
            <h1 className="text-xl font-semibold">My chats</h1>
            <input
              type="text"
              placeholder="Search..."
              className="border p-1 text-black w-full sm:w-auto lg:w-auto xl:w-40"
              onChange={handleFilter}
            />
          </header>

          {/* Chat List */}
          <div className="flex-1 flex flex-col overflow-y-auto">
            {users.length ? (
              users.map((user) => (
                <motion.div
                  whileHover={{ scale: 1.012 }}
                  key={user._id}
                  className={`flex items-center mb-4 shadow-md cursor-pointer hover:bg-green-100 p-2 rounded-md ${
                    selectedUserId === user.userId._id ? "bg-green-100" : ""
                  }`}
                  onClick={() => handleUserClick(user.userId._id)}
                >
                  <div className="w-12 h-12 bg-gray-300 rounded-full mr-3">
                    <img
                      src={`${BASE_URL}/userProfile/${user.userId?.profile}`}
                      alt={`Avatar of ${user.userId?.name}`}
                      className="w-12 h-12 rounded-full"
                    />
                  </div>
                  <div className="flex-1 flex justify-between">
                    <div>
                      <h2 className="text-lg font-semibold">
                        {user.userId?.name}
                      </h2>
                      {user?.latestMessage ? (
                        <p className="text-slate-600">
                          {user?.latestMessageSenderId !== user.userId._id
                            ? `You: ${user?.latestMessage}`
                            : `${user?.userId?.name}: ${user?.latestMessage}`}
                        </p>
                      ) : null}
                    </div>
                    {user?.unseenMessagesCount > 0 && (
                      <span className="bg-green-500 text-white rounded-full px-2 py-1 text-sm mr-2 sm:w-6 sm:h-7 sm:ml-2 md:text-xs">
                        {user?.unseenMessagesCount}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="w-full p-4 flex items-center justify-center">
                <div className="text-xl font-bold text-center">
                  No connections
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Toggle Button for Sidebar */}
        <button
          className="bg-gray-400 text-white px-4 py-2 fixed top-4 left-4 z-10 lg:hidden"
          onClick={() => setSidebarVisible(!isSidebarVisible)}
        >
          {isSidebarVisible ? "Close" : "Open"} Sidebar
        </button>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Chat Header */}
          <header className="bg-green-100 p-4 text-gray-700 flex items-center justify-between">
            {chatPartner ? (
              <>
                <img
                  src={`${BASE_URL}/userProfile/${chatPartner?.userId?.profile}`}
                  alt={`Avatar of ${chatPartner?.userId?.name}`}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <h1 className="uppercase text-2xl font-semibold ml-11">
                  {chatPartner?.userId?.name}
                </h1>
                <VideoCameraIcon
                  height={40}
                  onClick={() =>
                    navigate(
                      // `/artistVideoCall/${chatPartner?.artistId._id}/${chatPartner?.userId?._id}`
                      `/artistVideoCall/${chatPartner?.artistId?._id}/${chatPartner?.userId?._id}`
                    )
                  }
                />
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <h1 className="text-2xl font-semibold">
                  Select an user to message 
                </h1>
              </div>
            )}
          </header>

          {/* Chat Messages */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4"
            style={{ maxHeight: "100%" }}
          >
            {chatHistory?.length ? (
              chatHistory.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex mb-2 ${
                    msg?.senderId === chatPartner?.artistId._id
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg ${
                      msg?.senderId === chatPartner?.artistId._id
                        ? "bg-green-100"
                        : "bg-gray-200"
                    }`}
                  >
                    {msg?.message}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-600">
                Start a conversation
              </div>
            )}
          </div>

          {/* Chat Input */}
          {chatPartner && (
            <div className="p-4 flex items-center border-t border-gray-300">
              <input
                ref={inputRef}
                type="text"
                placeholder="Type your message here..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 border rounded-md p-2 mr-2 focus:ring-2 focus:ring-green-500 outline-none"
              />
              <button
                onClick={() =>
                  sendNewMessage(chatPartner?.room_id, chatPartner?.userId._id)
                }
                className="bg-green-500 text-white p-2 rounded-md"
              >
                Send
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ArtistChatPage;
