import React from "react";
import { useEffect, useState } from "react";
import { Link, useAsyncError } from "react-router";

export default function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");
  const onChange = (e) => {
    setMessage(e.target.value);
  };
  const fetchLandlord = async () => {
    try {
      const res = await fetch(`/server/user/${listing.userRef}`);
      const data = await res.json();
      setLandlord(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchLandlord();
  }, [listing.userRef]);
  return (
    <div>
      {landlord && (
        <div className="flex flex-col gap-2">
          <p>
            Contact{" "}
            <span className="font-semibold">{listing.title.toLowerCase()}</span>
          </p>
          <textarea
            name="message"
            id="message"
            rows="2"
            value={message}
            onChange={onChange}
            placeholder="Enter your message here ..."
            className="w-full border p-3 rounded-lg"
          ></textarea>
          <Link
            to={`mailto:${landlord.email}?subject=Regarding ${listing.title}&body=${message}`}
            className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:backdrop-opacity-95"
          >
            Send Message
          </Link>
        </div>
      )}
    </div>
  );
}
