"use client";
import { get, login } from "@/utils/apiService";
import { Button, TextField } from "@mui/material";
import Image from "next/image";
import loginImage from "../../public/login.jpg";
import { useState } from "react";
import { checkEmail, checkPassword } from "../utils/utiles";
import { useRouter } from "next/router";

export default function Login() {
  const year: number = new Date().getFullYear();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>("");
  const router = useRouter();

  async function handleLogin() {
    setSubmitted(true);
    const error = checkEmail(email);
    setEmailError(error);
    const pError = checkPassword(password);
    setPasswordError(pError);
    if (!error && !pError) {
      try {
        const data = {
          email,
          password,
        };
        const res = await login(data);
        console.log(res);
        if (res === "Invalid email or password") {
          setErrorMessage("Pogresan email ili password!");
        }

        //Ako je logovanje uspjesno preusmjeri korisnika:
        if (res && res.access_token) {
          //preusmjeri na glavnu stranicu
          router.push("/");
        }
      } catch (err: any) {
        setErrorMessage(err.message || "Greška pri logovanju");
        console.error("Login failed", err);
        console.log(errorMessage);
      }
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
              setErrorMessage("");
              const error = checkEmail(e.target.value);
              setEmailError(error);
            }}
            error={submitted && (!!emailError || errorMessage != "")}
            helperText={submitted && emailError ? emailError : ""}
          />
          <TextField
            type="password"
            className="mb-6 w-full rounded-sm"
            id="outlined-required"
            label="Password"
            placeholder="Enter password"
            onChange={(e) => {
              setErrorMessage("");
              setPassword(e.target.value);
              const error = checkPassword(e.target.value);
              setPasswordError(error);
            }}
            error={submitted && (!!passwordError || errorMessage != "")}
            helperText={submitted && passwordError ? passwordError : ""}
          />
          {errorMessage && (
            <div className="text-red-600 mb-4 -mt-2">{errorMessage}</div>
          )}
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
