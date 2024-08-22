import React from "react";
import { useGetUserPlaylistsQuery } from "../store/features/user/api/playlistApiSlice";
import { Link } from "react-router-dom";
import { getTimeDifference } from "../utils/formatTimePublished";
import { useSelector } from "react-redux";

const Playlist = () => {
  const { data: userData } = useSelector((state) => state.user.userData);
  const { fullName, avatar, username } = Object(userData);
  const { data } = useGetUserPlaylistsQuery();
  const { playlists, playlistsThumbnail } = Object(data);

  return (
    <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
      <div className="pt-4 pb-4">
        <div className="grid gap-4 pt-2 sm:grid-cols-[repeat(auto-fit,_minmax(400px,0fr))] mt-10">
          {playlists?.map(({ name, videos, _id, createdAt }, index) => {
            return (
              <div class="flex items-center w-full">
                <div class="flex relative w-full">
                  <div class="w-10/12 h-40 2xl:block hidden bg-[#333] opacity-50 left-1/2 -translate-x-1/2 transform transition-all  absolute -top-8  rounded-lg"></div>
                  <div class="h-40 bg-[#333] 2xl:block hidden left-1/2 -translate-x-1/2 w-11/12 transform transition-all  absolute -top-6  rounded-lg"></div>
                  <div class="w-full flex justify-center items-center  transform transition-all 2xl:absolute relative   -top-4 rounded-lg">
                    <Link
                      to={`/videos/playlist/${_id}`}
                      key={name}
                      className="w-full"
                    >
                      <div className="relative mb-2 w-full pt-[56%]">
                        <div className="absolute inset-0">
                          <img
                            src={
                              playlistsThumbnail.length > 0
                                ? playlistsThumbnail[index]
                                : ""
                            }
                            alt="React Mastery"
                            className="h-full w-full rounded-lg object-cover"
                          />
                          <div className="absolute inset-x-0 bottom-0">
                            <div className="relative border-t bg-white/30 p-4 text-white backdrop-blur-sm before:absolute before:inset-0 before:bg-black/40">
                              <div className="relative z-[1]">
                                <p className="flex justify-between">
                                  <span className="inline-block capitalize">
                                    {name}
                                  </span>
                                  <span className="inline-block">
                                    {videos.length} videos
                                  </span>
                                </p>
                                <p className="text-sm text-gray-200">
                                  0 Views · {getTimeDifference(createdAt)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <img
                          src={avatar}
                          className="w-14 h-14 rounded-full object-cover"
                        />
                        <div>
                          <h6 className="font-semibold">{fullName}</h6>
                          <p className="text-sm text-white/50 mt-0">
                            {username}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Playlist;
