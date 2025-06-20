import React from "react";
import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} from "../redux/user/userSlice.js";
import { useDispatch } from "react-redux";
import { Link } from "react-router";
import Listing from "../../../server/models/listing.model.js";

export default function Profile() {
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});
  const [fileUploadError, setFileUploadError] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([
    {
      _id: "685527ea6ac7c7ecbffcf979",
      title: "newnewddddddddddddddddd",
      description: "ddddddddddddddd",
      address: "dddddddddddddddddddd",
      regularPrice: 1000,
      discountPrice: 0,
      noOfSeats: 4,
      noOfOwner: 1,
      type: "hatchback",
      offer: false,
      images: [
        "data:image/png;base64,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",
      ],
      userRef: "6847845f8efde0a7ed0832d4",
      createdAt: "2025-06-20T09:20:42.480Z",
      updatedAt: "2025-06-20T09:20:42.480Z",
      __v: 0,
    },
  ]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      // console.log(`type of fil/e: ${typeof file}`);

      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    try {
      const oneMb = 1024 * 1024;
      const fileSizeMB = Math.round(file.size / oneMb);
      // console.log(`file size mb: ${fileSizeMB}`);
      // console.log(`file type: ${file.type}`);
      if (!file.type.match("image.*")) {
        throw error;
      }
      if (fileSizeMB > 100) {
        throw error;
      }
      const s = new FileReader();
      console.log(`formData before: ${JSON.stringify(formData)}`);

      data.addEventListener("load", () => {
        setFileUploadError(false);
        // console.log(`Data.result: ${data.result}`);
        document.getElementById("profile-img").src = data.result;
        setFormData({ ...formData, avatar: data.result });
        console.log(`formData after: ${Object.entries(formData)}`);
      });

      data.readAsDataURL(file);
    } catch (error) {
      setFileUploadError(true);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/server/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };
  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/server/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess());
    } catch (error) {
      dispatch(deleteUserFailure(data.message));
    }
  };
  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/server/auth/signout", {
        method: "POST",
      });
      const data = res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(data.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/server/user/listing/${currentUser._id}`);
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e) => {
            setFile(e.target.files[0]);
            // data.readAsDataURL(e.target.files[0]);
          }}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />

        <img
          id="profile-img"
          onClick={() => fileRef.current.click()}
          src={currentUser.avatar}
          // src={data.result}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Error in Image Upload, Image needs to be below 100 MB.
            </span>
          ) : (
            <span></span>
          )}
        </p>
        <input
          type="text"
          placeholder="username"
          defaultValue={currentUser.username}
          id="username"
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />
        <input
          type="text"
          onChange={handleChange}
          placeholder="email"
          defaultValue={currentUser.email}
          id="email"
          className="border p-3 rounded-lg"
        />
        <input
          onChange={handleChange}
          type="password"
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg"
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Update"}
        </button>
        <Link
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
          to={"/create-listing"}
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer"
        >
          Delete Account
        </span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
          Sign Out
        </span>
      </div>
      <p className="text-red-700 mt-5">{error ? error : ""}</p>
      <p className="text-green-700 mt5">
        {updateSuccess ? "User is updated successfully!" : ""}
      </p>
      <button onClick={handleShowListings} className="text-green-700 w-full">
        Show Listings
      </button>
      <p className="text-red-700 mt-5">
        {showListingsError ? "Error showing listings" : ""}
      </p>
      {userListings && userListings.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 text-2xl font-semibold">
            Your Listings
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className="border rounded-lg p-3 flex justify-between items-center gap-4"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.images[0]}
                  alt="listing cover"
                  className="h-16 w-26 object-contain"
                />
              </Link>
              <Link
                className="text-slate-700 font-semibold hover:underline truncate flex-1"
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>
              <div className="flex flex-col items-center">
                <button className="text-red-700 uppercase">Delete</button>
                <button className="text-green-700 uppercase">Edit</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
