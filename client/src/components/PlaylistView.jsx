import React from "react";
import { useSelector } from "react-redux";
import LoggedInUserLayout from "../Layout/LoggedInUserLayout";
import { useParams, Link } from "react-router-dom";
import {
  useGetPlaylistByIdQuery,
  useGetVideosFromPlaylistQuery,
} from "../store/features/user/api/playlistApiSlice";
import { useUserChannelProfileQuery } from "../store/features/user/api/userApiSlice";
import { getTimeDifference } from "../utils/formatTimePublished";
import { formatDuration } from "../utils/formatDuration";

const PlaylistView = () => {
  const { data: userDetails } = useSelector((state) => state.user.userData);
  const { username, avatar, fullName } = Object(userDetails);
  const { data } = useUserChannelProfileQuery(username);

  const { channel } = Object(data);
  const { subscribersCount } = Object(channel ? channel[0] : {});

  const { playlistId } = useParams();

  const { data: playlistData } = useGetPlaylistByIdQuery(playlistId);
  const { playlistThumbnail, playlist } = Object(playlistData);
  const { name, videos, createdAt } = Object(playlist);
  const { data: playlistVideosData } = useGetVideosFromPlaylistQuery(videos);
  const { playlistVideos } = Object(playlistVideosData);

  return (
    <LoggedInUserLayout avatar={avatar}>
      <section class="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
        <div class="flex flex-wrap gap-x-4 gap-y-10 p-4 xl:flex-nowrap">
          <div class="w-full shrink-0 sm:max-w-md xl:max-w-sm">
            <div class="relative mb-2 w-full pt-[56%]">
              <div class="absolute inset-0">
                <img
                  src={playlistThumbnail}
                  alt={name}
                  class="h-full w-full object-cover"
                />
                <div class="absolute inset-x-0 bottom-0">
                  <div class="relative border-t bg-white/30 p-4 text-white backdrop-blur-sm before:absolute before:inset-0 before:bg-black/40">
                    <div class="relative z-[1]">
                      <p class="flex justify-between">
                        <span class="inline-block capitalize">{name}</span>
                        <span class="inline-block">
                          {videos?.length} videos
                        </span>
                      </p>
                      <p class="text-sm text-gray-200">
                        0 Views · {getTimeDifference(createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-6 flex items-center gap-x-3">
              <div class="h-16 w-16 shrink-0">
                <img
                  src={avatar}
                  alt={fullName}
                  class="h-full w-full rounded-full"
                />
              </div>
              <div class="w-full">
                <h6 class="font-semibold">{fullName}</h6>
                <p class="text-sm text-gray-300">
                  {subscribersCount} Subscribers
                </p>
              </div>
            </div>
          </div>
          <div class="flex w-full flex-col gap-y-4">
            {playlistVideos?.map(
              ({ _id, thumbnail, title, createdAt, duration }) => {
                return (
                  <Link to={`/videos/watch/${_id}`} key={_id} class="border">
                    <div class="w-full max-w-3xl gap-x-4 sm:flex">
                      <div class="relative mb-2 w-full sm:mb-0 sm:w-5/12">
                        <div class="w-full pt-[56%]">
                          <div class="absolute inset-0">
                            <img
                              src={thumbnail}
                              alt={title}
                              class="h-full w-full object-cover"
                            />
                          </div>
                          <span class="absolute bottom-1 right-1 inline-block rounded bg-black px-1.5 text-sm">
                            {formatDuration(duration)}
                          </span>
                        </div>
                      </div>
                      <div class="flex gap-x-2 px-2 sm:w-7/12 sm:px-0">
                        <div class="h-10 w-10 shrink-0 sm:hidden">
                          <img
                            src={avatar}
                            alt={username}
                            class="h-full w-full rounded-full"
                          />
                        </div>
                        <div class="w-full">
                          <h6 class="mb-1 font-semibold sm:max-w-[75%]">
                            {title}
                          </h6>
                          <p class="flex text-sm text-gray-200 sm:mt-3">
                            0 Views · {getTimeDifference(createdAt)}
                          </p>
                          <div class="flex items-center gap-x-4">
                            <div class="mt-2 hidden h-10 w-10 shrink-0 sm:block">
                              <img
                                src={avatar}
                                alt={username}
                                class="h-full w-full rounded-full"
                              />
                            </div>
                            <p class="text-sm text-gray-200">{fullName}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              }
            )}
          </div>
        </div>
      </section>
    </LoggedInUserLayout>
  );
};

export default PlaylistView;
