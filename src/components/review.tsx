import { type Review } from "@prisma/client";
import { type NextPage } from "next";
interface ReviewProps {
  review: Review;
}

const ReviewItem: NextPage<ReviewProps> = ({ review }) => {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between">
        <p className="text-xl font-semibold">{review.title}</p>
        <p className="text-gray-300 font-semiboldy">{formatDate(review.createdAt)}</p>
      </div>
      <p className="text-md font-light">{review.details}</p>
    </div>
  );
};

export default ReviewItem;

function formatDate(date: Date) {
  let out = "";
  const now = Date.now();

  const reviewMs = date.getTime();

  const diff = now - reviewMs;

  const minutes = Math.floor(diff / 60000);

  if (minutes > 59) {
    const hours = Math.floor(minutes / 60);
    if (hours > 23) {
      out = `${date.getDate()} ${date.toLocaleString("en-US", {
        month: "long",
      })} ${date.getFullYear()} }`;
    } else {
      out = `${hours}h`;
    }
  } else {
    out = `${minutes}m`;
  }
  return out;
}
