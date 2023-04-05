import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { type ReactNode, useState } from "react";
import AddReview from "~/components/addReview";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import Link from "next/link";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
};

export default api.withTRPC(MyApp);

interface LayoutProps {
  children: ReactNode;
}

const Layout: NextPage<LayoutProps> = ({ children }) => {
  const router = useRouter();

  if (router.pathname === "/add-review") return <NoNav>{children}</NoNav>;
  else return <FullNavigation>{children}</FullNavigation>;
};

const NoNav: NextPage<LayoutProps> = ({ children }) => {
  return <div className="flex min-h-screen flex-col gap-2 ">{children}</div>;
};

const FullNavigation: NextPage<LayoutProps> = ({ children }) => {
  const router = useRouter();
  return (
    <div className="flex min-h-screen flex-col gap-2 ">
      <TopBar />
      <div className="">{children}</div>
      <div className="fixed bottom-16 right-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="white"
          className="h-12 w-12 fill-secondary"
          onClick={() => {
            router.push("/add-review");
          }}
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <BottomBar />
    </div>
  );
};

const TopBar: NextPage = () => {
  return (
    <div className="fixed top-0 left-0 z-50 h-12 w-full border-b bg-white py-1 text-center shadow-md">
      <p className="text-2xl font-bold tracking-wider text-secondary">
        RATE IT
      </p>
    </div>
  );
};

const BottomBar: NextPage = () => {
  const router = useRouter();
  return (
    <div className="fixed bottom-0 left-0 z-50 h-14 w-full border-t border-gray-200 bg-white py-2">
      <div className="flex justify-between gap-2 px-6">
        <div className="flex flex-col">
          <Link href="/">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke={`${router.pathname == "/" ? "#865DFF" : "currentColor"}`}
              className={`h-6 w-6`}
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
          </Link>
        </div>
        {/* <div className="flex flex-col">
            <Link href="/charts">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke={`${
                  router.pathname == "/charts" ? "#865DFF" : "currentColor"
                }`}
                className={"h-6 w-6"}
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z"
                />
              </svg>
            </Link>
          </div> */}
        <div className="flex flex-col">
          <Link href="/search">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke={`${
                router.pathname == "/search" ? "#865DFF" : "currentColor"
              }`}
              className={`h-6 w-6`}
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </Link>
        </div>
        <div className="flex flex-col">
          <Link href="/profile">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke={`${
                router.pathname == "/some" ? "#865DFF" : "currentColor"
              }`}
              className="h-6 w-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};
