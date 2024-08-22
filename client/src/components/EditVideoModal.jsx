import React, { useState } from "react";

const EditVideoModal = ({
  title,
  thumbnail,
  description,
  videoID,
  setIsOpen,
  handleCloseModal,
  register,
  handleSubmit,
  onSubmit,
}) => {
  const [imagePreview, setImagePreview] = useState(thumbnail);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto text-white max-h-[80vh] w-[32em] overflow-auto rounded-lg border border-gray-700 bg-[#121212] p-4"
    >
      <div className="mb-4 flex items-start justify-between">
        <h2 className="text-xl font-semibold">
          Edit Video
          <span className="block text-sm text-gray-300">
            Share where you&#x27;ve worked on your profile.
          </span>
        </h2>
        <button className="h-6 w-6" onClick={() => setIsOpen(handleCloseModal)}>
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
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>
      <label for={`thumbnail${videoID}`} className="mb-1 inline-block">
        Thumbnail
        <sup>*</sup>
      </label>
      <label
        className="relative mb-4 block cursor-pointer border border-dashed p-2 after:absolute after:inset-0 after:bg-transparent hover:after:bg-black/10"
        for={`thumbnail${videoID}`}
      >
        <input
          type="file"
          className="sr-only"
          id={`thumbnail${videoID}`}
          name={`thumbnail${videoID}`}
          {...register(`thumbnail${videoID}`, {
            onChange: (e) => {
              const file = e.target.files[0];
              const reader = new FileReader();
              reader.addEventListener("load", () => {
                setImagePreview(reader.result);
              });
              if (file) {
                reader.readAsDataURL(file);
              }
            },
          })}
        />
        <img
          className="w-full max-h-[300px] object-cover"
          src={imagePreview}
          alt={title}
        />
      </label>
      <div className="mb-6 flex flex-col gap-y-4">
        <div className="w-full">
          <label for={`title${videoID}`} className="mb-1 inline-block">
            Title
            <sup>*</sup>
          </label>
          <input
            id={`title${videoID}`}
            name={`title${videoID}`}
            type="text"
            className="w-full border bg-transparent px-2 py-1 outline-none"
            defaultValue={title}
            {...register(`title${videoID}`)}
          />
        </div>
        <div className="w-full">
          <label for={`description${videoID}`} className="mb-1 inline-block">
            Description
            <sup>*</sup>
          </label>
          <textarea
            name={`description${videoID}`}
            defaultValue={description}
            id={`description${videoID}`}
            className="h-40 w-full resize-none border bg-transparent px-2 py-1 outline-none"
            {...register(`description${videoID}`)}
          >
            {/* {description} */}
          </textarea>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <button
          className="border px-4 py-3"
          onClick={() => setIsOpen(handleCloseModal)}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-[#ae7aff] px-4 py-3 text-black disabled:bg-[#E4D3FF]"
        >
          Update
        </button>
      </div>
    </form>
  );
};

export default EditVideoModal;
