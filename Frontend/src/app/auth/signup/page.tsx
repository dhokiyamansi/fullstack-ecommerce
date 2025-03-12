"use client";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation"; 

const SignUp = () => {
  const router = useRouter(); 
  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().min(6, "Must be at least 6 characters").required("Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Required"),
  });

  const handleSubmit = async (values: any) => {
    const response = await fetch("http://localhost:5000/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const result = await response.json();
    if(result.success===true){ router.push('/auth/signin');}
    else{alert("Something went wrong!")}
   
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-4">Sign Up</h2>

        <Formik
          initialValues={{ email: "", password: "", username: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form className="flex flex-col gap-4">
            <Field type="text" name="username" placeholder="Username*" className="w-full px-4 py-2 border rounded-lg" />
            <Field type="email" name="email" placeholder="Email*" className="w-full px-4 py-2 border rounded-lg" />
            <Field type="password" name="password" placeholder="Password*" className="w-full px-4 py-2 border rounded-lg" />
            <Field type="password" name="confirm Password" placeholder="Confirm Password*" className="w-full px-4 py-2 border rounded-lg" />
            <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-lg">Sign Up</button>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default SignUp;
