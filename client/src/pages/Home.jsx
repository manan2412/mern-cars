import React, { use } from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import ListingItem from "../components/ListingItem";

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [coupeListings, setCoupeListings] = useState([]);
  const [suvListings, setSuvListings] = useState([]);
  SwiperCore.use([Navigation]);
  console.log(offerListings);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch("/server/listing/get?offer=true&limit=4");
        const data = await res.json();
        setOfferListings(data);
        // console.log(`Offer: ${offerListings}`);

        fetchSuvListings();
      } catch (error) {
        console.error("Error fetching offer listings:", error);
      }
    };

    const fetchSuvListings = async () => {
      try {
        const res = await fetch("/server/listing/get?type=suv&limit=4");
        const data = await res.json();
        setSuvListings(data);
        // console.log("SUV: " + suvListings);
        fetchCoupeListings();
      } catch (error) {
        console.error("Error fetching SUV listings:", error);
      }
    };
    const fetchCoupeListings = async () => {
      try {
        const res = await fetch("/server/listing/get?type=coupe&limit=4");
        const data = await res.json();
        setCoupeListings(data);
        // console.log("Coupe: " + coupeListings);
      } catch (error) {
        console.error("Error fetching coupe listings:", error);
      }
    };
    fetchOfferListings();
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
          Find your next <span className="text-slate-500">perfect</span>
          <br />
          cars with ease
        </h1>
        <div className=" text-gray-400 text-xs sm:text-sm">
          Patel Cars is the best place to find your next perfect car. We offer a
          wide range of cars, from SUVs to coupes, all at affordable prices.{" "}
          <br />
          Patel Cars has you covered.
        </div>
        <Link
          to={"/search"}
          className=" text-xs sm:text-sm text-blue-800 font-bold hover:underline"
        >
          Let's get started ...
        </Link>
      </div>
      <Swiper navigation>
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide key={listing._id}>
              <div
                style={{
                  background: `url(${listing.images[0]}) center no-repeat`,
                  backgroundSize: "cover",
                }}
                className="h-[550px]
                key={listing._id}"
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {offerListings && offerListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent offers
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={"/search?offer=true"}
              >
                Show more offers
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {coupeListings && coupeListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent Coupe Listings
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={"/search?type=coupe"}
              >
                Show more Coupe Cars
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {coupeListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {suvListings && suvListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent SUV Listings
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={"/search?type=suv"}
              >
                Show more SUV Cars
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {suvListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
}
