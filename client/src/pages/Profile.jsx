import React from "react";
import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import {} from "firebase/storage";

export default function Profile() {
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const { currentUser } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});
  const [fileUploadError, setFileUploadError] = useState(false);

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
      console.log(`file size mb: ${fileSizeMB}`);
      console.log(`file type: ${file.type}`);
      if (!file.type.match('image.*')) {
        throw error
      }
      if (fileSizeMB > 100) {
        throw error;
      }
      const data = new FileReader();
      setFormData({ ...formData, avatar: file });
      // console.log(`formData: ${formData}`);
      data.addEventListener("load", () => {
        setFileUploadError(false);
        console.log(`Data.result: ${data.result}`);
        document.getElementById("profile-img").src = data.result;
      });

      data.readAsDataURL(file);
    } catch (error) {
      setFileUploadError(true);
    }
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4">
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
          id="username"
          className="border p-3 rounded-lg"
        />
        <input
          type="email"
          placeholder="email"
          id="email"
          className="border p-3 rounded-lg"
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg"
        />
        <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">
          update
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete Account</span>
        <span className="text-red-700 cursor-pointer">Sign Out</span>
      </div>
    </div>
  );
}
