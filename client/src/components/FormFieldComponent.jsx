import React from "react";

const FormField = ({
  label,
  type,
  placeholder,
  register,
  required,
  errors,
  fieldName,
  readOnly,
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={label} className="mb-1  text-gray-300 capitalize block">
        {label}
      </label>
      <input
        readOnly={readOnly}
        name={fieldName}
        type={type}
        placeholder={placeholder}
        {...register(fieldName, { required: required })}
        className="rounded-lg border bg-transparent px-3 py-2 w-full"
      />
      {errors[fieldName] && (
        <span className="text-red-500 block mt-1">
          {errors[fieldName]?.message}
        </span>
      )}
    </div>
  );
};

export default FormField;
