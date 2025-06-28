import React, { useEffect } from "react";
import { useState } from "react";
import { set } from "mongoose";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";

export default function UpdateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const params = useParams();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    images: [],
    title: "",
    description: "",
    address: "",
    type: "hatchback",
    regularPrice: 1000,
    discountPrice: 0,
    noOfSeats: 4,
    noOfOwner: 1,
    offer: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  useEffect(() => {
    const fetchList = async () => {
      const listingId = params.listingId;
      const res = await fetch(`/server/listing/get/${listingId}`);
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setFormData(data);
    };
    fetchList();
  }, []);

  const handleChange = (e) => {
    setError("");
    if (
      e.target.id === "hatchback" ||
      e.target.id === "sedan" ||
      e.target.id === "coupe" ||
      e.target.id === "suv"
    ) {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }
    if (e.target.type === "text" || e.target.type === "textarea") {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
    if (e.target.type === "number") {
      setFormData({
        ...formData,
        [e.target.id]: parseInt(e.target.value),
      });
    }
    if (e.target.id === "offer") {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(`handleSubmit FormData: ${formData}`);

    try {
      console.log(`handleSubmit UserRef: ${currentUser._id}`);

      if (formData.images.length < 1)
        throw new Error("You must upload at least one image");
      if (formData.regularPrice < formData.discountPrice)
        throw new Error("Discount price must be lower than regular price");
      setLoading(true);
      setError(false);
      const res = await fetch(`/server/listing/update/${params.listingId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const clearFileInput = () => {
    const fileInput = document.getElementById("images");
    fileInput.value = "";
  };

  const addImageInForm = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.addEventListener("load", () => {
        let data = fileReader.result;
        resolve(data);
      });
      fileReader.readAsDataURL(file);
    });
  };

  const handleImageSubmit = (e) => {
    try {
      e.preventDefault();
      if (files.length > 0 && files.length + formData.images.length < 5) {
        setUploading(true);
        setImageUploadError(false);
        const promises = [];
        for (let i = 0; i < files.length; i++) {
          let file = files[i];
          const oneMb = 1024 * 1024;
          const fileSizeMB = Math.round(file.size / oneMb);

          if (!file.type.match("image.*")) {
            throw error;
          }
          if (fileSizeMB > 20) {
            throw error;
          }

          promises.push(addImageInForm(file));
          Promise.all(promises).then((data) => {
            setFormData({
              ...formData,
              images: formData.images.concat(data),
            });
          });
        }
      } else {
        setImageUploadError("You can only upload 4 image per listing");
        setUploading(false);
      }
    } catch (error) {
      // console.log(error.message);
      setImageUploadError("Please Upload Again");
      setUploading(false);
    } finally {
      setUploading(false);
      clearFileInput();
    }
  };

  const handleRemoveImage = (fileIndex) => {
    try {
      setFormData({
        ...formData,
        images: formData.images.filter((_, i) => i !== fileIndex),
      });
    } catch (error) {
      // console.log(error.message);
    } finally {
      clearFileInput();
      setImageUploadError(false);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Title"
            className="border p-3 rounded-lg"
            id="title"
            maxLength="62"
            minLength="10"
            required
            onChange={handleChange}
            value={formData.title}
          />
          <textarea
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            required
            onChange={handleChange}
            defaultValue={formData.address}
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="radio"
                id="hatchback"
                className="w-5"
                name="type"
                onChange={handleChange}
                checked={formData.type === "hatchback"}
              />
              <label htmlFor="hatchback">Hatchback</label>
            </div>
            <div className="flex gap-2">
              <input
                type="radio"
                id="sedan"
                className="w-5"
                name="type"
                onChange={handleChange}
                checked={formData.type === "sedan"}
              />
              <label htmlFor="sedan">Sedan</label>
            </div>
            <div className="flex gap-2">
              <input
                type="radio"
                id="suv"
                className="w-5"
                name="type"
                onChange={handleChange}
                checked={formData.type === "suv"}
              />
              <label htmlFor="suv">SUV</label>
            </div>
            <div className="flex gap-2">
              <input
                type="radio"
                id="coupe"
                className="w-5"
                name="type"
                onChange={handleChange}
                checked={formData.type === "coupe"}
              />
              <label htmlFor="coupe">Coupe</label>
            </div>
          </div>
          <div className="flex gap-6">
            <input
              type="checkbox"
              id="offer"
              className="w-5"
              onChange={handleChange}
              checked={formData.offer === true}
            />
            <label htmlFor="offer">Offer</label>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="noOfOwner"
                min="1"
                max="5"
                required
                className="p-3 border border-gray-300"
                onChange={handleChange}
                value={formData.noOfOwner}
              />
              <p>Number of Owner</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="noOfSeats"
                min="1"
                max="10"
                required
                onChange={handleChange}
                value={formData.noOfSeats}
                className="p-3 border border-gray-300"
              />
              <p>Number of Seats</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="100000"
                  max="5000000"
                required
                onChange={handleChange}
                value={formData.regularPrice}
                className="p-3 border border-gray-300 rounded-lg"
              />
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                {/* <span className="text-xs">($ / month)</span> */}
              </div>
            </div>
            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountPrice"
                  min="100000"
                  max="5000000"
                  required
                  onChange={handleChange}
                  value={formData.discountPrice}
                  className="p-3 border border-gray-300 rounded-lg"
                />
                <div className="flex flex-col items-center">
                  <p>Discounted Price</p>
                  {/* <span className="text-xs">($ / month)</span> */}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first will be the cover (max 2)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              className="p-3 border border-gray-300 rounded w-full"
              onChange={(e) => {
                setFiles(e.target.files);
                setImageUploadError(false);
              }}
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              className=" p-3 text-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
              disabled={uploading}
              onClick={handleImageSubmit}
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          <div>
            <p className="text-red-700 text-sm">
              {imageUploadError ? imageUploadError : ""}
            </p>
            {formData.images.length > 0 &&
              formData.images.map((url, index) => (
                <div
                  key={index}
                  className="flex flex-col flex-wrap justify-between p-3 border items-center"
                >
                  <img
                    src={url}
                    alt="listing image"
                    className="w-auto h-auto object-contain rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="p-3 items-start text-red-700 rounded-lg uppercase hover:opacity-75"
                  >
                    Delete
                  </button>
                </div>
              ))}
          </div>
          <button
            disabled={loading | uploading}
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opactiy-95 disabled:opacity-80"
          >
            {loading ? "Updating..." : "Update Listing"}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
}
