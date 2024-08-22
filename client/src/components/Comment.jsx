import React, { useRef, useState } from "react";
import { getTimeDifference } from "../utils/formatTimePublished";
import {
  AiFillCodepenCircle,
  AiFillEdit,
  AiOutlineDelete,
  AiOutlineEllipsis,
} from "react-icons/ai";
import { useSelector } from "react-redux";
import { PopoverMenu } from "./Popover";
import {
  useDeleteCommentMutation,
  useEditCommentMutation,
} from "../store/features/user/api/commentApiSlice";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";

const Comment = ({
  avatar,
  username,
  fullName,
  commentContent,
  createdAt,
  commentId,
}) => {
  const user = useSelector((state) => state.user.userData);
  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      editedComment: commentContent,
    },
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [deleteComment] = useDeleteCommentMutation();
  const [editComment] = useEditCommentMutation();
  const { data } = Object(user);
  const { username: loggedInUserName } = Object(data);

  const deleteCommentFun = async () => {
    await deleteComment({
      commentId,
    })
      .unwrap()
      .then((res) => {
        toast.success(res?.message);
      })
      .catch((err) => {
        toast.error(err?.data?.message);
      });
  };

  const editCommentFun = async (data) => {
    console.log(data);
    await editComment({
      commentId,
      newContent: data.editedComment,
    })
      .unwrap()
      .then((res) => {
        toast.success(res?.message);
        setIsEditMode(false);
      })
      .catch((err) => {
        console.log(err);
        toast.success(res?.data?.message);
      });
  };

  return (
    <div className="relative">
      {loggedInUserName == username ? (
        <PopoverMenu
          button={
            <AiOutlineEllipsis
              size={24}
              color="#fff"
              className="cursor-pointer rotate-90"
            />
          }
          Menu={
            <div className="bg-black text-white border-2 border-white rounded-md mt-3 p-2">
              <button
                onClick={() => {
                  setIsEditMode(true);
                }}
                className="flex items-center gap-2"
              >
                <AiFillEdit className="text-white" size={20} /> Edit
              </button>
              <button
                onClick={deleteCommentFun}
                className="flex items-center gap-2 mt-2"
              >
                <AiOutlineDelete className="text-red-500" size={20} /> Delete
              </button>
            </div>
          }
        />
      ) : (
        ""
      )}

      <div class="flex gap-x-4">
        <div class="mt-2 h-11 w-11 shrink-0">
          <img src={avatar} alt={username} class="h-full w-full rounded-full" />
        </div>
        <div class="block w-full">
          <p class="flex items-center text-gray-200">
            {fullName}
            <span class="text-sm ml-2">{getTimeDifference(createdAt)}</span>
          </p>
          <p class="text-sm text-gray-200">@{username}</p>
          {isEditMode ? (
            <form onSubmit={handleSubmit(editCommentFun)}>
              <input
                {...register("editedComment", {
                  required: true,
                })}
                name="editedComment"
                type="text"
                className="mt-3 bg-transparent w-full text-sm border-2 p-2 rounded-md"
              />
              <div className="flex items-center gap-4 justify-end mt-4">
                <button
                  type="button"
                  onClick={() => setIsEditMode(false)}
                  className="bg-red-500 text-white py-2 px-5 rounded-md font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-white text-black py-2 px-5 rounded-md font-semibold"
                >
                  Comment
                </button>
              </div>
            </form>
          ) : (
            <p class="mt-3 text-sm">{commentContent}</p>
          )}
        </div>
      </div>
      <hr class="my-4 border-white" />
    </div>
  );
};

export default Comment;
