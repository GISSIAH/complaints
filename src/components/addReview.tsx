/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Dialog, Transition } from "@headlessui/react";
import { useState,type Dispatch, type SetStateAction, Fragment, useRef } from "react";
import { type NextPage } from "next";
import { useFormik } from "formik";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { type Business } from "@prisma/client";
import storage from "../firebase/firebase.config";
import { getDownloadURL, ref, uploadBytesResumable, type UploadTaskSnapshot } from "firebase/storage";

interface AddReviewProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const AddReview: NextPage<AddReviewProps> = ({ isOpen, setIsOpen }) => {
  function closeModal() {
    setIsOpen(false);
  }
  const [imgSelected, setImgSelected] = useState(false);
  const [selectedImages, setSelectedImages] = useState<
    { url: string; name: string; file: File }[]
  >([]);
  const imageRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [bname, setBName] = useState("");
  const reviewMutation = api.review.createOne.useMutation();
  const imageMutation = api.image.addOne.useMutation()
  const formik = useFormik({
    initialValues: {
      title: "",
      details: "",
      businessNme: "",
    },
    onSubmit: (values) => {
      values.businessNme = bname;
      reviewMutation
        .mutateAsync(values)
        .then((res) => {
          //closeModal();
          uploadImages(selectedImages,res.id)
          
        })
        .catch((err) => {
          console.log(err);
        });
    },
  });

  const uploadImages = (images: {name:string,url:string, file:File}[], id: string) => {
    for (let i = 0; i < images.length; i++) {
      const file = images[i]?.file;
      if (!file) return;
      const storageRef = ref(storage, `/images/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot:UploadTaskSnapshot) => {
          const percent = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          console.log(`uploading ${i} of ${images.length} at percent ${percent}`);
        },
        (err: Error) => console.log(err),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url:string) => {
            if (!id) return;
            const imageObj = {
              name: file.name,
              url: url,
              reviewId: id,
            };
            imageMutation.mutateAsync(imageObj).then(() => {
              if (i + 1 == images.length) {
                // setImageUploadDone(true);
                // setOpen(false);
                closeModal() 
                router.reload();
              }
            }).catch(err=>{
              console.log("image failed to save", err)
            })
          }).catch(err=>{
            console.log(err)
          })
        }
      );
    }
  }
  



  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Review Business
                </Dialog.Title>
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
                    {/* <div className="flex flex-col">
                      <label htmlFor="name">Name of Business</label>
                      <input
                        type="text"
                        id="businessNme"
                        onChange={formik.handleChange}
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 "
                        placeholder="AMC Holdings"
                      />
                    </div> */}
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
                              return (
                                <img
                                  key={i}
                                  src={img.url}
                                  className="h-10 w-10"
                                />
                              );
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
                                for (
                                  let i = 0;
                                  i < e.target.files.length;
                                  i++
                                ) {
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

                  <div className="mt-4">
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AddReview;

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



