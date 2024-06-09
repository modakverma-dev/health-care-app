import { useRouter } from "next/router";
import React from "react";

function Navbar() {
  const router = useRouter();
  return (
    <div className="w-full fixed bg-[#407CE2] p-4 flex justify-between text-white">
      <span className="cursor-pointer" onClick={() => router.push("/")}>
        QuickDoc
      </span>
      <div className="flex gap-5 cursor-pointer">
        <span onClick={() => router.push("/dashboard")}>Appointments</span>
        <button>Logout</button>
      </div>
    </div>
  );
}

export default Navbar;
