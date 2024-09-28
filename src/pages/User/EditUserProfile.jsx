import React, { useState } from "react";
import { userRequest } from "../../Helper/instance";
import { apiEndPoints } from "../../util/api";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../../redux/AlertSlice";
import { ServerVariables } from "../../util/ServerVariables";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../../components/Navbar";
import { updateUser } from "../../redux/AuthSlice";
import BASE_URL from "../../config/api";

function EditUserProfile() {
  const { user } = useSelector((state) => state.Auth);
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: user.name,
      mobile: user.mobile,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is Required"),
      mobile: Yup.string()
        .min(10, "Mobile number must be 10 digits")
        .max(10, "Mobile number must be 10 digits")
        .required("Mobile number is required"),
    }),
    onSubmit: (values) => {
      if (selectedImage) {
        var data = new FormData();
        const newImage = document.getElementById("upload");
        var image = newImage.files[0];
      }

      if (image) {
        if (image.type.startsWith("image")) {
          data.append("profile", image);
          data.append("name", formik.values.name);
          data.append("mobile", formik.values.mobile);
        } else {
          setError("Only images are allowed to upload");
          setTimeout(() => {
            setError("");
          }, 2000);
          return;
        }
      }

      dispatch(showLoading());
      userRequest({
        url: apiEndPoints.updateUserProfile,
        method: "post",
        data: data ? data : values,
      })
        .then((response) => {
          dispatch(hideLoading());
          if (response.data.success) {
            dispatch(updateUser(response.data.updateUser));
            navigate(ServerVariables.userProfile);
            toast.success(response.data.success);
          } else {
            toast.error(response.data.error);
          }
        })
        .catch((err) => {
          dispatch(hideLoading());
          toast.error("something went wrong");
          console.log(err.message);
        });
    },
  });

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen my-10 px-7 sm:px-6 md:px-10 lg:px-16">
  <div className="bg-gray-100 text-gray-800 p-6 md:p-8 lg:p-10 rounded shadow-md text-center w-full max-w-xl mx-auto">
    <h2 className="text-2xl font-bold mb-6">UPDATE PROFILE</h2>
    {error && <p className="text-red-600">{error}</p>}
    <img
      className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 lg:w-44 lg:h-44 mx-auto rounded-full border-2 border-gray-800 mb-4"
      src={
        selectedImage
          ? URL.createObjectURL(selectedImage)
          : `${BASE_URL}/userProfile/${user.profile}`
      }
      alt="Profile"
    />

    <form onSubmit={formik.handleSubmit} noValidate>
      <div className="flex justify-center mb-6">
        <input
          type="file"
          id="upload"
          name="post"
          accept="image/*"
          className="mt-1 p-2 w-full sm:w-32 md:w-40 lg:w-44 border rounded-md"
          onChange={(e) => setSelectedImage(e.target.files[0])}
        />
      </div>

      <div className="border-b border-gray-900/10 pb-12">
        <div className="mb-6">
          <label
            htmlFor="name"
            className="block text-sm font-medium leading-6 text-gray-700"
          >
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            id="name"
            autoComplete="name"
            className={`block w-full rounded-md py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm p-2 ${
              formik.touched.name && formik.errors.name ? "border-red-500" : ""
            }`}
          />
          {formik.touched.name && formik.errors.name && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.name}</div>
          )}
        </div>

        <div>
          <label
            htmlFor="mobile"
            className="block text-sm font-medium leading-6 text-gray-700"
          >
            Mobile
          </label>
          <input
            type="number"
            name="mobile"
            value={formik.values.mobile}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            id="mobile"
            autoComplete="mobile"
            className={`block w-full rounded-md py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm p-2 ${
              formik.touched.mobile && formik.errors.mobile ? "border-red-500" : ""
            }`}
          />
          {formik.touched.mobile && formik.errors.mobile && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.mobile}</div>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-col md:flex-row items-center justify-center gap-3">
        <button
          type="submit"
          className="bg-yellow-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Update
        </button>
        <button
          type="button"
          className="bg-gray-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => navigate(ServerVariables.userProfile)}
        >
          Back
        </button>
      </div>
    </form>
  </div>
</div>
    </>
  );
}

export default EditUserProfile;
