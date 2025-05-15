"use client";
import { useState, useEffect } from "react";
import withAuth from "../components/withAuth";

function Home() {
  localStorage.removeItem("access_token");

  return <div className="bg-red-400">Home</div>;
}

export default withAuth(Home);
