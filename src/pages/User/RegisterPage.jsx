import { useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { hideLoading, showLoading } from "../../redux/AlertSlice";
import { apiEndPoints } from "../../util/api";
import { userRequest } from "../../Helper/instance";
import { ServerVariables } from "../../util/ServerVariables";

const registerSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  mobile: Yup.string()
    .min(10, "mobile number must be 10 letters")
    .max(10, "mobile number must be 10 letters")
    .required("mobile number is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be atleast 6 character")
    .required("Password is required"),
  Cpassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords doesn't match")
    .required("confirm password is required"),
});

const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const formik = useFormik({
    initialValues: {
      name: "",
      mobile: "",
      email: "",
      password: "",
      Cpassword: "",
    },
    validationSchema: registerSchema,
    onSubmit: (values) => {
      dispatch(showLoading());
      const registerData = values;

      userRequest({
        url: apiEndPoints.postRegisterData,
        method: "post", // this means ee url k data pass cheyyum ade pole userRequest lek data kodkuuna ??
        data: registerData,
      })
        .then((response) => {
          dispatch(hideLoading());
          if (response.data.success) {
            navigate(ServerVariables.verifyOtp, {
              state: { email: response.data.email },
            });
          } else {
            setError(response.data.error);
            setTimeout(() => {
              setError("");
            }, 2000);
          }
        })
        .catch((err) => {
          dispatch(hideLoading());
          toast.error("Something went wrong");
          console.log(err.message);
        });
    },
  });
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      {/* Outer container to handle responsiveness */}
      <div className="w-full max-w-md mx-auto bg-black text-white p-8 rounded shadow-md text-center">
        <img
          src="/images/userImages/hub1.png"
          alt="Logo"
          className="h-28 w-44 mx-auto"
        />
        <h2 className="text-2xl font-bold mb-6">USER REGISTER</h2>
        {error ? <p className="text-sm font-bold text-red-600">{error}</p> : ""}
        <form onSubmit={formik.handleSubmit} noValidate>
          <div className="mb-4">
            <label className="block text-sm font-semibold">Name:</label>
            <input
              type="text" // corrected 'name' type to 'text'
              name="name"
              className="text-black w-full p-2 border border-gray-300 rounded"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          {formik.errors.name && formik.touched.name && (
            <p className="text-sm font-bold text-red-600">
              {formik.errors.name}
            </p>
          )}
          <div className="mb-4">
            <label className="block text-sm font-semibold">Mobile:</label>
            <input
              type="tel" // corrected 'mobile' type to 'tel'
              name="mobile"
              className="text-black w-full p-2 border border-gray-300 rounded"
              value={formik.values.mobile}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          {formik.errors.mobile && formik.touched.mobile && (
            <p className="text-sm font-bold text-red-600">
              {formik.errors.mobile}
            </p>
          )}
          <div className="mb-4">
            <label className="block text-sm font-semibold">Email:</label>
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
            <label className="block text-sm font-semibold">Password:</label>
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
          <div className="mb-4">
            <label className="block text-sm font-semibold">
              Confirm Password:
            </label>
            <input
              type="password"
              name="Cpassword"
              className="text-black w-full p-2 border border-gray-300 rounded"
              value={formik.values.Cpassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          {formik.errors.Cpassword && formik.touched.Cpassword && (
            <p className="text-sm font-bold text-red-600">
              {formik.errors.Cpassword}
            </p>
          )}
          <div className="flex items-center justify-center">
            <button
              className="bg-yellow-500 text-black py-2 px-4 rounded hover:bg-green-600"
              type="submit"
            >
              Register
            </button>
          </div>
        </form>

        <p className="text-sm mt-4">
          Already have an account?{" "}
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

export default RegisterPage;
