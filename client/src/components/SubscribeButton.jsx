import React, { useState } from "react";
import { Modal } from "./Modal";

const SubscribeButton = ({ onClick, subscriptionStatus, channelName }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Modal
      className="w-2/5"
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      children={
        <div className="bg-[#121212] text-white border-2 border-white p-5 rounded-md">
          <p className="font-medium">Unsubscribe from {channelName}? </p>
          <div className="flex items-center gap-4 justify-end mt-8">
            <button
              onClick={() => setIsOpen(false)}
              className="bg-[#333] text-white font-medium rounded-md py-2 px-4"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onClick();
                setIsOpen(false);
              }}
              className="bg-red-500 text-white font-medium rounded-md py-2 px-4"
            >
              Unsubscribe
            </button>
          </div>
        </div>
      }
      button={
        <button
          onClick={() => {
            subscriptionStatus ? () => {} : onClick();
            subscriptionStatus ? setIsOpen(true) : setIsOpen(false);
          }}
          className={`group/btn mr-1 flex w-full items-center gap-x-2 bg-[#ae7aff] px-3 py-2 text-center font-bold text-black shadow-[5px_5px_0px_0px_#4f4e4e] transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#4f4e4e] sm:w-auto`}
        >
          <span className="inline-block w-5">
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
                d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
              ></path>
            </svg>
          </span>

          <span className=" group-focus/btn:block">
            {subscriptionStatus ? "Subscribed" : "Subscribe"}
          </span>
        </button>
      }
    />
  );
};

export default SubscribeButton;
