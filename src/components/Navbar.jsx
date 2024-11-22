import { Disclosure, Menu, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  BellIcon,
  ChatBubbleLeftRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Modal from "react-modal";
import { useLocation, useNavigate } from "react-router-dom";
import { ServerVariables } from "../util/ServerVariables";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/AuthSlice";
import { userRequest } from "../Helper/instance";
import { apiEndPoints } from "../util/api";
import toast from "react-hot-toast";
import socket from "./SocketIo";
import CallingUi from "./CallingUi";
import BASE_URL from "../config/api";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeItem, setActiveItem] = useState("Home");
  const location = useLocation();
  const [Ntcount, setNtCount] = useState(0);
  const { user } = useSelector((state) => state.Auth);
  const [sender, setSender] = useState({});
  const [meetLink, setMeetLink] = useState("");
  const [MsgCount, setMsgCount] = useState(0);
  const [openVideoCallModal, setOpenVideoCallModal] = useState(false);

  useEffect(() => {
    // Handle the notification event
    socket.on("userNotification", (notification) => {
      toast.success(notification.message, { duration: 5000 });
    });
    socket.on("videoCallInvitation", (data) => {
      setSender(data?.sender);
      setMeetLink(data?.meetLink);
      setOpenVideoCallModal(true);
    });

    return () => {
      socket.off("userNotification");
      socket.off("videoCallInvitation");
    };
  }, []);

  const closeModal = () => {
    socket.emit("videoCallResponse", {
      userId: sender._id,
      accepted: false,
    });
    setOpenVideoCallModal(false);
  };
  
  const customStyles = {
    content: {
      top: "30%",
      left: "50%",
      right: "auto",
      bottom: "30%",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  useEffect(() => {
    userRequest({
      url: apiEndPoints.userNotificationsCount,
      method: "get",
    })
      .then((res) => {
        if (res.data?.success) {
          setNtCount(res.data?.count);
          if (location.pathname !== ServerVariables.chatWithArtist) {
            setMsgCount(res.data?.messagesCount);
          }
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [Ntcount, MsgCount]);

  let adjustedNtcount = Ntcount;
  let adjustedMsgcount = MsgCount;

  if (Ntcount > 10) {
    if (Ntcount > 1000) {
      adjustedNtcount = "999+";
    } else if (Ntcount > 100) {
      adjustedNtcount = "99+";
    } else if (Ntcount > 50) {
      adjustedNtcount = "50+";
    } else if (Ntcount > 20) {
      adjustedNtcount = "20+";
    } else if (Ntcount > 10) {
      adjustedNtcount = "10+";
    } else {
      adjustedNtcount = Ntcount;
    }
  }

  if (MsgCount > 10) {
    if (MsgCount > 1000) {
      adjustedMsgcount = "999+";
    } else if (MsgCount > 100) {
      adjustedMsgcount = "99+";
    } else if (MsgCount > 50) {
      adjustedMsgcount = "50+";
    } else if (MsgCount > 20) {
      adjustedMsgcount = "20+";
    } else if (MsgCount > 10) {
      adjustedMsgcount = "10+";
    } else {
      adjustedMsgcount = MsgCount;
    }
  }

  useEffect(() => {
    userRequest({
      url: apiEndPoints.getCurrentUser,
      method: "get",
    }).then((res) => {
      if (res.data.success) {
        return;
      }
      toast.error(res.data.error);
      dispatch(logoutUser());
      return;
    });
    if (location.state) {
      const { data } = location.state;
      setActiveItem(data);
    }
  }, []);

  const navigation = [
    { name: "Home", navigation: ServerVariables.userHome },
    { name: "About", navigation: ServerVariables.about },
    { name: "Explore", navigation: ServerVariables.explore },
    { name: "Artists", navigation: ServerVariables.showArtists },
  ];

  const handleLogout = async () => {
    dispatch(logoutUser());
  };

  const userNavigation = [
    { name: "Your Profile", navigation: ServerVariables.userProfile },
    { name: "Logout", navigation: "#" },
  ];

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <Disclosure as="nav" className="bg-gray-800 sticky top-0 z-50">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <img
                    className="h-16 w-34"
                    src="/images/userImages/hub1.png"
                    alt="Your Company"
                  />
                </div>
                <div className="hidden md:block">
                  <div className="ml-10 flex items-baseline space-x-4">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        onClick={() =>
                          navigate(item.navigation, {
                            state: { data: item.name },
                          })
                        }
                        className={classNames(
                          item.name === activeItem
                            ? "bg-blue-900 text-white rounded-md px-4 py-3 text-base font-medium"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-4 py-3 text-base font-medium"
                        )}
                        aria-current={item.name === activeItem ? "page" : undefined}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="ml-4 flex items-center md:ml-6">
                  <button
                    type="button"
                    className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    onClick={() => navigate(ServerVariables.chatWithArtist)}
                  >
                    <span className="sr-only">View Chats</span>
                    <ChatBubbleLeftRightIcon className="h-6 w-6" aria-hidden="true" />
                    {/* {MsgCount > 0 && (
                        <>
                          <span className="absolute top-0  bg-red-500 text-white rounded-full px-1  text-xs">
                            {adjustedMsgcount}
                          </span>
                        </>
                      )} */}
                  </button>

                  <button
                    type="button"
                    className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    onClick={() => navigate(ServerVariables.userNotifications)}
                  >
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                    {/* {Ntcount > 0 && (
                      <span className="absolute top-0 right-0 inline-flex h-3 w-3 rounded-full bg-red-600"></span>
                    )} */}
                  </button>

                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                        <span className="sr-only">Open user menu</span>
                        <img
                          className="h-8 w-8 rounded-full"
                          src={`https://artflow.onrender.com/userProfile/${user.profile}`}
                          alt=""
                        />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {userNavigation.map((item) => (
                          <Menu.Item key={item.name}>
                            {({ active }) => (
                              <a
                                onClick={() =>
                                  item.name === "Logout"
                                    ? handleLogout()
                                    : navigate(item.navigation)
                                }
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700"
                                )}
                              >
                                {item.name}
                              </a>
                            )}
                          </Menu.Item>
                        ))}
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
              <div className="-mr-2 flex md:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="md:hidden bg-gray-700">
            <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  onClick={() => {
                    navigate(item.navigation, { state: { data: item.name } });
                  }}
                  className={classNames(
                    item.name === activeItem
                      ? "bg-gray-900 text-white block rounded-md px-4 py-3 text-lg font-semibold"
                      : "text-gray-300 hover:bg-gray-600 hover:text-white block rounded-md px-4 py-3 text-lg font-semibold"
                  )}
                  aria-current={item.name === activeItem ? "page" : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
              {/* <div className="border-t border-gray-600 my-2"></div>
              <div className="flex items-center px-5 space-x-4">
                <img
                  className="h-10 w-10 rounded-full"
                  src={`https://artflow.onrender.com/userProfile/${user.profile}`}
                  alt="User Profile"
                />
                <div className="text-base font-medium text-white">
                  {user.name}
                </div>
              </div> */}
              {/* <div className="border-t border-gray-600 my-2"></div> */}
              {userNavigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  onClick={() =>
                    item.name === "Logout" ? handleLogout() : navigate(item.navigation)
                  }
                  className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white"
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
          <Modal
            isOpen={openVideoCallModal}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Video Call Invitation"
          >
            <CallingUi meetLink={meetLink} sender={sender} closeModal={closeModal} />
          </Modal>
        </>
      )}
    </Disclosure>
  );
};

export default Navbar;
