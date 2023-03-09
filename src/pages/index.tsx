import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import ReviewItem from "~/components/review";

import { api } from "~/utils/api";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col p-4 mt-10">
        <p className="text-3xl font-semibold text-primary">Latest Reviews</p>
        <LatestReviews />
      </div>
    </>
  );
};

export default Home;

function LatestReviews() {
  const { data, isLoading } = api.review.getRecent.useQuery();

  if (isLoading) {
    return <p className="font-light text-gray-700">Loading recents...</p>;
  }

  return (
    <div className="flex flex-col divide-y p-2 gap-4">
      {data?.map((review, i) => {
        return <ReviewItem key={i} review={review} />;
      })}
    </div>
  );
}
