import { Dialog, Transition } from "@headlessui/react";
import { useState, Dispatch, SetStateAction, Fragment } from "react";
import { NextPage } from "next";
import { useFormik } from "formik";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
interface AddReviewProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const AddReview: NextPage<AddReviewProps> = ({ isOpen, setIsOpen }) => {
  function closeModal() {
    setIsOpen(false);
  }
  const router = useRouter()
  const reviewMutation = api.review.createOne.useMutation();
  const formik = useFormik({
    initialValues: {
      title: "",
      details: "",
      businessNme: "",
    },
    onSubmit: (values) => {
      reviewMutation
        .mutateAsync(values)
        .then((res) => {
          closeModal();
          router.reload()
        })
        .catch((err) => {
          console.log(err);
        });
    },
  });
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
                    <div className="flex flex-col">
                      <label htmlFor="name">Name of Business</label>
                      <input
                        type="text"
                        id="businessNme"
                        onChange={formik.handleChange}
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 "
                        placeholder="AMC Holdings"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label htmlFor="name">Review</label>
                      <textarea
                        id="details"
                        onChange={formik.handleChange}
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 "
                      ></textarea>
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
