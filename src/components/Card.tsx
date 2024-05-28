"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Loader from "./Loader";
import Dialog from "./Dialog";
import Edit from "./Edit";

type Props = {
  data: {
    id: string;
    userId: string;
    title: string;
    content: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
};

function Card({ data }: Props) {
  const router = useRouter();
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const [open, setOpen] = useState(false);

  async function deleteNote(noteId: string) {
    setDeleteInProgress(true);
    try {
      const response = await fetch("/api/notes", {
        method: "DELETE",
        body: JSON.stringify({
          id: noteId,
        }),
      });
      if (!response.ok) throw Error("Status code: " + response.status);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setDeleteInProgress(false);
    }
  }

  return (
    <div>
      {deleteInProgress && (
        <div className="fixed top-0 left-0 z-20 h-screen w-full flex items-center justify-center bg-[#00000054]">
          <Loader />
        </div>
      )}
      <AnimatePresence mode="wait">
        {open && <Edit setOpenDialog={setOpen} openDialog={open} data={data} />}
      </AnimatePresence>
      <motion.svg
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 1 } }}
        onClick={() => {
          deleteNote(data.id);
        }}
        className="cursor-pointer h-5 w-5 2xl:w-[1.5vw] 2xl:h-[1.5vw] ml-auto my-2 2xl:my-[0.5vw]"
        viewBox="0 0 15 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12.8536 2.85355C13.0488 2.65829 13.0488 2.34171 12.8536 2.14645C12.6583 1.95118 12.3417 1.95118 12.1464 2.14645L7.5 6.79289L2.85355 2.14645C2.65829 1.95118 2.34171 1.95118 2.14645 2.14645C1.95118 2.34171 1.95118 2.65829 2.14645 2.85355L6.79289 7.5L2.14645 12.1464C1.95118 12.3417 1.95118 12.6583 2.14645 12.8536C2.34171 13.0488 2.65829 13.0488 2.85355 12.8536L7.5 8.20711L12.1464 12.8536C12.3417 13.0488 12.6583 13.0488 12.8536 12.8536C13.0488 12.6583 13.0488 12.3417 12.8536 12.1464L8.20711 7.5L12.8536 2.85355Z"
          fill="currentColor"
          fillRule="evenodd"
          clipRule="evenodd"
        ></path>
      </motion.svg>
      <div
        onClick={() => {
          setOpen(true);
        }}
        className="transition-all duration-300 hover:shadow-2xl hover:scale-105"
      >
        <motion.div
          initial={{ clipPath: "inset(100% 0 0 0)" }}
          animate={{
            clipPath: "inset(0)",
            transition: {
              delay: 0.3,
              duration: 0.75,
              ease: [0.45, 0, 0.55, 1],
            },
          }}
          className="relative cursor-pointer border border-black rounded-md 2xl:rounded-[0.375vw] 2xl:h-[45vh] w-[95vw] md:w-[45vw] lg:w-[22.5vw] h-[250px] flex flex-col items-center justify-center"
        >
          <h2 className="h-[20%] tracking-tight leading-[100%] flex items-center justify-center lg:text-[1.75vw] font-medium uppercase">
            {data.title}
          </h2>
          <hr className="w-[90%]" />
          <p className="text-sm capitalize tracking-tight leading-[100%] 2xl:text-[1vw] h-[80%] w-[90%] mx-auto flex items-center justify-center text-justify">
            {data.content}
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default Card;
