import React from "react";
import LoggedInUserLayout from "../Layout/LoggedInUserLayout";
import LoadingWrapper from "../components/LoadingWrapper";
import { useSelector } from "react-redux";
import { useGetAllVideosQuery } from "../store/features/user/api/videoApiSlice";
import VideoListing from "../components/VideoListing";
import { formatDuration } from "../utils/formatDuration";

const Home = () => {
  const user = useSelector((state) => state.user.userData);

  if (!user) return <LoadingWrapper />;

  const { data } = Object(user);
  const { avatar } = Object(data);

  const { data: videos, isLoading } = useGetAllVideosQuery();
  if (isLoading) return <LoadingWrapper />;

  const { videos: extractedVideos } = Object(videos);

  return (
    <LoggedInUserLayout avatar={avatar}>
      {extractedVideos.length === 0 ? (
        <section class="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
          <div class="flex h-full items-center justify-center">
            <div class="w-full max-w-sm text-center">
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
              <h5 class="mb-2 font-semibold">No videos available</h5>
              <p>
                There are no videos here available. Please try to search some
                thing else.
              </p>
            </div>
          </div>
        </section>
      ) : (
        <>
          <section class="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
            <div class="grid sm:grid-cols-[repeat(auto-fit,_minmax(300px,_0fr))] grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-4 p-4">
              {extractedVideos?.map(
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
        </>
      )}
    </LoggedInUserLayout>
  );
};

export default Home;
