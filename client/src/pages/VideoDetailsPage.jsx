import React, { useEffect, useRef, useState } from "react";
import LoggedInUserLayout from "../Layout/LoggedInUserLayout";
import { useSelector } from "react-redux";
import LoadingWrapper from "../components/LoadingWrapper";
import {
  useCaptureVideoViewsMutation,
  useGetVideoByIDQuery,
} from "../store/features/user/api/videoApiSlice";
import { useParams } from "react-router-dom";
import { getTimeDifference } from "../utils/formatTimePublished";
import { useUserChannelProfileQuery } from "../store/features/user/api/userApiSlice";
import {
  useDislikeVideoMutation,
  useGetVideoLikesQuery,
  useLikeVideoMutation,
  useUserLikeDislikeStatusQuery,
} from "../store/features/user/api/likeApiSlice";
import LikeDislikeButton from "../components/LikeDislikeButton";
import PlaylistDropdown from "../components/PlaylistDropdown";
import Comment from "../components/Comment";
import {
  useAddCommentMutation,
  useGetAllCommentsForVideoQuery,
} from "../store/features/user/api/commentApiSlice";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import SubscribeButton from "../components/SubscribeButton";
import {
  useGetChannelSubscribersQuery,
  useHasUserSubscribedQuery,
  useSubscribeChannelMutation,
  useUnSubscribeChannelMutation,
} from "../store/features/user/api/subscriptionApiSlice";

const VideoDetailsPage = () => {
  const [views, setViewCount] = useState(0);
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      comment: "",
    },
  });
  const user = useSelector((state) => state.user.userData);
  if (!user) return <LoadingWrapper />;

  const { data } = Object(user);
  const { avatar, username: loggedInUserName, _id } = Object(data);

  const { videoId } = useParams();

  const { data: res, isLoading: videoLoading } = useGetVideoByIDQuery(videoId);
  const { data: channelSubscribersCount } = useGetChannelSubscribersQuery(
    res?.video?.ownerId
  );

  const { totalSubscribers } = Object(channelSubscribersCount);

  const [captureVideoViews] = useCaptureVideoViewsMutation();
  const { data: likes } = useGetVideoLikesQuery(videoId);
  const { data: status } = useUserLikeDislikeStatusQuery(videoId);
  const { data: videoComments } = useGetAllCommentsForVideoQuery(videoId);
  const { comments } = Object(videoComments);
  const [addComment] = useAddCommentMutation();
  const [subscribeChannel] = useSubscribeChannelMutation();
  const [unSubscribeChannel] = useUnSubscribeChannelMutation();
  const { data: userSubscriptionStatus } = useHasUserSubscribedQuery({
    userId: _id,
    channel: res?.video?.ownerId,
  });

  const captureVideoViewsFun = async () => {
    await captureVideoViews({
      videoID: videoId,
    })
      .unwrap()
      .then((res) => {
        console.log(res);
        setViewCount(res?.views);
      })
      .catch((err) => {
        console.log("error", err);
      });
  };

  const hasMounted = useRef(false);

  useEffect(() => {
    if (hasMounted.current) {
      // Already ran once, so we skip running again
      return;
    }

    // Set to true after the first run
    hasMounted.current = true;

    captureVideoViewsFun();
  }, []);

  const { hasSubscribed } = Object(userSubscriptionStatus);

  const { totalLikes } = Object(likes);

  const [likeVideo] = useLikeVideoMutation();
  const [dislikeVideo] = useDislikeVideoMutation();

  const likeFun = async () => {
    await likeVideo({
      itemId: videoId,
      itemType: "video",
    });
  };

  const dislikeFun = async () => {
    await dislikeVideo({
      itemId: videoId,
      itemType: "video",
    });
  };

  const postComment = async (data) => {
    const { comment } = data;
    await addComment({
      content: comment,
      videoId,
    })
      .unwrap()
      .then((res) => {
        toast.success(res?.message);
      })
      .catch((err) => {
        toast.error(err?.data?.message);
      })
      .finally(() => {
        reset();
      });
  };

  const channelReactionFun = async () => {
    const actionToChoose = hasSubscribed
      ? unSubscribeChannel
      : subscribeChannel;
    await actionToChoose({
      subscriber: _id,
      channel: res.video.ownerId,
    })
      .unwrap()
      .then((res) => {
        toast.success(res?.message);
      })
      .catch((err) => {
        toast.error(err?.data?.message);
      });
  };

  const { video } = Object(res);
  const { owner, views: currentViewCount } = Object(video);
  const parsedJSON = owner ? JSON.parse(owner) : undefined;
  const { username } = Object(parsedJSON);

  const { data: channelDetails, isLoading: channelLoading } =
    useUserChannelProfileQuery(username);

  if (videoLoading || channelLoading) return <LoadingWrapper />;

  const { videoFile, title, createdAt, description } = Object(video);
  const { channel } = channelDetails;
  const {
    fullName: channelName,
    avatar: channelAvatar,
    username: channelUsername,
  } = channel[0];

  return (
    <LoggedInUserLayout avatar={avatar}>
      <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0">
        <div className="flex w-full flex-wrap gap-4 p-4 lg:flex-nowrap">
          <div className="col-span-12 w-full">
            <div className="relative mb-4 w-full pt-[56%]">
              <div className="absolute inset-0">
                <video
                  src={videoFile}
                  className="h-full w-full"
                  controls
                  autoPlay
                />
              </div>
            </div>
            <div
              className="group mb-4 w-full rounded-lg border p-4 duration-200 hover:bg-white/5 focus:bg-white/5"
              role="button"
              tabindex="0"
            >
              <div className="flex flex-wrap gap-y-2">
                <div className="w-full md:w-1/2 lg:w-full xl:w-1/2">
                  <h1 className="text-lg font-bold">{title}</h1>
                  <p className="flex text-sm text-gray-200">
                    {views} Views · {getTimeDifference(createdAt)}
                  </p>
                </div>
                <div className="w-full md:w-1/2 lg:w-full xl:w-1/2">
                  <div className="flex items-center justify-between gap-x-4 md:justify-end lg:justify-between xl:justify-end">
                    <div className="flex overflow-hidden rounded-lg border">
                      <LikeDislikeButton
                        functionToCall={likeFun}
                        userReaction={"liked"}
                        status={status?.status}
                        totalLikes={totalLikes}
                      />
                      <LikeDislikeButton
                        functionToCall={dislikeFun}
                        userReaction={"disliked"}
                        status={status?.status}
                        isLikeBtn={false}
                      />
                    </div>
                    <PlaylistDropdown />
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-x-4">
                  <div className="mt-2 h-12 w-12 shrink-0">
                    <img
                      src={channelAvatar}
                      alt={channelName}
                      className="h-full w-full rounded-full"
                    />
                  </div>
                  <div className="block">
                    <p className="text-gray-200">{channelName}</p>
                    <p className="text-sm text-gray-400">
                      {totalSubscribers} Subscribers
                    </p>
                  </div>
                </div>
                {loggedInUserName === channelUsername ? (
                  ""
                ) : (
                  <div className="block">
                    <SubscribeButton
                      onClick={channelReactionFun}
                      subscriptionStatus={hasSubscribed}
                      channelName={channelName}
                    />
                  </div>
                )}
              </div>
              <hr className="my-4 border-white" />
              <div className="h-5 overflow-hidden group-focus:h-auto">
                <p className="text-sm">{description}</p>
              </div>
            </div>
            <button className="peer w-full rounded-lg border p-4 text-left duration-200 hover:bg-white/5 focus:bg-white/5 sm:hidden">
              <h6 className="font-semibold">{comments?.length} Comments...</h6>
            </button>
            <div className="fixed inset-x-0 top-full z-[60] h-[calc(100%-69px)] overflow-auto rounded-lg border bg-[#121212] p-4 duration-200 hover:top-[67px] peer-focus:top-[67px] sm:static sm:h-auto sm:max-h-[500px] lg:max-h-none">
              <form onSubmit={handleSubmit(postComment)} className="block">
                <h6 className="mb-4 font-semibold">
                  {comments?.length} Comments
                </h6>
                <input
                  {...register("comment", {
                    required: true,
                  })}
                  type="text"
                  className="w-full rounded-lg border bg-transparent px-2 py-1 placeholder-white"
                  placeholder="Add a Comment"
                  name="comment"
                />
              </form>
              {comments?.length == 0 ? (
                ""
              ) : (
                <hr className="my-4 border-white" />
              )}

              {comments?.map(({ _id, content, ownerData, createdAt }) => {
                const { username, fullName, avatar } = ownerData
                  ? JSON.parse(ownerData)
                  : {};
                return (
                  <Comment
                    commentContent={content}
                    username={username}
                    fullName={fullName}
                    avatar={avatar}
                    createdAt={createdAt}
                    commentId={_id}
                  />
                );
              })}
            </div>
          </div>
          <div className="col-span-12 flex w-full shrink-0 flex-col gap-3 lg:w-[350px] xl:w-[400px]">
            <div className="w-full gap-x-2 border pr-2 md:flex">
              <div className="relative mb-2 w-full md:mb-0 md:w-5/12">
                <div className="w-full pt-[56%]">
                  <div className="absolute inset-0">
                    <img
                      src="https://images.pexels.com/photos/3561339/pexels-photo-3561339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                      alt="JavaScript Fundamentals: Variables and Data Types"
                      className="h-full w-full"
                    />
                  </div>
                  <span className="absolute bottom-1 right-1 inline-block rounded bg-black px-1.5 text-sm">
                    20:45
                  </span>
                </div>
              </div>
              <div className="flex gap-x-2 px-2 pb-4 pt-1 md:w-7/12 md:px-0 md:py-0.5">
                <div className="h-12 w-12 shrink-0 md:hidden">
                  <img
                    src="https://images.pexels.com/photos/18264716/pexels-photo-18264716/free-photo-of-man-people-laptop-internet.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    alt="reactpatterns"
                    className="h-full w-full rounded-full"
                  />
                </div>
                <div className="w-full pt-1 md:pt-0">
                  <h6 className="mb-1 text-sm font-semibold">
                    JavaScript Fundamentals: Variables and Data Types
                  </h6>
                  <p className="mb-0.5 mt-2 text-sm text-gray-200">
                    Code Master
                  </p>
                  <p className="flex text-sm text-gray-200">
                    10.3k Views · 44 minutes ago
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </LoggedInUserLayout>
  );
};

export default VideoDetailsPage;
