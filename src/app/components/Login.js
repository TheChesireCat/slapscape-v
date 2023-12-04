'use client'

import { useFormState, useFormStatus } from "react-dom";
import { loginUser } from "@/app/lib/actions";
import { Button } from "@/app/components/ui/button";
// import cookieCutter from 'cookie-cutter'


const initialState = {
  error: null,
};

function LoginButton() {
const { pending } = useFormStatus()
  return (
    <Button
      type="submit"
      className="w-full bg-gray-800 text-white p-4 rounded-xl button-shadow hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-opacity-50"
      aria-disabled={pending}
    >
      Login
    </Button>
  );
}

export default function Login() {
  const [state, formAction] = useFormState(loginUser, initialState);
//   const token = cookieCutter.get('AUTH_TOKEN');
//   const payload = token ? await verifyJwtToken(token, getJwtSecretKey()) : null;
//   if (payload) {
//     redirect("/home");
//   }
// const token = cookieCutter.get('AUTH_TOKEN');
  
  return (  
    <div className="bg-gray-100 flex items-center justify-center h-screen">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">
        <h1 className="text-xl font-bold text-center mb-6">
          Login to Slapscape
        </h1>
        <form action={formAction}>
          <div className="mb-4">
            <input
              type="text"
              id="username"
              name="username"
              placeholder="User name"
              required
              className="w-full p-4 border border-gray-300 rounded-xl mt-1 bg-white input-shadow focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              required
              className="w-full p-4 border border-gray-300 rounded-xl mt-1 bg-white input-shadow focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
            />
          </div>
          <LoginButton />
        </form>
        <p className="text-red-500 text-center pt-4">{state?.error}</p>
        <p className="text-center mt-4">
          Don&#39;t have an account?
          <a href="/register" className="text-purple-600 hover:text-purple-800">
            {" "}
            Register here
          </a>
        </p>
      </div>
    </div>
  );
}
