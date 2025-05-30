import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { signInStart, signInSuccess } from "../redux/user/userSlice.js";
import { app } from "../firebase.js";
import React from "react";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleClick = async () => {
    try {
      dispatch(signInStart);
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);

      const res = await fetch("/server/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });
      //   console.log(`res: ${ await res.json()}`);
      const data = await res.json();
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opactiy-95"
    >
      Continue with google
    </button>
  );
}
