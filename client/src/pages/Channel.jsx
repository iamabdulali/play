import React, { useState } from "react";
import { useUserChannelProfileQuery } from "../store/features/user/api/userApiSlice.js";
import { Link, useParams } from "react-router-dom";
import LoggedInUserLayout from "../Layout/LoggedInUserLayout.jsx";
import LoadingWrapper from "../components/LoadingWrapper.jsx";
import Tabs from "../components/Tabs.jsx";
import ChannelVideos from "../components/ChannelVideos.jsx";
import Playlist from "./Playlist.jsx";

const Channel = () => {
  const [activeTab, setActiveTab] = useState("videos");
  const [tabIndex, setTabIndex] = useState(0);

  const { username } = useParams();
  const { data: channelDetails, isLoading: channelLoading } =
    useUserChannelProfileQuery(username);

  // Initialize userVideosLoading as true if channelDetails are undefined
  const channelId = channelDetails?.channel[0]?._id;

  if (channelLoading) return <LoadingWrapper />;

  if (!channelDetails) {
    return <>Channel Not Found</>;
  }

  const { channel } = channelDetails;
  const { avatar, fullName, subscribersCount, subscribedToCount } = channel[0];

  const tabs = [
    {
      label: "Videos",
      slug: "videos",
      index: 0,
    },
    {
      label: "Playlist",
      slug: "playlist",
      index: 1,
    },
    {
      label: "Tweets",
      slug: "tweets",
      index: 2,
    },
    {
      label: "Subscribed",
      slug: "subscribed",
      index: 2,
    },
  ];

  return (
    <>
      <LoggedInUserLayout avatar={avatar}>
        <section class="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
          <div class="px-4 pb-4">
            <div class="flex flex-wrap gap-4 pb-4 pt-6">
              <span class="relative  inline-block h-28 w-28 shrink-0 overflow-hidden rounded-full border-2">
                <img src={avatar} alt="Channel" class="h-full w-full" />
              </span>
              <div class="mr-auto inline-block">
                <h1 class="font-bolg text-xl">{fullName}</h1>
                <p class="text-sm text-gray-400">{`@${username}`}</p>
                <p class="text-sm text-gray-400">
                  {subscribersCount} Subscribers | {subscribedToCount}{" "}
                  Subscribed
                </p>
              </div>
              <div class="inline-block">
                <Link
                  to={"/settings"}
                  class="group/btn mr-1 flex w-full items-center gap-x-2 bg-[#ae7aff] px-3 py-2 text-center font-bold text-black shadow-[5px_5px_0px_0px_#4f4e4e] transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#4f4e4e] sm:w-auto"
                >
                  <span class="inline-block w-5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="2"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                      ></path>
                    </svg>
                  </span>
                  Edit
                </Link>
              </div>
            </div>
            <Tabs
              tabs={tabs}
              setActiveTab={setActiveTab}
              activeTab={activeTab}
              setTabIndex={setTabIndex}
            />

            {activeTab == "videos" ? (
              <ChannelVideos channelId={channelId} />
            ) : (
              ""
            )}
            {activeTab == "playlist" ? <Playlist /> : ""}
          </div>
        </section>
      </LoggedInUserLayout>
    </>
  );
};

export default Channel;
