import React from "react";
import { Link } from "react-router";
import { MdLocationOn } from "react-icons/md";

export default function ListingItem({ listing }) {
  return (
    <div className="bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow overflow-hidden w-full sm:w-[330px]">
      <Link to={`/listing/${listing._id}`}>
        <img
          src={
            listing.images[0] ||
            "https://www.bmw.com/content/dam/bmw/marketBMWCOM/bmw_com/categories/automotive-life/bmwapp-wallpaper/bawp-97-media-hd.jpg.asset.1749738939884.jpg"
          }
          alt="listing image"
          className="w-full h-[320px] sm:h-[220px] object-cover hover:scale-105 transition-scale duration-300"
        />
        <div className="p-3 flex flex-col gap-2 w-full">
          <p className="truncate text-lg fond-semibold text-slate-700">
            {listing.title}
          </p>
          <div>
            <MdLocationOn />
            <p className="text-sm text-gray-600 truncate w-full">
              {listing.address}
            </p>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">
            {listing.description}
          </p>
          <p className="text-slate-500 mt-2 font-semibold   ">
            {listing.offer
              ? `₹${listing.discountPrice.toLocaleString("en-IN")}`
              : `₹${listing.regularPrice.toLocaleString("en-IN")}`}
          </p>
          <div>
            <div>
              {listing.noOfOwner > 1
                ? `${listing.noOfOwner} Previous Owners`
                : `${listing.noOfOwner} Previous Owner`}
            </div>
            <div>
              {listing.noOfSeats > 1
                ? `${listing.noOfSeats} Previous Seats`
                : `${listing.noOfSeats} Previous Seat`}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
