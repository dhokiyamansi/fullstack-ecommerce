import * as Yup from "yup";

export const signUpValidationSchema = Yup.object({
  username: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(6, "Must be at least 6 characters").required("Required"),
  confirmPassword: Yup.string().oneOf([Yup.ref("password")], "Passwords must match").required("Required"),
});
