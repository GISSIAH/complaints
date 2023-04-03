import { type Review } from "@prisma/client";
import  { useState } from "react";
import  { ImageContainer, formatDate } from "~/components/review";
import { api } from "~/utils/api";

export default function Search() {
  const [search, setSearch] = useState("");
  const [fieldValue, setFieldValue] = useState("");

  const { data, isLoading, refetch } = api.review.searchByBusiness.useQuery({
    businessName: search,
  });
  return (
    <div className="mt-10 mb-10 flex flex-col p-3">
      <div className="flex w-full items-center gap-3">
        <input
          placeholder="Search by business name"
          className="h-9 w-full rounded-md border border-gray-300 bg-gray-100 px-3"
          onChange={(e) => {
            setFieldValue(e.target.value);
          }}
          value={fieldValue}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="#865DFF"
          className="h-6 w-6"
          onClick={() => {
            setSearch(fieldValue);
          }}
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </div>

      {data != null ? (
        <div className="flex flex-col gap-4 divide-y p-2">
          {data?.reviews.map((review, i) => {
            return (
              <div key={i} className="flex-1 items-center gap-5">
                <div className="flex flex-col gap-1 py-2">
                  {review.images && review.images.length > 0 ? (
                    <ImageContainer images={review.images} />
                  ) : null}
                  <div className="flex justify-between">
                    <p className="text-md font-normal">{review.title}</p>
                    <p className="font-semibold text-gray-300">
                      {formatDate(review.createdAt)}
                    </p>
                  </div>
                  <p className="text-md font-light">{review.details}</p>
                </div>
                
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-20 flex items-center justify-center">
          <p>No search results</p>
        </div>
      )}
    </div>
  );
}
