"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";

const Nav = () => {
  const { data: session, status } = useSession();
  // if(status == 'loading') return
  return (
    <nav className="w-full max-w-screen-xl mx-auto flex justify-between items-center">
      <Link href="/" className="flex gap-2 items-center">
        <Image
          src="/assets/images/logo.svg"
          alt="logo"
          width={30}
          height={30}
        />
        <p className="logo_text text-primary font-Bruno">
          Algo<span className="text-secondary">Link</span>
        </p>
      </Link>
      <div className="flex gap-2 items-center">
        {session ? (
          <>
            <Link href="/dashboard">Dashboard</Link>
            <button onClick={signOut} className="btn_primary">
              Logout
            </button>
          </>
        ) : (
          <Link href="/login" className="btn_primary">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Nav;
