"use client";

import { ErrorMessage, Field, Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import { signUpValidationSchema } from "@/schemas/auth-signup.schema";
import { signUpUser } from "@/services/auth.service";
import { SignUpFormValues } from "@/types/auth.types";

const initialValues: SignUpFormValues = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function SignupPage() {
  const router = useRouter();

  const handleSubmit = async (values: SignUpFormValues) => {
    const result = await signUpUser(values);
    if (result.success) {
      router.push("/auth/signin");
      return;
    }
    alert("Something went wrong!");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-4">Sign Up</h2>
        <Formik initialValues={initialValues} validationSchema={signUpValidationSchema} onSubmit={handleSubmit}>
          <Form className="flex flex-col gap-4">
            <div>
              <Field type="text" name="username" placeholder="Username*" className="w-full px-4 py-2 border rounded-lg" />
              <ErrorMessage name="username" component="div" className="text-red-500 text-sm mt-1" />
            </div>
            <div>
              <Field type="email" name="email" placeholder="Email*" className="w-full px-4 py-2 border rounded-lg" />
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
            </div>
            <div>
              <Field type="password" name="password" placeholder="Password*" className="w-full px-4 py-2 border rounded-lg" />
              <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
            </div>
            <div>
              <Field
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password*"
                className="w-full px-4 py-2 border rounded-lg"
              />
              <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm mt-1" />
            </div>
            <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-lg">
              Sign Up
            </button>
          </Form>
        </Formik>
      </div>
    </div>
  );
}
