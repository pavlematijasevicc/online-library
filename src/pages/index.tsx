"use client";
import { useState, useEffect } from "react";
import withAuth from "../components/withAuth";
import Navbar from "@/components/Navbar";
import SideMenu from "@/components/SideMenu";
import Link from "next/link";

function Home() {
  function handleLogin() {
    localStorage.removeItem("access_token");
  }

  return (
    <Link href={"/login"}>
      <button className="hover:cursor-pointer" onClick={() => handleLogin()}>
        Log out
      </button>
    </Link>
  );
}

export default withAuth(Home);
