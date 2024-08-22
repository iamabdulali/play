import React, { useEffect, useState } from "react";
import LoggedInUserLayout from "../Layout/LoggedInUserLayout";
import { useSelector } from "react-redux";
import { useUserLikedVideosQuery } from "../store/features/user/api/likeApiSlice";
import {
  useGetUserVideosQuery,
  useUpdateVideoDetailsMutation,
  useUpdateVideoPublishedStatusMutation,
} from "../store/features/user/api/videoApiSlice";
import { useForm } from "react-hook-form";
import { useUserChannelProfileQuery } from "../store/features/user/api/userApiSlice";
import { Modal } from "../components/Modal";
import LoadingWrapper from "../components/LoadingWrapper";
import EditVideoModal from "../components/EditVideoModal";
import { toast } from "react-hot-toast";
import DeleteVideoModal from "../components/DeleteVideo";

const AdminDashboard = () => {
  const [activeVideoID, setActiveVideoID] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [totalViews, setTotalViews] = useState(0);

  const { register, handleSubmit } = useForm({});
  const { data } = useSelector((state) => state.user.userData);
  const { fullName, avatar, _id, username } = Object(data);
  const { data: channelDetails, isLoading: channelLoading } =
    useUserChannelProfileQuery(username);

  const { channel } = Object(channelDetails);
  const { subscribersCount } = channel ? channel[0] : {};
  const { data: likes } = useUserLikedVideosQuery();
  const { data: userVideos, isLoading: userVideoLoading } =
    useGetUserVideosQuery(_id);
  const [updateVideoPublishedStatus] = useUpdateVideoPublishedStatusMutation();
  const [updateVideoDetails] = useUpdateVideoDetailsMutation();
  const { totalLikes } = Object(likes);
  const { videos, videoLikes, videoDislikes } = Object(userVideos);

  // Handler to open the modal for a specific video
  const handleOpenModal = (videoID, modelType) => {
    setActiveVideoID(videoID);
    if (modelType == "edit") {
      setIsEditOpen(true);
      setIsDeleteOpen(false);
    } else {
      setIsEditOpen(false);
      setIsDeleteOpen(true);
    }
  };

  const calculateViews = () => {
    let a = 0;
    videos?.map((video) => {
      a = a + video.views;
    });
    return a;
  };

  useEffect(() => {
    setTotalViews(calculateViews());
  }, [videos]);

  calculateViews();

  // Handler to close the modal
  const handleCloseModal = () => {
    setActiveVideoID(null);
    setIsDeleteOpen(false);
    setIsEditOpen(false);
  };

  const onSubmit = async (data) => {
    console.log(data[`thumbnail${activeVideoID}`][0]);
    await updateVideoDetails({
      videoID: activeVideoID,
      title: data[`title${activeVideoID}`],
      description: data[`description${activeVideoID}`],
      thumbnail: data[`thumbnail${activeVideoID}`][0],
    })
      .unwrap()
      .then((res) => {
        toast.success(res?.message);
        handleCloseModal(activeVideoID);
      })
      .catch((err) => {
        toast.error(err?.data?.message);
      });
  };

  if (userVideoLoading) return <LoadingWrapper />;

  return (
    <LoggedInUserLayout avatar={avatar}>
      <div className="flex min-h-[calc(100vh-66px)] sm:min-h-[calc(100vh-82px)]">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-y-6 px-4 py-8">
          <div className="flex flex-wrap justify-between gap-4">
            <div className="block">
              <h1 className="text-2xl font-bold">Welcome Back, {fullName}</h1>
              <p className="text-sm text-gray-300">
                Seamless Video Management, Elevated Results.
              </p>
            </div>
            <div className="block">
              <button className="inline-flex items-center gap-x-2 bg-[#ae7aff] px-3 py-2 font-semibold text-black">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  aria-hidden="true"
                  className="h-5 w-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  ></path>
                </svg>{" "}
                Upload video
              </button>
            </div>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-4">
            <div className="border p-4">
              <div className="mb-4 block">
                <span className="inline-block h-7 w-7 rounded-full bg-[#E4D3FF] p-1 text-[#ae7aff]">
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
                      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                    ></path>
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                  </svg>
                </span>
              </div>
              <h6 className="text-gray-300">Total views</h6>
              <p className="text-3xl font-semibold">{totalViews}</p>
            </div>
            <div className="border p-4">
              <div className="mb-4 block">
                <span className="inline-block h-7 w-7 rounded-full bg-[#E4D3FF] p-1 text-[#ae7aff]">
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
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                    ></path>
                  </svg>
                </span>
              </div>
              <h6 className="text-gray-300">Total subscribers</h6>
              <p className="text-3xl font-semibold">{subscribersCount}</p>
            </div>
            <div className="border p-4">
              <div className="mb-4 block">
                <span className="inline-block h-7 w-7 rounded-full bg-[#E4D3FF] p-1 text-[#ae7aff]">
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
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                    ></path>
                  </svg>
                </span>
              </div>
              <h6 className="text-gray-300">Total likes</h6>
              <p className="text-3xl font-semibold">{totalLikes}</p>
            </div>
          </div>
          <div className="w-full overflow-auto">
            <table className="w-full min-w-[1200px] border-collapse border text-white">
              <thead>
                <tr>
                  <th className="border-collapse border-b p-4">Status</th>
                  <th className="border-collapse border-b p-4">Status</th>
                  <th className="border-collapse border-b p-4">Uploaded</th>
                  <th className="border-collapse border-b p-4">Rating</th>
                  <th className="border-collapse border-b p-4">
                    Date uploaded
                  </th>
                  <th className="border-collapse border-b p-4"></th>
                </tr>
              </thead>
              <tbody>
                {videos?.map(
                  (
                    {
                      title,
                      thumbnail,
                      description,
                      createdAt,
                      isPublished,
                      _id: videoID,
                    },
                    index
                  ) => {
                    return (
                      <tr key={videoID} className="group border">
                        <td className="border-collapse border-b border-gray-600 px-4 py-3 group-last:border-none">
                          <div className="flex justify-center">
                            <label
                              id={`checkbox${videoID}`}
                              className="relative inline-block w-12 cursor-pointer overflow-hidden"
                            >
                              <input
                                id={`checkbox${videoID}`}
                                type="checkbox"
                                className="peer absolute opacity-0 h-full w-full "
                                name={`publishedStatus-${videoID}`}
                                {...register(`publishedStatus-${videoID}`, {
                                  onChange: async () =>
                                    await updateVideoPublishedStatus({
                                      videoID,
                                      publishedStatus: !isPublished,
                                    }),
                                })}
                                defaultChecked={isPublished}
                              />
                              <span className="inline-block h-6 w-full rounded-2xl bg-gray-200 duration-200 after:absolute after:bottom-1 after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-black after:duration-200 peer-checked:bg-[#ae7aff] peer-checked:after:left-7"></span>
                            </label>
                          </div>
                        </td>
                        <td className="border-collapse border-b border-gray-600 px-4 py-3 group-last:border-none">
                          <div className="flex justify-center">
                            <span
                              className={`inline-block rounded-2xl border px-1.5 py-0.5 ${
                                isPublished
                                  ? "border-green-600 text-green-600"
                                  : "border-red-600 text-red-600"
                              } `}
                            >
                              {isPublished ? "Published" : "Unpublished"}
                            </span>
                          </div>
                        </td>
                        <td className="border-collapse border-b border-gray-600 px-4 py-3 group-last:border-none">
                          <div className="flex items-center gap-4">
                            <img
                              className="h-10 w-10 rounded-full"
                              src={thumbnail}
                              alt={fullName}
                            />
                            <h3 className="font-semibold max-w-[335px] overflow-hidden text-ellipsis whitespace-nowrap">
                              {title}
                            </h3>
                          </div>
                        </td>
                        <td className="border-collapse border-b border-gray-600 px-4 py-3 group-last:border-none">
                          <div className="flex justify-center gap-4">
                            <span className="inline-block rounded-xl bg-green-200 px-1.5 py-0.5 text-green-700">
                              {videoLikes[index]} likes
                            </span>
                            <span className="inline-block rounded-xl bg-red-200 px-1.5 py-0.5 text-red-700">
                              {videoDislikes[index]} dislikes
                            </span>
                          </div>
                        </td>
                        <td className="border-collapse border-b border-gray-600 px-4 py-3 group-last:border-none">
                          {new Date(createdAt).toLocaleDateString()}
                        </td>
                        <td className="border-collapse border-b border-gray-600 px-4 py-3 group-last:border-none">
                          <div className="flex gap-4">
                            <button
                              id={videoID}
                              onClick={() => handleOpenModal(videoID, "edit")}
                              className="h-5 w-5 hover:text-[#ae7aff]"
                            >
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
                                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                                ></path>
                              </svg>
                            </button>
                            <button
                              onClick={() => handleOpenModal(videoID, "delete")}
                              className="h-5 w-5 hover:text-[#ae7aff]"
                            >
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
                                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                ></path>
                              </svg>
                            </button>

                            {activeVideoID === videoID && isDeleteOpen && (
                              <Modal
                                children={
                                  <DeleteVideoModal
                                    videoID={videoID}
                                    setIsOpen={handleCloseModal}
                                  />
                                }
                                setIsOpen={handleCloseModal}
                                isOpen={isDeleteOpen}
                              />
                            )}

                            {activeVideoID === videoID && isEditOpen && (
                              <Modal
                                children={
                                  <EditVideoModal
                                    title={title}
                                    thumbnail={thumbnail}
                                    description={description}
                                    videoID={videoID}
                                    setIsOpen={handleCloseModal}
                                    register={register}
                                    onSubmit={onSubmit}
                                    handleSubmit={handleSubmit}
                                    index={index}
                                  />
                                }
                                isOpen={true}
                                setIsOpen={handleCloseModal} // Function to close the modal
                              />
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </LoggedInUserLayout>
  );
};

export default AdminDashboard;
