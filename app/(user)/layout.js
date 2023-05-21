"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function UserLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status != "loading" && !session) {
    router.push("/login");
  }
  return (
    <>
      <div className="fixed min-h-screen w-80 hidden bg-secondary-light lg:block lg:w-20 2xl:w-80 transition-all">
        <Link
          href="/"
          className="flex gap-2 justify-center bg-secondary-dark items-center h-16 shadow-lg"
        >
          <Image
            src="/assets/images/logo.svg"
            alt="logo"
            width={30}
            height={30}
          />
          <p className="logo_text lg:hidden 2xl:block text-white font-Bruno">
            AlgoLink
          </p>
        </Link>
        <div className="mt-4">
          <ul>
            <li className="border-b border-gray-100">
              <Link
                className="flex gap-2 p-4 items-center justify-center 2xl:justify-start hover:bg-secondary"
                href="/dashboard"
              >
                <Image
                  src="/assets/icons/dashboard.svg"
                  alt="logo"
                  width={30}
                  height={30}
                />
                <span className="hidden 2xl:block">Dashboard</span>
              </Link>
            </li>
            <li className="border-b border-gray-100">
              <Link
                className="flex gap-2 p-4 items-center justify-center 2xl:justify-start hover:bg-secondary"
                href="/broker"
              >
                <Image
                  src="/assets/icons/document-add.svg"
                  alt="logo"
                  width={30}
                  height={30}
                />
                <span className="hidden 2xl:block">Add Broker</span>
              </Link>
            </li>
            <li className="border-b border-gray-100">
              <Link
                className="flex gap-2 p-4 items-center justify-center 2xl:justify-start hover:bg-secondary"
                href="/setting"
              >
                <Image
                  src="/assets/images/logo.svg"
                  alt="logo"
                  width={30}
                  height={30}
                />
                <span className="hidden 2xl:block">Setting</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="main_content">
        <nav className="flex w-full justify-between h-16 px-4 lg:px-8 2xl:px-16 items-center shadow-lg bg-secondary-light">
          <div>
            <Image
              className="block lg:hidden"
              src="/assets/icons/menu.svg"
              alt="menu"
              width={25}
              height={25}
            />
          </div>
          <div>
            {session && (
              <div className="flex items-center justify-center text-3xl font-Bruno shadow-sm rounded-full bg-secondary-dark text-white h-8 w-8">
                {session.user.name.slice(0, 1)}
              </div>
            )}
          </div>
        </nav>
        <div className="container p-4 lg:p-8 2xl:p-16">{children}</div>
      </div>
    </>
  );
}
