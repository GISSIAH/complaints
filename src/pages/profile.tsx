import { type NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import ReviewItem from "~/components/review";
import { api } from "~/utils/api";

const Profile: NextPage = () => {
  const { data } = useSession();

  if (data) {
    const { data: reviewData, isLoading } = api.review.getUserReviews.useQuery({
      userId: data?.user.id,
    });
    return (
      <div className="mt-12 mb-12 flex flex-col gap-4 p-4">
        <div className="flex flex-col items-center justify-center gap-2">
          <img
            src={data.user?.image ? data.user?.image : ""}
            className="h-16 w-16 rounded-full"
          />
          <p className="text-center">{data.user?.name}</p>
        </div>
        <div className="flex flex-col">
          <p className="text-xl font-semibold">My Reviews</p>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <div className="flex flex-col gap-4 divide-y p-2">
              {reviewData?.map((review, i) => {
                return <ReviewItem key={i} review={review} />;
              })}
            </div>
          )}
        </div>
      </div>
    );
  } else {
    return (
      <div className="mt-12 mb-12 flex flex-col gap-4 p-4">
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
      </div>
    );
  }
};

export default Profile;
