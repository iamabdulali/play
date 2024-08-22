import React from "react";
import FormField from "./FormFieldComponent";
import { ThreeDots } from "react-loader-spinner";

const PersonalDetails = ({ register, errors, isEditMode }) => {
  return (
    <div class="flex flex-wrap justify-center gap-y-4 py-4">
      <div class="w-full sm:w-1/2 lg:w-1/3">
        <h5 class="font-semibold">Personal Info</h5>
        <p class="text-gray-300">Update your photo and personal details.</p>
      </div>
      <div class="w-full sm:w-1/2 lg:w-2/3">
        <div class="rounded-lg border">
          <div class="flex flex-wrap  p-4">
            <div class="w-full">
              <FormField
                readOnly={!isEditMode}
                register={register}
                required={true}
                type="text"
                label={"Full Name"}
                fieldName="fullName"
                errors={errors}
                placeholder={"Enter Your Full Name"}
              />
            </div>
            <div class="w-full">
              <div class="relative ">
                <FormField
                  readOnly={true}
                  register={register}
                  required={true}
                  type="email"
                  label={"Email"}
                  fieldName="email"
                  errors={errors}
                  placeholder={"Enter Your Email"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalDetails;
