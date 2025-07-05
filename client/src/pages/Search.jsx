import React from "react";

export default function Search() {
  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold"htmlFor="searchTerm">Search Term:</label>
            <input className="border rounded-lg p-3 w-full"type="text" id="searchTerm" placeholder="Search..." />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <input type="checkbox" id="offer" className="w-5" />
            <label htmlFor="offer">Offer</label>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label>Type:</label>
            <div className="flex gap-2">
              <input type="checkbox" id="suv" className="w-5" />
              <label htmlFor="suv">SUV</label>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" className="w-5" id="hatchback" />
              <label htmlFor="hatchback">Hatchback</label>
            </div>
            <div className="flex gap-2">
              <input className="w-5" type="checkbox" id="sedan" />
              <label htmlFor="sedan">Seadan</label>
            </div>
            <div className="flex gap-2">
              <input className="w-5" type="checkbox" id="coupe" />
              <label htmlFor="coupe">Coupe</label>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <select id="sort_order" className="border rounded-lg p-3">
              <option>Price high to low</option>
              <option>Price low to high</option>
              <option>Latest</option>
              <option>Oldest</option>
            </select>
          </div>
          <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95">Search</button>
        </form>
      </div>
      <div className="">
        <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">Listing results:</h1>
      </div>
    </div>
  );
}
