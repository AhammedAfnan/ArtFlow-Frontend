import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import MyButton from "../../components/MyButton";
import { ServerVariables } from "../../util/ServerVariables";
import { ArtistRequest } from "../../Helper/instance";
import { apiEndPoints } from "../../util/api";
import { hideLoading, showLoading } from "../../redux/AlertSlice";

const ArtistOtp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [timer, setTimer] = useState(60);
  const timerIntervalRef = useRef(null);
  const location = useLocation();
  const email = location.state ? location.state.email : "";
  const digitRefs = useRef([]);

  useEffect(() => {
    startTimer();
  }, []);

  const startTimer = () => {
    setTimer(60);
    clearInterval(timerIntervalRef.current); // Clear any existing interval before starting a new one
    const countdown = setInterval(() => {
      setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
    }, 1000);
    timerIntervalRef.current = countdown; // Save the interval reference to clear it later
    return () => clearInterval(countdown);
  };

  // Assuming you have a state for OTP digits
  const initialValues = {
    digit1: "",
    digit2: "",
    digit3: "",
    digit4: "",
  };

  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      dispatch(showLoading());
      // Handle OTP submission
      const otp = `${values.digit1}${values.digit2}${values.digit3}${values.digit4}`;

      ArtistRequest({
        url: apiEndPoints.postArtistOtp,
        method: "post",
        data: { otp: otp, email: email },
      }).then((res) => {
        if (res.data.success) {
          dispatch(hideLoading());
          toast.success(res.data.success);
          navigate(ServerVariables.ArtistLogin);
        } else {
          dispatch(hideLoading());
          toast.error(res.data.error);
        }
      });
    },
  });

  const handleInputChange = (e, index) => {
    formik.handleChange(e); // Handle formik change
    const value = e.target.value;
    if (value && index < 3) {
      digitRefs.current[index + 1].focus(); // Focus on next input field
    } else if (!value && index > 0) {
      digitRefs.current[index - 1].focus(); // Focus on previous input field
    }
  };

  const resendOtp = () => {
    dispatch(showLoading());
    ArtistRequest({
      url: apiEndPoints.ArtistResendOtp,
      method: "post",
      data: { email: email },
    })
      .then((res) => {
        dispatch(hideLoading());
        if (res.data.success) {
          toast.success(res.data.success);
          formik.resetForm();
          startTimer();
        } else {
          toast.error("failed to resend,try again");
          formik.resetForm();
        }
      })
      .catch((err) => {
        dispatch(hideLoading());
        toast.error("something went wrong");
        console.log(err.message);
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md mx-auto bg-black text-white p-8 rounded shadow-md text-center">
        <img
          src="/images/userImages/hub1.png"
          alt="Logo"
          className="h-28 w-44 mx-auto"
        />
        <h2 className="text-2xl font-bold mb-6">OTP Verification</h2>
        <p className="text-yellow-600 mb-2">
          Please enter the otp that is sended to your email
        </p>
        <form onSubmit={formik.handleSubmit} noValidate>
          <div className="flex justify-between mb-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="w-1/4 mr-2">
                <input
                  ref={(el) => (digitRefs.current[index] = el)}
                  type="text"
                  name={`digit${index + 1}`}
                  className="text-black w-full p-2 border border-gray-300 rounded text-center"
                  maxLength="1"
                  value={formik.values[`digit${index + 1}`]}
                  onChange={(e) => handleInputChange(e, index)}
                  onBlur={formik.handleBlur}
                />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center mb-4">
            <MyButton text="Verify Otp" type='submit' />
          </div>
        </form>

        <div className="flex items-center justify-center mb-4">
          {timer ? (
            <h1>{timer}</h1>
          ) : (
            <p
              className="text-[#E0CDB6] cursor-pointer font-semibold"
              onClick={resendOtp}
            >
              <span className="text-sm mt-2">Did not receive the OTP?</span>Resend Otp
            </p>
          )}
        </div>
        <p className="text-sm">
          Back to
          <a
            className="text-blue-500 cursor-pointer"
            onClick={() => navigate(ServerVariables.ArtistLogin)}
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default ArtistOtp;