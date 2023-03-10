import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { ReactNode, useState } from "react";
import AddReview from "~/components/addReview";
import { NextPage } from "next";
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
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  return (
    <div className="flex min-h-screen flex-col gap-2 ">
      <div className="fixed top-0 left-0 z-50 h-10 w-full border-b py-1 text-center shadow-md bg-white">
        <p className="text-2xl font-bold tracking-wider text-secondary">
          REVIEW EM
        </p>
      </div>
      <div className="">{children}</div>
      <AddReview isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="fixed bottom-16 right-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="white"
          className="h-12 w-12 fill-secondary"
          onClick={() => {
            setIsOpen(true);
          }}
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <div className="fixed bottom-0 left-0 z-50 h-10 w-full border-t border-gray-200 bg-white py-1">
        <div className="flex justify-between gap-2 px-6">
          <div className="flex flex-col">
            <Link href="/">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke={`${
                  router.pathname == "/" ? "#865DFF" : "currentColor"
                }`}
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke={`${
                router.pathname == "/some" ? "#865DFF" : "currentColor"
              }`}
              className={"h-6 w-6"}
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
