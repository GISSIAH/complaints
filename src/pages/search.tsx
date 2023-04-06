import { useState } from "react";
import { ImageContainer, formatDate } from "~/components/review";
import { api } from "~/utils/api";

export default function Search() {
  const [search, setSearch] = useState("");
  const [fieldValue, setFieldValue] = useState("");

  const { data } = api.review.searchByBusiness.useQuery({
    businessName: search,
  });
  return (
    <div className="mt-12 mb-12 flex flex-col p-3">
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
      {data?.id != null ? (
        <div className="flex flex-col p-2">
          <p className="text-xl font-bold">{data.name}</p>
          <div className="flex gap-2">
            <span className="flex items-center gap-1 text-lg text-gray-400">
              {data.rating}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="#865DFF"
                className={`h-4 w-4`}
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                />
              </svg>
            </span>
            <p className="text-lg text-gray-400">{`${data.reviews?.length.toString()} Votes`}</p>
          </div>
        </div>
      ) : null}
      {data?.id != null ? (
        <div className="flex flex-col gap-4 divide-y p-2">
          {data.reviews &&
            data.reviews.map((review, i) => {
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
