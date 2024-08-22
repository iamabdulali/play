import * as yup from "yup";
export const editUserDetailsSchema = [
  yup.object({
    fullName: yup.string().required("This Field is Required"),
  }),
  {},
  yup.object({
    oldPassword: yup.string().required("This Field is Required"),
    newPassword: yup
      .string()
      .min(8, "Password must be at least 8 characters long"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("newPassword"), null], "Passwords must match"),
  }),
];
