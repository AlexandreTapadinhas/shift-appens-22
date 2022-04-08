import { signInWithGoogle } from "../services/firebase";

import "../App.css";

import { IoLogoGoogle } from "react-icons/io5";

const Login = () => {
  return (
    <div>
      <div className="flex flex-row items-center justify-center h-screen text-2xl">
        <button className="" onClick={signInWithGoogle}>
          <IoLogoGoogle />
        </button>
        <button className="" onClick={signInWithGoogle}>
          <h1 className="pl-4">Sign in with google</h1>
        </button>
      </div>
    </div>
  );
};

export default Login;
