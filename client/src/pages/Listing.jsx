import React from "react";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useParams } from "react-router";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import { useSelector } from "react-redux";
import { use } from "react";
import {
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaShare,
  FaUser,
  FaUsers,
} from "react-icons/fa";
import Contact from "../components/Contact";

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);

  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const fetchListing = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/server/listing/get/${params.listingId}`);
      const data = await res.json();
      if (data.success === false) {
        setError(true);
        setLoading(false);
        return;
      }
      setListing(data);
      setLoading(false);
      setError(false);
    } catch (error) {
      setError(true);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchListing();
  }, [params.listingId]);
  return (
    <div>
      {/* {listing && listing.title} */}
      <main>
        {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
        {error && (
          <p className="text-center my-7 text-2xl">Something went wrong!</p>
        )}
        {listing && !loading && !error && (
          <div>
            <Swiper navigation>
              {listing.images.map((url) => (
                <SwiperSlide key={url}>
                  <div
                    className="h-[550px]"
                    style={{
                      background: `url(${url}) center no-repeat`,
                      backgroundSize: `cover`,
                    }}
                  ></div>
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
              <FaShare
                className="text-slate-500"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setCopied(true);
                  setTimeout(() => {
                    setCopied(false);
                  }, 2000);
                }}
              />
            </div>
            {copied && (
              <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2">
                Link Copied!
              </p>
            )}
            <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
              <p className="text-2xl font-semibold">
                {listing.title} -{" "}
                {listing.offer
                  ? listing.discountPrice.toLocaleString("en-IN", {
                      style: "currency",
                      currency: "INR",
                    })
                  : listing.regularPrice.toLocaleString("en-IN", {
                      style: "currency",
                      currency: "INR",
                    })}
              </p>
              <div className="flex gap-4">
                {listing.offer && (
                  <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                    {(
                      listing.regularPrice - listing.discountPrice
                    ).toLocaleString("en-IN", {
                      style: "currency",
                      currency: "INR",
                    })}{" "}
                    OFF
                  </p>
                )}
              </div>
              <p className="flex items-center mt-6 gap-2 text-slate-600 text-sm">
                <FaMapMarkerAlt className="text-green-700" />
                {listing.address}
              </p>
              <p className="flex items-center mt-6 gap-2 text-slate-600 text-sm">
                <span className="font-semibold text-black">Type Of Car: </span>
                {listing.type}
              </p>

              {/* <FaBed className="text-lg" /> */}
              <p className="text-slate-800">
                <span className="font-semibold text-black">
                  {" "}
                  Description -{" "}
                </span>
                {listing.description}
              </p>
              <ul className="text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6">
                <li className="flex items-center gap-1 whitespace-nowrap">
                  {listing.noOfOwner > 1 && <FaUsers className="text-lg" />}
                  {listing.noOfOwner === 1 && <FaUser className="text-lg" />}
                  {/* {console.log(listing.noOfOwner)} */}
                  {listing.noOfOwner > 1
                    ? `${listing.noOfOwner.toString()} Previous Owners`
                    : `${listing.noOfOwner.toString()} Previous Owner`}
                </li>
                <li className="flex items-center gap-1 whitespace-nowrap">
                  <FaChair className="text-lg" />
                  {`${listing.noOfSeats.toString()} Number of Seats`}
                </li>
              </ul>
              {currentUser &&
                listing.userRef !== currentUser._id &&
                !contact && (
                  <button
                    onClick={() => setContact(true)}
                    className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3"
                  >
                    Contact landlord
                  </button>
                )}
                {contact && <Contact listing={listing}/>}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
