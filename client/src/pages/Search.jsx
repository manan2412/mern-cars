import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import ListingItem from "../components/ListingItem";
import { set } from "mongoose";

export default function Search() {
  const navigate = useNavigate();
  const [sidebardata, setSidebardata] = useState({
    searchTerm: "",
    type: "all",
    offer: false,
    sort: "createdAt",
    order: "desc",
  });
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);
  console.log(sidebardata);
  // console.log(location.search);

  const fetchListings = async () => {
    try {
      setLoading(true);
      setShowMore(false);
      const urlParams = new URLSearchParams(location.search);
      const searchQuery = urlParams.toString();
      console.log(searchQuery);
      const res = await fetch(`/server/listing/get?${searchQuery}`);
      const data = await res.json();

      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setListings(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching listings:", error);
      setLoading(false);
      return;
    }
  };
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        offer: offerFromUrl === "true" ? true : false,
        sort: sortFromUrl || "createdAt",
        order: orderFromUrl || "desc",
      });
    }
    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "suv" ||
      e.target.id === "hatchback" ||
      e.target.id === "sedan" ||
      e.target.id === "coupe"
    ) {
      setSidebardata({ ...sidebardata, type: e.target.id });
    }
    if (e.target.id === "searchTerm") {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    }
    if (e.target.id === "offer") {
      console.log(e.target.checked);
      setSidebardata({
        ...sidebardata,
        offer: e.target.checked === true ? true : false,
      });
    }
    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "createdAt";
      const order = e.target.value.split("_")[1] || "desc";
      setSidebardata({ ...sidebardata, sort, order });
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebardata.searchTerm);
    urlParams.set("type", sidebardata.type);
    urlParams.set("offer", sidebardata.offer);
    urlParams.set("sort", sidebardata.sort);
    urlParams.set("order", sidebardata.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
    fetchListings();
  };

  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    try {
      const res = await fetch(`/server/listing/get?${searchQuery}`);
      const data = await res.json();
      if (data.length < 9) {
        setShowMore(false);
      }
      setListings([...listings, ...data]);
      setLoading(false);
      console.log(data);
    } catch (error) {
      console.log(error);
      return;
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-slate-200 border-b-2 md:border-r-2 md:min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label
              className="whitespace-nowrap font-semibold"
              htmlFor="searchTerm"
            >
              Search Term:
            </label>
            <input
              className="border rounded-lg p-3 w-full"
              type="text"
              id="searchTerm"
              placeholder="Search..."
              onChange={handleChange}
              value={sidebardata.searchTerm}
            />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                value={sidebardata.offer}
                checked={sidebardata.offer === true}
              />
              <label htmlFor="offer">Offer</label>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Type:</label>
            <div className="flex gap-2">
              <input
                type="radio"
                name="type"
                id="all"
                checked={sidebardata.type === "all"}
                className="w-5"
                onChange={handleChange}
                value={sidebardata.type === "all"}
              />
              <label htmlFor="all">All</label>
            </div>
            <div className="flex gap-2">
              <input
                type="radio"
                name="type"
                id="suv"
                className="w-5"
                onChange={handleChange}
                value={sidebardata.type === "suv"}
                checked={sidebardata.type === "suv"}
              />
              <label htmlFor="suv">SUV</label>
            </div>
            <div className="flex gap-2">
              <input
                type="radio"
                name="type"
                className="w-5"
                id="hatchback"
                onChange={handleChange}
                value={sidebardata.type === "hatchback"}
                checked={sidebardata.type === "hatchback"}
              />
              <label htmlFor="hatchback">Hatchback</label>
            </div>
            <div className="flex gap-2">
              <input
                className="w-5"
                type="radio"
                name="type"
                id="sedan"
                onChange={handleChange}
                value={sidebardata.type === "sedan"}
                checked={sidebardata.type === "sedan"}
              />
              <label htmlFor="sedan">Sedan</label>
            </div>
            <div className="flex gap-2">
              <input
                className="w-5"
                type="radio"
                name="type"
                id="coupe"
                onChange={handleChange}
                value={sidebardata.type === "coupe"}
                checked={sidebardata.type === "coupe"}
              />
              <label htmlFor="coupe">Coupe</label>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <select
              onChange={handleChange}
              defaultValue={"createdAt_desc"}
              id="sort_order"
              className="border rounded-lg p-3"
            >
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price low to high</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>
          <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95">
            Search
          </button>
        </form>
      </div>
      <div className="flex-1">
        <h1 className="text-3xl border-slate-200 font-semibold border-b p-3 text-slate-700 mt-5">
          Listing results:
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && listings.length === 0 && (
            <p className="text-xl text-slate-700">
              No listings found for your search criteria.
            </p>
          )}
          {loading && (
            <p className="text-xl text-slate-700 text-center w-full">
              Loading...
            </p>
          )}
          {listings && console.log(listings)}
          {!loading &&
            listings &&
            listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}
          {showMore && (
            <button
              onClick={onShowMoreClick}
              className="text-green-700 hover:underline p-7 text-center w-full"
            >
              Show more
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
