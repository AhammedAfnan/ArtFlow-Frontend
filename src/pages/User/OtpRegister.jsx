import React, { useState, useEffect, useRef } from 'react'
import MyButton from "../../components/MyButton";
import { useFormik } from 'formik';
import toast from "react-hot-toast";
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom'
import { userRequest } from "../../Helper/instance";
import { apiEndPoints } from "../../util/api";
import { ServerVariables } from "../../util/ServerVariables";
import { hideLoading, showLoading } from "../../redux/AlertSlice";


const OtpVerification = () => {
  const [timer, setTimer] = useState(60)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state.email ? location.state.email : ''

    const timerIntervalRef = useRef(null)

    useEffect(()=>{
        startTimer();
    },[])

    const startTimer = () => {
        setTimer(60);
        clearInterval(timerIntervalRef.current)
        const countdown = setInterval(()=>{
            setTimer((prevTimer)=>(prevTimer > 0 ? prevTimer - 1 : 0))
        },1000)
        timerIntervalRef.current = countdown;
        return()=>clearInterval(countdown)
    }

    // Assuming you have a state for OTP digits
  const initialValues = {
    digit1: "",
    digit2: "",
    digit3: "",
    digit4: "",
  };

  const digitRefs = useRef([]);

  const formik = useFormik({
    initialValues,
    onSubmit:(values)=>{
      dispatch(showLoading())
      // Handle Otp Submission
      const otp = `${values.digit1}${values.digit2}${values.digit3}${values.digit4}`;
      userRequest({
        url:apiEndPoints.postVerifyOtp,
        method:"post",
        data:{otp:otp,email:email}
      }).then((res)=>{
        if (res.data.success){
          dispatch(hideLoading())
          toast.success(res.data.success)
          navigate(ServerVariables.Login)
        }else{
          dispatch(hideLoading())
          toast.error(res.data.error)
        }
      });
    }
  })

  
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
    dispatch(showLoading())
    userRequest({
      url:apiEndPoints.postResendOtp,
      method:"post",
      data:{email:email},
    })
    .then((res)=>{
      dispatch(hideLoading())
      if(res.data.success){
        toast.success(res.data.success)
        formik.resetForm()
        startTimer()
      }else{
        toast.error("failed to resend,try again")
        formik.resetForm()
      }
    })
    .catch((err)=>{
      dispatch(hideLoading())
      toast.error("Something went wrong")
      console.log(err.message)
    })
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      {/* Outer container to handle responsiveness */}
      <div className="w-full max-w-md mx-auto bg-black text-white p-8 rounded shadow-md text-center">
        <img
          src="/images/userImages/hub1.png"
          alt="Logo"
          className="h-28 w-44 mx-auto"
        />
        <h2 className="text-2xl font-bold mb-6">OTP Verification</h2>
        <p className="text-yellow-600 mb-4">
          Please enter the OTP that was sent to your email
        </p>
        <form onSubmit={formik.handleSubmit} noValidate>
          <div className="flex justify-between mb-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="w-1/5">
                {/* Adjusted width and removed unnecessary margin */}
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
            {/* Added mb-4 for consistent spacing */}
            <MyButton text="Verify OTP" type="submit" />
          </div>
        </form>
        <div className="flex items-center justify-center mb-4">
          {/* Adjusted classNames for center alignment */}
          {timer ? (
            <h1>{timer}</h1>
          ) : (
            <div>
              <p className="text-sm mt-2">Did not receive the OTP?</p>
              <p
                className="text-[#E0CDB6] cursor-pointer font-semibold"
                onClick={resendOtp}
              >
                Resend OTP
              </p>
            </div>
          )}
        </div>
        <p className="text-sm">
          Back to{" "}
          <a
            className="text-blue-500 cursor-pointer"
            onClick={() => navigate(ServerVariables.Login)}
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );  
};

export default OtpVerification;