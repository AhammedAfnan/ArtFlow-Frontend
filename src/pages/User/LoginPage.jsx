import React from 'react'
import * as Yup from 'yup';
import MyButton from '../../components/MyButton'
import {useFormik} from 'formik'
import {useDispatch} from 'react-redux'
import {useNavigate} from 'react-router-dom'
import {ServerVariables} from '../../util/ServerVariables'
import { loginThunk } from '../../redux/AuthSlice'

const loginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be atleast 6 characters")
    .required("Password is required"),
});

const LoginPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const formik = useFormik({
    initialValues:{
      email:'',
      password:'',
    },
    validationSchema:loginSchema,
    onSubmit:(values) => {
      dispatch(loginThunk(values))
    },
  })
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      {/* Outer container to handle responsiveness */}
      <div className="w-full max-w-md mx-auto bg-black text-white p-8 rounded shadow-md">
        {/* Content Container */}
        <img 
          src="/images/userImages/hub1.png" 
          alt="Logo"
          className="h-28 w-44 mx-auto"
        />
        <h2 className="text-2xl font-bold mb-6 text-center">USER LOGIN</h2>
        {error ? <p className="text-sm font-bold text-red-600">{error}</p> : ""}
        <form onSubmit={formik.handleSubmit} noValidate>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-600">
              Email:
            </label>
            <input 
              type="email"
              name="email"
              className="text-black w-full p-2 border border-gray-300 rounded"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          {formik.errors.email && formik.touched.email && (
            <p className="text-sm font-bold text-red-600">
              {formik.errors.email}
            </p>
          )}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-600">
              Password:
            </label>
            <input 
              type="password"
              name="password"
              className="text-black w-full p-2 border border-gray-300 rounded"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          {formik.errors.password && formik.touched.password && (
            <p className="text-sm font-bold text-red-600">
              {formik.errors.password}
            </p>
          )}
          <div className="flex items-center justify-center">
            <MyButton type="submit" text="Login" />
          </div>
        </form>
  
        <p className="text-sm text-center">
          Don't have an account?{" "}
          <a
            className="text-blue-500 cursor-pointer"
            onClick={() => navigate(ServerVariables.Register)}
          >
            Sign up
          </a>
        </p>
        <a
          className="text-blue-500 cursor-pointer block text-center mx-auto"
          onClick={() => navigate(ServerVariables.verifyEmail)}
        >
          Forgot Password?
        </a>
        <div className="text-center">
          <a
            className="text-yellow-300 cursor-pointer"
            onClick={() => navigate(ServerVariables.Landing)}
          >
            Back
          </a>
        </div>
      </div>
    </div>
  );  
}

export default LoginPage;
