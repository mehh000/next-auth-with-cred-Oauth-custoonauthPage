'use client'


// Import necessary packages and components
import { signOut } from "next-auth/react";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <h1>Home</h1>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
}
