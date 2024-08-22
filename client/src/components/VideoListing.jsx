import React from "react";
import { getTimeDifference } from "../utils/formatTimePublished";
import { Link } from "react-router-dom";

const VideoListing = ({
  thumbnail,
  title,
  createdAt,
  views,
  channelAvatar,
  channelName,
  videoDuration,
  videoID,
}) => {
  return (
    <div className="w-full">
      <div className="relative mb-2 w-full pt-[56%]">
        <div className="absolute inset-0">
          <Link to={`/videos/watch/${videoID}`}>
            <img
              src={thumbnail}
              alt={title}
              className="h-full w-full object-cover"
            />
          </Link>
        </div>
        <span className="absolute bottom-1 font-medium right-1 inline-block rounded bg-black px-1.5 text-sm">
          {videoDuration}
        </span>
      </div>
      <div className="flex gap-x-2">
        <div className="h-10 w-10 shrink-0">
          <img
            src={channelAvatar}
            alt={channelName}
            className="h-full w-full rounded-full"
          />
        </div>
        <div className="w-full">
          <h6 className="mb-1 font-semibold">{title}</h6>
          <p className="flex text-sm text-gray-200">
            {views} Views · {getTimeDifference(createdAt)}
          </p>
          <Link
            className="text-sm text-gray-200"
            to={`/channel/${channelName}`}
          >
            {channelName}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VideoListing;
