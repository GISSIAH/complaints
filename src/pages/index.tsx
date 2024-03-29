import { type NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
const Home: NextPage = () => {
  const router = useRouter();
  const { data } = useSession();

  useEffect(() => {
    if (data) router.push("/reviews");
  }, [data]);


  return (
    <>
      <Head>
        <title>RATE IT</title>
        <meta name="description" content="A crowdsourced business review platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="mt-12 mb-12 flex flex-col items-center p-4">
        <p className="text-3xl font-bold">Welcome To Rate it</p>
        <p className="text-center text-lg font-normal">
          "a crowdsourced business review platform."
        </p>
        <div className="mt-10 flex flex-col gap-4">
          <button
            className="rounded-md border border-secondary px-3 py-1"
            onClick={() => {
              if (process.env.NEXT_PUBLIC_CALLBACK_URL != "") {
                signIn("google", {
                  callbackUrl: process.env.NEXT_PUBLIC_CALLBACK_URL,
                });
              } else {
                signIn("google", {
                  callbackUrl: "http://localhost:3000/reviews",
                });
              }
            }}
          >
            Login
          </button>
          <Link href={"/reviews"}>
            <button className="rounded-md bg-secondary px-3 py-1 text-white">
              Reviews
            </button>
          </Link>
        </div>
        <p></p>
      </div>
    </>
  );
};

export default Home;
