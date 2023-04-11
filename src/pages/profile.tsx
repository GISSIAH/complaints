import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import ReviewItem from "~/components/review";
import { api } from "~/utils/api";

const Profile: NextPage = () => {
  const { data } = useSession();
  const router = useRouter();
  
  if (data) {
    const { data: reviewData, isLoading } = api.review.getUserReviews.useQuery({
        userId: data?.user.id,
      });
    return (
      <div className="mt-12 mb-12 flex flex-col gap-4 p-4">
        <div className="flex flex-col items-center justify-center gap-2">
          <img src={data.user?.image ? data.user?.image : ""} className="h-16 w-16 rounded-full" />
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
    return <div>no user found</div>;
  }
};

export default Profile;
