"use client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation"; 

const SignUp = () => {
  const router = useRouter(); 

  const validationSchema = Yup.object({
    username: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().min(6, "Must be at least 6 characters").required("Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Required"),
  });

  const handleSubmit = async (values: any) => {
    const { confirmPassword, ...formData } = values; // Remove confirmPassword before sending

    const response = await fetch("http://localhost:5000/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const result = await response.json();
    if (result.success) {
      router.push('/auth/signin');
    } else {
      alert("Something went wrong!");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-4">Sign Up</h2>

        <Formik
          initialValues={{ username: "", email: "", password: "", confirmPassword: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
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
                <Field type="password" name="confirmPassword" placeholder="Confirm Password*" className="w-full px-4 py-2 border rounded-lg" />
                <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-lg">Sign Up</button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default SignUp;
