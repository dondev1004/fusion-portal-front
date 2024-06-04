import React, { useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignUp: React.FC = () => {
  console.log(window.document.URL.split('verify=')[1]);
  

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-gray-100 to-gray-200 font-nunito">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-lg">
        <div className="text-center flex justify-center flex-col">
          <img src="/logo.png" alt="RingCentral" className="w-48 mx-auto" />
          <div className="w-full border-b py-2" />
          <h2 className="mt-6 text-2xl font-extrabold text-gray-900">
            Your account is being verified!
          </h2>
          <img src="/loading.gif" alt="loading" className="w-24 mt-5 self-center"/>
        </div>
        <div className="w-full border-b" />
      </div>
      <ToastContainer />
    </div>
  );
};

export default SignUp;
