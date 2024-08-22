import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useUploadVideoMutation } from "../store/features/user/api/videoApiSlice";
import toast from "react-hot-toast";
import UploadingVideo from "./UploadingVideo";
import { formatBytes } from "../utils/formatBytes";

const UploadVideo = ({ setIsOpen }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [videoPreview, setVideoPreview] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [hasRequestStarted, setHasRequestStarted] = useState(false);
  const [hasRequestCompleted, setHasRequestCompleted] = useState(false);
  const [fileData, setFileData] = useState(null);
  const [videoDuration, setVideoDuration] = useState(null);

  const [uploadVideo] = useUploadVideoMutation();

  const onSubmit = async (data) => {
    const { videoFile, thumbnail } = data;
    const updatedData = {
      ...data,
      videoFile: videoFile[0],
      thumbnail: thumbnail[0],
      duration: videoDuration,
    };
    setHasRequestStarted(true);

    await uploadVideo(updatedData)
      .unwrap()
      .then((response) => {
        toast.success(response?.message);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error?.data?.message);
      })
      .finally(() => {
        setHasRequestCompleted(true);
      });
  };

  const showPreview = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.addEventListener(
      "load",
      () => {
        if (file.type.includes("video")) {
          setVideoPreview(reader.result);
          setFileData(file);

          // Create a video element to get the duration
          const videoElement = document.createElement("video");
          videoElement.src = reader.result;
          videoElement.addEventListener("loadedmetadata", () => {
            setVideoDuration(videoElement.duration);
          });
        } else {
          setImagePreview(reader.result);
        }
      },
      false
    );
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      {hasRequestStarted ? (
        <UploadingVideo
          videoName={fileData?.name}
          videoSize={formatBytes(fileData?.size)}
          hasRequestCompleted={hasRequestCompleted}
          setIsOpen={setIsOpen}
        />
      ) : (
        <form
          encType="multipart/form-data"
          onSubmit={handleSubmit(onSubmit)}
          className="relative w-full text-white h-svh"
        >
          <div className="absolute inset-0 z-10 bg-black/50 pt-4 sm:py-8">
            <div className="h-full overflow-auto border bg-[#121212]">
              <div className="flex items-center justify-between border-b p-4">
                <h2 className="text-xl font-semibold">Upload Videos</h2>
                <button
                  type="submit"
                  className="group/btn mr-1 flex w-auto items-center gap-x-2 bg-[#ae7aff] px-3 py-2 text-center font-bold text-black shadow-[5px_5px_0px_0px_#4f4e4e] transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#4f4e4e]"
                >
                  Save
                </button>
              </div>
              <div className="mx-auto flex w-full max-w-3xl flex-col gap-y-4 p-4">
                <div className="w-full border-2 border-dashed px-4 py-12 text-center">
                  <span className="mb-4 inline-block w-24 rounded-full bg-[#E4D3FF] p-4 text-[#AE7AFF]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                      ></path>
                    </svg>
                  </span>
                  <h6 className="mb-2 font-semibold">
                    Drag and drop video files to upload
                  </h6>
                  <p className="text-gray-400">
                    Your videos will be private until you publish them.
                  </p>
                  <label
                    htmlFor="upload-video"
                    className="group/btn mt-4 inline-flex w-auto cursor-pointer items-center gap-x-2 bg-[#ae7aff] px-3 py-2 text-center font-bold text-black shadow-[5px_5px_0px_0px_#4f4e4e] transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#4f4e4e]"
                  >
                    <input
                      {...register("videoFile", {
                        required: "Video file is required",
                        onChange: (e) => {
                          showPreview(e);
                        },
                      })}
                      type="file"
                      accept="video/*"
                      name="videoFile"
                      id="upload-video"
                      className="sr-only"
                    />
                    Select Files
                  </label>
                  {errors.videoFile && (
                    <span className="text-sm mt-2 text-red-500 block">
                      {errors.videoFile.message}
                    </span>
                  )}
                  {videoPreview && (
                    <video
                      className="mt-10 max-h-[400px]"
                      src={videoPreview}
                    ></video>
                  )}
                </div>
                <div className="w-full">
                  <label htmlFor="thumbnail" className="mb-1 inline-block">
                    Thumbnail<sup>*</sup>
                  </label>
                  <input
                    accept="image/*"
                    {...register("thumbnail", {
                      required: "Thumbnail is required",
                      onChange: (e) => {
                        showPreview(e);
                      },
                    })}
                    name="thumbnail"
                    id="thumbnail"
                    type="file"
                    className="w-full border p-1 file:mr-4 file:border-none file:bg-[#ae7aff] file:px-3 file:py-1.5"
                  />
                  {errors.thumbnail && (
                    <span className="text-sm text-red-500 block">
                      {errors.thumbnail.message}
                    </span>
                  )}
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      className="mt-5 max-h-[400px] w-full object-cover"
                    />
                  )}
                </div>
                <div className="w-full">
                  <label htmlFor="title" className="mb-1 inline-block">
                    Title<sup>*</sup>
                  </label>
                  <input
                    name="title"
                    {...register("title", {
                      required: "Title is required",
                    })}
                    id="title"
                    type="text"
                    className="w-full border bg-transparent px-2 py-1 outline-none"
                  />
                  {errors.title && (
                    <span className="text-sm text-red-500 block">
                      {errors.title.message}
                    </span>
                  )}
                </div>
                <div className="w-full">
                  <label htmlFor="desc" className="mb-1 inline-block">
                    Description<sup>*</sup>
                  </label>
                  <textarea
                    {...register("description", {
                      required: "Description is required",
                    })}
                    id="desc"
                    name="description"
                    className="h-40 w-full resize-none border bg-transparent px-2 py-1 outline-none"
                  ></textarea>
                  {errors.description && (
                    <span className="text-sm text-red-500 block">
                      {errors.description.message}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
    </>
  );
};

export default UploadVideo;
