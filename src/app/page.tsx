"use client";
import { Button, TextField } from "@mui/material";
import Image from "next/image";
import loginImage from "../../public/login.jpg";
import { useState } from "react";
import { checkEmail, checkPassword } from "../app/src/utiles/utiles";

export default function Home() {
  const year: number = new Date().getFullYear();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  function handleLogin() {
    setSubmitted(true);
    const error = checkEmail(email);
    setEmailError(error);
    const pError = checkPassword(password);
    setPasswordError(pError);
    if (!error) {
      // Nastavi sa slanjem forme
    }
  }

  return (
    <div
      className="w-screen h-screen bg-cover bg-center flex items-center justify-center "
      style={{ backgroundImage: `url(${loginImage.src})` }}
    >
      <div className="bg-loginbackground p-8 mx-auto w-[495px] rounded-md">
        <h1 className="mb-4 text-mytext text-center font-semibold text-xl">
          Online biblioteka
        </h1>
        <div className="bg-grey-line w-full h-[1px] "></div>
        <form>
          <TextField
            className="mb-6 mt-6 w-full rounded-sm"
            id="outlined-required"
            label="Email"
            placeholder="example@example.net"
            onChange={(e) => {
              setEmail(e.target.value);
              const error = checkEmail(e.target.value);
              setEmailError(error);
            }}
            error={submitted && !!emailError}
            helperText={submitted && emailError ? emailError : ""}
          />
          <TextField
            type="password"
            className="mb-6 w-full rounded-sm"
            id="outlined-required"
            label="Password"
            placeholder="Enter password"
            onChange={(e) => {
              setPassword(e.target.value);
              const error = checkPassword(e.target.value);
              setPasswordError(error);
            }}
            error={submitted && !!passwordError}
            helperText={submitted && passwordError ? passwordError : ""}
          />
          <Button
            variant="contained"
            className="bg-blue w-full mb-4 font-medium text-sm p-3"
            onClick={handleLogin}
          >
            LOG IN
          </Button>
        </form>
        <Button variant="text" className="text-blue p-2 capitalize mb-4 block">
          Forgot password?
        </Button>
        <div className=" text-grey-text text-xs text-center">
          {`©${year} ICT Cortex. All rights reserved.`}
        </div>
      </div>
    </div>
  );
}
