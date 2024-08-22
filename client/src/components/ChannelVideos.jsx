import React, { useState } from "react";
import UploadVideo from "./UploadVideo";
import VideoListing from "./VideoListing";
import { Modal } from "./Modal";
import { useGetUserVideosQuery } from "../store/features/user/api/videoApiSlice";
import { formatDuration } from "../utils/formatDuration";
import LoadingWrapper from "./LoadingWrapper";

const ChannelVideos = ({ channelId }) => {
  const [isOpen, setIsOpen] = useState(false);

  const { data: videoData, isLoading: videosLoading } =
    useGetUserVideosQuery(channelId);

  const { videos } = Object(videoData);

  if (videosLoading) return <LoadingWrapper />;
  const areVideosAvailable = videos.length > 0 ? true : false;

  return (
    <div
      class={`flex ${
        areVideosAvailable ? "" : "justify-center"
      } py-4 px-0 relative`}
    >
      <div class={`w-full ${areVideosAvailable ? "" : "max-w-sm text-center"}`}>
        {videos.length === 0 ? (
          <>
            {" "}
            <p class="mb-3 w-full">
              <span class="inline-flex rounded-full bg-[#E4D3FF] p-2 text-[#AE7AFF]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                  class="w-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
                  ></path>
                </svg>
              </span>
            </p>
            <h5 class="mb-2 font-semibold">No videos uploaded</h5>
            <p>
              This page has yet to upload a video. Search another page in order
              to find more videos.
            </p>
          </>
        ) : (
          <section class="w-full">
            <div class="grid grid-cols-[repeat(auto-fit,_minmax(300px,_0fr))] gap-4 ">
              {videos?.map(
                ({
                  _id,
                  thumbnail,
                  title,
                  views,
                  createdAt,
                  owner,
                  duration,
                }) => {
                  const parsedJSON = JSON.parse(owner);
                  return (
                    <VideoListing
                      videoID={_id}
                      key={createdAt}
                      thumbnail={thumbnail}
                      title={title}
                      views={views}
                      createdAt={createdAt}
                      channelAvatar={parsedJSON?.avatar}
                      channelName={parsedJSON?.username}
                      videoDuration={formatDuration(duration)}
                    />
                  );
                }
              )}
            </div>
          </section>
        )}

        <Modal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          button={
            <button
              onClick={() => setIsOpen(true)}
              class={`mt-4 inline-flex items-center gap-x-2 bg-[#ae7aff] px-3 py-2 font-semibold text-black ${
                areVideosAvailable ? "absolute right-0 top-0" : ""
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                aria-hidden="true"
                class="h-5 w-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                ></path>
              </svg>{" "}
              New video
            </button>
          }
          className="lg:w-2/3 w-11/12"
        >
          <UploadVideo setIsOpen={setIsOpen} />
        </Modal>
      </div>
    </div>
  );
};

export default ChannelVideos;
