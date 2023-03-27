import { type Review, type Business } from "@prisma/client";
import { type NextPage } from "next";
import {useState} from "react"
interface ReviewProps {
  review: Review & {
    business: Business;
  };
}

const ReviewItem: NextPage<ReviewProps> = ({ review }) => {
  const [val, setVal] = useState(0);
  return (
    <div className="flex-1 items-center gap-5">
      <div className="flex flex-col gap-1">
        <p className="text-lg font-semibold">{review.business.name}</p>
        <div className="flex justify-between">
          <p className="text-md font-normal">{review.title}</p>
          <p className="font-semibold text-gray-300">
            {formatDate(review.createdAt)}
          </p>
        </div>
        <p className="text-md font-light">{review.details}</p>
      </div>
      <div className="flex  text-center gap-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="#D5D5D5"
          className="h-6 w-6"
          onClick={() => {
            setVal(val + 1);
          }}
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            strokeWidth="3"
            d="M8.25 6.75L12 3m0 0l3.75 3.75M12 3v18"
          />
        </svg>
        <p className="text-secondary">{val}</p>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="#D5D5D5"
          onClick={() => {
            setVal(val - 1);
          }}
          className="h-6 w-6 fill-gray-300"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            strokeWidth="3"
            d="M15.75 17.25L12 21m0 0l-3.75-3.75M12 21V3"
          />
        </svg>
      </div>
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
      }).substring(0,3)} `;
    } else {
      out = `${hours}h`;
    }
  } else {
    out = `${minutes}m`;
  }
  return out;
}
