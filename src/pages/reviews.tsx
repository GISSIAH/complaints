
import { type NextPage } from "next";
import Head from "next/head";
import ReviewItem from "~/components/review";

import { api } from "~/utils/api";

const Reviews: NextPage = () => {
  return (
    <>
      <Head>
        <title>Rate It</title>
        <meta name="description" content="a crowdsourced business review platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col p-4 mt-12 mb-12">
        <p className="text-3xl font-semibold text-primary">Latest Reviews</p>
        <LatestReviews />
      </div>
    </>
  );
};

export default Reviews;

function LatestReviews() {
  const { data, isLoading } = api.review.getRecent.useQuery();
  //testing testt
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

