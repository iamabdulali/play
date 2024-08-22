import React from "react";

const Tabs = ({ tabs, setActiveTab, activeTab, setTabIndex }) => {
  return (
    <ul class="no-scrollbar sticky top-[66px] z-[2] flex flex-row gap-x-2 overflow-auto border-b-2 border-gray-400 bg-[#121212] py-2 sm:top-[82px]">
      {tabs.map(({ label, slug, index }) => {
        return (
          <li key={label} class="w-full">
            <button
              onClick={() => {
                setActiveTab(slug);
                setTabIndex(index);
              }}
              type="button"
              class={`w-full border-b-2 ${
                activeTab == slug
                  ? "border-[#ae7aff] bg-white text-[#ae7aff]"
                  : "border-transparent text-gray-400"
              } px-3 py-1.5`}
            >
              {label}
            </button>
          </li>
        );
      })}
    </ul>
  );
};

export default Tabs;
