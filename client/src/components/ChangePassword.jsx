import React from "react";
import FormField from "./FormFieldComponent";

const ChangePassword = ({ register, errors, isEditMode }) => {
  return (
    <div class="flex flex-wrap justify-center gap-y-4 py-4">
      <div class="w-full sm:w-1/2 lg:w-1/3">
        <h5 class="font-semibold">Password</h5>
        <p class="text-gray-300">
          Please enter your current password to change your password.
        </p>
      </div>
      <div class="w-full sm:w-1/2 lg:w-2/3">
        <div class="rounded-lg border">
          <div class="flex flex-wrap  p-4">
            <div class="w-full">
              <FormField
                readOnly={!isEditMode}
                register={register}
                required={true}
                type="password"
                label={"Current Password"}
                fieldName="oldPassword"
                errors={errors}
                placeholder={"Current Password"}
              />
            </div>
            <div class="w-full">
              <FormField
                readOnly={!isEditMode}
                register={register}
                required={true}
                type="password"
                label={"New Password"}
                fieldName="newPassword"
                errors={errors}
                placeholder={"New Password"}
              />
              <p class="text-sm text-gray-300">
                Your new password must be more than 8 characters.
              </p>
            </div>
            <div class="w-full mt-4">
              <FormField
                readOnly={!isEditMode}
                register={register}
                required={true}
                type="password"
                label={"Confirm Password"}
                fieldName="confirmPassword"
                errors={errors}
                placeholder={"Confirm Password"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
