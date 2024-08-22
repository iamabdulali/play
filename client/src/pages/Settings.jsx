import React, { useState } from "react";
import { useSelector } from "react-redux";
import PersonalDetails from "../components/PersonalDetails";
import { useForm } from "react-hook-form";
import {
  useChangePasswordMutation,
  useUpdateUserAvatarMutation,
  useUpdateUserDetailsMutation,
} from "../store/features/user/api/userApiSlice";
import Tabs from "../components/Tabs";
import ChannelInformation from "../components/ChannelInformation";
import ChangePassword from "../components/ChangePassword";
import { ThreeDots } from "react-loader-spinner";
import toast from "react-hot-toast";
import { yupResolver } from "@hookform/resolvers/yup";
import { editUserDetailsSchema } from "../utils/ValidationSchema";
import { Link } from "react-router-dom";
import LoggedInUserLayout from "../Layout/LoggedInUserLayout";
import LoadingWrapper from "../components/LoadingWrapper";

const Settings = () => {
  const user = useSelector((state) => state.user.userData);

  if (!user) return <LoadingWrapper />;

  const { data } = Object(user);
  const { avatar, fullName, email, username } = Object(data);

  const [imagePreview, setImagePreview] = useState(avatar);
  const [tabIndex, setTabIndex] = useState(0);

  const values = data;
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      avatar,
      fullName,
      email,
    },
    resolver: yupResolver(editUserDetailsSchema[tabIndex]),
    values,
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [updateUserDetails] = useUpdateUserDetailsMutation();
  const [updateUseAvatar, { isLoading: avatarLoading }] =
    useUpdateUserAvatarMutation();
  const [changePassword] = useChangePasswordMutation();

  const onSubmit = async (data) => {
    const { fullName, avatar } = data;

    try {
      if (activeTab == "personal-information") {
        await updateUserDetails({ fullName });
      } else if (activeTab == "channel-information") {
        // return;
      } else {
        const res = await changePassword(data);
        if (res.error) {
          toast.error("Incorrect Password");
        } else {
          toast.success("Password Updated Successfully");
        }
      }

      if (typeof avatar == "object") {
        await updateUseAvatar({ avatar: avatar[0] });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsEditMode(false);
    }
  };

  const showImagePreview = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.addEventListener(
      "load",
      () => {
        setImagePreview(reader.result);
      },
      false
    );
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const [activeTab, setActiveTab] = useState("personal-information");

  const tabs = [
    {
      label: "Personal Information",
      slug: "personal-information",
      index: 0,
    },
    {
      label: "Channel Information",
      slug: "channel-information",
      index: 1,
    },
    {
      label: "Change Password",
      slug: "channel-password",
      index: 2,
    },
  ];

  return (
    <>
      <LoggedInUserLayout avatar={avatar}>
        <form
          encType="multipart/form-data"
          onSubmit={handleSubmit(onSubmit)}
          className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0"
        >
          <div className="relative  w-full">
            {isEditMode ? (
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <input type="file" id="cover-image" className="hidden" />
                <label
                  for="cover-image"
                  className="inline-block h-10 w-10 cursor-pointer rounded-lg bg-white/60 p-1 text-[#ae7aff] hover:bg-white"
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
                      d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                    ></path>
                  </svg>
                </label>
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="px-4 pb-4">
            <div className="flex flex-wrap gap-4 pb-4 pt-6">
              <div className="relative inline-block h-28 w-28 shrink-0 overflow-hidden rounded-full border-2">
                <img
                  alt="Channel"
                  className="h-full w-full"
                  src={imagePreview || avatar}
                />
                {isEditMode ? (
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <input
                      name="avatar"
                      ref={register}
                      {...register("avatar", {
                        onChange: (e) => {
                          showImagePreview(e);
                        },
                      })}
                      type="file"
                      id="profile-image"
                      className="hidden"
                    />
                    <label
                      for="profile-image"
                      className="inline-block h-8 w-8 cursor-pointer rounded-lg bg-white/60 p-1 text-[#ae7aff] hover:bg-white"
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
                          d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                        ></path>
                      </svg>
                    </label>
                  </div>
                ) : (
                  ""
                )}
              </div>
              <div className="mr-auto inline-block">
                <h1 className="font-bolg text-xl">{fullName}</h1>
                <p className="text-sm text-gray-400">{email}</p>
              </div>
              <div className="inline-block">
                <Link
                  to={`/channel/${username}`}
                  className="group/btn mr-1 flex w-full items-center gap-x-2 bg-[#ae7aff] px-3 py-2 text-center font-bold text-black shadow-[5px_5px_0px_0px_#4f4e4e] transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#4f4e4e] sm:w-auto"
                >
                  View channel
                </Link>
              </div>
            </div>
            <Tabs
              tabs={tabs}
              setActiveTab={setActiveTab}
              activeTab={activeTab}
              setTabIndex={setTabIndex}
            />
            {activeTab == "personal-information" ? (
              <PersonalDetails
                register={register}
                errors={errors}
                isEditMode={isEditMode}
              />
            ) : (
              ""
            )}
            {activeTab == "channel-password" ? (
              <ChangePassword
                register={register}
                errors={errors}
                isEditMode={isEditMode}
              />
            ) : (
              ""
            )}
            {activeTab == "channel-information" ? (
              <ChannelInformation
                register={register}
                errors={errors}
                isEditMode={isEditMode}
              />
            ) : (
              ""
            )}
          </div>
          <hr className="border border-gray-300" />
          <div className="flex items-center justify-end gap-4 p-4">
            {isEditMode ? (
              ""
            ) : (
              <button
                onClick={() => setIsEditMode(true)}
                type="button"
                className="inline-block rounded-lg border px-3 py-1.5 hover:bg-white/10"
              >
                Edit Details
              </button>
            )}
            {isEditMode ? (
              <>
                <button
                  onClick={() => setIsEditMode(false)}
                  type="button"
                  className="inline-block rounded-lg border px-3 py-1.5 hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-block bg-[#ae7aff] px-3 py-1.5 text-black"
                >
                  {avatarLoading ? (
                    <ThreeDots
                      visible={true}
                      height="30"
                      width="30"
                      color="#fff"
                      radius="9"
                      ariaLabel="three-dots-loading"
                      wrapperStyle={{
                        justifyContent: "center",
                      }}
                      wrapperClass=""
                    />
                  ) : activeTab == "channel-password" ? (
                    "Update Password"
                  ) : (
                    "Save changes"
                  )}
                </button>
              </>
            ) : (
              ""
            )}
          </div>
        </form>
      </LoggedInUserLayout>
    </>
  );
};

export default Settings;
