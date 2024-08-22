import React, { useState } from "react";
import {
  useAddVideoToPlaylistMutation,
  useCreateNewPlaylistMutation,
  useDeleteVideoFromPlaylistMutation,
  useGetUserPlaylistsQuery,
} from "../store/features/user/api/playlistApiSlice";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { isVideoInPlaylists } from "../utils/checkVideoInPlaylist";

const PlaylistDropdown = () => {
  const { videoId } = useParams();
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: "",
      description: "",
    },
  });
  const { data } = useGetUserPlaylistsQuery();
  const [createNewPlaylist] = useCreateNewPlaylistMutation();
  const [addVideoToPlaylist] = useAddVideoToPlaylistMutation();
  const [deleteVideoFromPlaylist] = useDeleteVideoFromPlaylistMutation();
  const { playlists } = Object(data);

  const createPlaylist = async (data) => {
    const { playlistName, description } = data;
    if (playlistName.length > 0) {
      await createNewPlaylist({
        name: playlistName,
        description,
      })
        .unwrap()
        .then((res) => {
          toast.success(res?.message);
        })
        .catch((error) => {
          console.log(error);
          toast.error(error?.data?.message);
        })
        .finally(() => {
          reset();
        });
    } else {
      toast.error("Playlist Name is Required");
    }
  };

  const addOrRemoveVideoFromPlaylistFun = async (playlistID, operation) => {
    const functionToUse =
      operation == "add" ? addVideoToPlaylist : deleteVideoFromPlaylist;
    await functionToUse({
      videoToAdd: videoId,
      playlistID,
    })
      .unwrap()
      .then((res) => {
        toast.success(res?.message);
      })
      .catch((error) => {
        toast.error(error?.data?.message);
      });
  };

  return (
    <div className="relative block">
      <button className="peer flex items-center gap-x-2 rounded-lg bg-white px-4 py-1.5 text-black">
        <span className="inline-block w-5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
            ></path>
          </svg>
        </span>
        Save
      </button>
      <div className="absolute right-0 top-full z-10 hidden w-64 overflow-hidden rounded-lg bg-[#121212] p-4 shadow shadow-slate-50/30 hover:block peer-focus:block">
        <h3 className="mb-4 text-center text-lg font-semibold">
          Save to playlist
        </h3>
        <ul className="mb-4">
          {playlists?.map(({ name, _id, videos }) => {
            return (
              <li className="mb-2 last:mb-0" key={name}>
                <label
                  className="group/label capitalize inline-flex cursor-pointer items-center gap-x-3"
                  for={name.replace(" ", "-")}
                >
                  <input
                    defaultChecked={isVideoInPlaylists(videoId, videos)}
                    type="checkbox"
                    className="peer hidden"
                    id={name.replace(" ", "-")}
                    onChange={(e) => {
                      if (e.target.checked) {
                        addOrRemoveVideoFromPlaylistFun(_id, "add");
                      } else {
                        addOrRemoveVideoFromPlaylistFun(_id, "delete");
                      }
                    }}
                  />
                  <span className="inline-flex h-4 w-4 items-center justify-center rounded-[4px] border border-transparent bg-white text-white group-hover/label:border-[#ae7aff] peer-checked:border-[#ae7aff] peer-checked:text-[#ae7aff]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="3"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      ></path>
                    </svg>
                  </span>
                  {name}
                </label>
              </li>
            );
          })}
        </ul>
        <form className="flex flex-col" onSubmit={handleSubmit(createPlaylist)}>
          <label
            for="playlist-name"
            className="mb-1 inline-block cursor-pointer"
          >
            Name
          </label>
          <input
            name="playlistName"
            className="w-full rounded-lg border border-transparent bg-white px-3 py-2 text-black outline-none focus:border-[#ae7aff]"
            id="playlist-name"
            placeholder="Enter playlist name"
            {...register("playlistName", {
              required: true,
            })}
          />
          <textarea
            name="description"
            id="description"
            placeholder="Playlist Description..."
            className="mt-5 w-full rounded-lg border border-transparent bg-white px-3 py-2 text-black outline-none focus:border-[#ae7aff]"
            {...register("description")}
          ></textarea>
          <button
            type="submit"
            className="mx-auto mt-4 rounded-lg bg-[#ae7aff] px-4 py-2 text-black"
          >
            Create new playlist
          </button>
        </form>
      </div>
    </div>
  );
};

export default PlaylistDropdown;
