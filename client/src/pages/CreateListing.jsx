import React, { useEffect } from "react";
import { useState } from "react";
import { set } from "mongoose";

export default function CreateListing() {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);

  // useEffect(() => {
  //   console.log(formData);
  // }, [formData]);

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

  const handleImageSubmit = async (e) => {
    try {
      e.preventDefault();
      if (files.length > 0 && files.length + formData.imageUrls.length < 5) {
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
          if (fileSizeMB > 100) {
            throw error;
          }

          promises.push(addImageInForm(file));
          Promise.all(promises).then((data) => {
            setFormData({
              ...formData,
              imageUrls: formData.imageUrls.concat(data),
            });
          });
        }
      } else {
        setImageUploadError("You can only upload 2 image per listing");
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
        imageUrls: formData.imageUrls.filter((_, i) => i !== fileIndex),
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
      <form className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            required
          />
          <textarea
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            required
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input type="radio" id="hatchback" className="w-5" name="type" />
              <label htmlFor="hatchback">Hatchback</label>
            </div>
            <div className="flex gap-2">
              <input type="radio" id="sedan" className="w-5" name="type" />
              <label htmlFor="sedan">Sedan</label>
            </div>
            <div className="flex gap-2">
              <input type="radio" id="suv" className="w-5" name="type" />
              <label htmlFor="suv">SUV</label>
            </div>
            <div className="flex gap-2">
              <input type="radio" id="coupe" className="w-5" name="type" />
              <label htmlFor="coupe">Coupe</label>
            </div>
          </div>
          <div className="flex gap-6">
            <input type="checkbox" id="offer" className="w-5" />
            <label htmlFor="offer">Offer</label>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="owner"
                min="1"
                max="5"
                required
                className="p-3 border border-gray-300"
              />
              <p>Number of Owner</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="seats"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300"
              />
              <p>Number of Seats</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
              />
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="discountPrice"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
              />
              <div className="flex flex-col items-center">
                <p>Discounted Price</p>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>
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
            {formData.imageUrls.length > 0 &&
              formData.imageUrls.map((url, index) => (
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
          <button className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opactiy-95 disabled:opacity-80">
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
}
