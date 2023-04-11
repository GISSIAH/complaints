/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Dialog, Transition } from "@headlessui/react";
import {
  useState,
  type Dispatch,
  type SetStateAction,
  Fragment,
  useRef,
} from "react";
import { type NextPage } from "next";
import { useFormik } from "formik";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { type Business } from "@prisma/client";
import storage from "../firebase/firebase.config";
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
  type UploadTaskSnapshot,
} from "firebase/storage";
import { useSession } from "next-auth/react";

export default function AddReview() {
  const [imgSelected, setImgSelected] = useState(false);
  const [selectedImages, setSelectedImages] = useState<
    { url: string; name: string; file: File }[]
  >([]);
  const imageRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [bname, setBName] = useState("");
  const reviewMutation = api.review.createOne.useMutation();
  const imageMutation = api.image.addOne.useMutation();
  const [voteCount, setVoteCount] = useState(0);
  const { data } = useSession();
  const formik = useFormik({
    initialValues: {
      title: "",
      details: "",
      businessNme: "",
      voteCount: 0,
      userId: "",
    },
    onSubmit: (values) => {
      if (data?.user) {
        if (data?.user.id) {
          values.userId = String(data?.user.id);
        }
      }
      values.businessNme = bname;
      values.voteCount = voteCount;

      reviewMutation
        .mutateAsync(values)
        .then((res) => {
          //closeModal();
          if (selectedImages.length > 0) {
            uploadImages(selectedImages, res.id);
          } else {
            router.push("/");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  });

  const uploadImages = (
    images: { name: string; url: string; file: File }[],
    id: string
  ) => {
    for (let i = 0; i < images.length; i++) {
      const file = images[i]?.file;
      if (!file) return;
      const storageRef = ref(storage, `/images/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot: UploadTaskSnapshot) => {
          const percent = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          console.log(
            `uploading ${i} of ${images.length} at percent ${percent}`
          );
        },
        (err: Error) => console.log(err),
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((url: string) => {
              if (!id) return;
              const imageObj = {
                name: file.name,
                url: url,
                reviewId: id,
              };
              imageMutation
                .mutateAsync(imageObj)
                .then(() => {
                  if (i + 1 == images.length) {
                    // setImageUploadDone(true);
                    // setOpen(false);
                    router.push("/");
                  }
                })
                .catch((err) => {
                  console.log("image failed to save", err);
                });
            })
            .catch((err) => {
              console.log(err);
            });
        }
      );
    }
  };
  return (
    <div className="flex flex-col gap-1 p-6">
      <div className="flex items-center justify-between">
        <p className="text-2xl font-semibold">Review Business</p>
        <button
          onClick={() => {
            router.push("/");
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="#865DFF"
            className="h-8 w-8 fill-secondary"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <form className="mt-6" onSubmit={formik.handleSubmit}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label htmlFor="name">Heading</label>
            <input
              type="text"
              id="title"
              onChange={formik.handleChange}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 "
              placeholder="Misplaced order"
            />
          </div>
          <AutoCompleteField bname={bname} setBName={setBName} />
          <div className="flex flex-col">
            <label htmlFor="name">Review</label>
            <textarea
              id="details"
              onChange={formik.handleChange}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 "
            ></textarea>
          </div>
          <div className="flex h-28 w-full items-center justify-center rounded-sm border border-gray-200 bg-gray-50 px-2 py-1">
            {imgSelected && selectedImages ? (
              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-3 gap-2">
                  {selectedImages.map((img, i) => {
                    return <img key={i} src={img.url} className="h-10 w-10" />;
                  })}
                </div>
                <button
                  className="rounded-md border border-gray-200 px-3"
                  onClick={(e) => {
                    e.preventDefault();
                    setImgSelected(false);
                    setSelectedImages([]);
                  }}
                >
                  Clear
                </button>
              </div>
            ) : (
              <div>
                <input
                  ref={imageRef}
                  type="file"
                  multiple={true}
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files) {
                      for (let i = 0; i < e.target.files.length; i++) {
                        const f = e.target.files[i];
                        if (f) {
                          console.log(f);
                          const newImgUrl = URL.createObjectURL(f);
                          if (selectedImages) {
                            selectedImages.push({
                              url: newImgUrl,
                              name: f.name,
                              file: f,
                            });
                          } else {
                            console.log("we cant");
                          }
                        }
                      }
                    }

                    setImgSelected(true);
                  }}
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    if (imageRef.current) imageRef.current.click();
                  }}
                  className="h-10 rounded-md bg-gray-100 px-3"
                >
                  Upload Images
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center gap-1">
          <div className="mt-3 flex justify-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="#D3D3D3"
              className={`h-8 w-8 ${1 <= voteCount ? "fill-secondary" : ""}`}
              onClick={() => {
                setVoteCount(1);
              }}
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
              />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="#D3D3D3"
              className={`h-8 w-8 ${2 <= voteCount ? "fill-secondary" : ""}`}
              onClick={() => {
                setVoteCount(2);
              }}
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
              />
            </svg>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="#D3D3D3"
              className={`h-8 w-8 ${3 <= voteCount ? "fill-secondary" : ""}`}
              onClick={() => {
                setVoteCount(3);
              }}
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
              />
            </svg>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="#D3D3D3"
              className={`h-8 w-8 ${4 <= voteCount ? "fill-secondary" : ""}`}
              onClick={() => {
                setVoteCount(4);
              }}
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
              />
            </svg>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="#D3D3D3"
              className={`h-8 w-8 ${5 <= voteCount ? "fill-secondary" : ""}`}
              onClick={() => {
                setVoteCount(5);
              }}
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
              />
            </svg>
          </div>
          <p className="font-light text-gray-400">Overall Rating out of 5</p>
        </div>

        <div className="mt-4 flex justify-center">
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-secondary px-4 py-2 text-sm font-medium text-white hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

const AutoCompleteField: NextPage<{
  bname: string;
  setBName: Dispatch<SetStateAction<string>>;
}> = ({ bname, setBName }) => {
  const { data, isLoading } = api.business.getAll.useQuery();
  const [autoOpen, setAutoOpen] = useState(false);
  const [matches, setMatches] = useState<Business[] | undefined>();

  if (isLoading) return <p>Loading...</p>;
  return (
    <div className="flex flex-col">
      <label htmlFor="name">Name of Business</label>
      <input
        type="text"
        id="businessNme"
        value={bname}
        onChange={(e) => {
          setBName(e.target.value);
          if (e.target.value.length > 1) {
            setAutoOpen(true);
          } else {
            setAutoOpen(false);
          }
          //const regex = new RegExp(bname, "i");
          if (data) {
            const startWith = data.filter((business) =>
              business.name
                .toLocaleLowerCase()
                .startsWith(e.target.value.toLocaleLowerCase())
            );

            const wordsMatch = data.filter((business) =>
              business.name
                .toLocaleLowerCase()
                .includes(e.target.value.toLocaleLowerCase())
            );

            const allResults = [...startWith, ...wordsMatch];

            const uniqueResults = Array.from(new Set([...allResults]));

            //setMatches(uniqueResults)
            setMatches(uniqueResults);
          }
        }}
        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 "
        placeholder="AMC Holdings"
      />
      {autoOpen ? (
        <ul className="rounded-sm bg-gray-50 px-2 py-1 shadow-md">
          {matches?.map((match, i) => (
            <p
              key={i}
              onClick={() => {
                setBName(match.name);
                setAutoOpen(false);
              }}
            >
              {match.name}
            </p>
          ))}
        </ul>
      ) : null}
    </div>
  );
};
