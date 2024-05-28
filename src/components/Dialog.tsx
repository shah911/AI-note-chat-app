import { CreateNoteSchema, createNoteSchema } from "@/lib/validation/note";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Loader from "./Loader";
import { motion } from "framer-motion";

type Props = {
  openDialog: boolean;
  setOpenDialog: (value: boolean) => void;
};

const bg = {
  initial: { clipPath: "inset(0 0 0 100%)" },
  animate: {
    clipPath: "inset(0)",
    transition: { type: "tween", duration: 0.75, ease: [0.61, 1, 0.88, 1] },
  },
  exit: {
    clipPath: "inset(0 0 0 100%)",
    transition: { type: "tween", duration: 0.75, ease: [0.61, 1, 0.88, 1] },
  },
};

const form = {
  initial: { opacity: 0, scale: 0.8 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { delay: 0.3, duration: 0.3 },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: { duration: 0.3 },
  },
};

function Dialog({ openDialog, setOpenDialog }: Props) {
  const [noteCreation, setNoteCreation] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof createNoteSchema>>({
    resolver: zodResolver(createNoteSchema),
  });

  async function onSubmit(input: CreateNoteSchema) {
    setNoteCreation(true);
    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        body: JSON.stringify(input),
      });
      if (response.status === 429)
        return alert("You can't create more than 4 notes.");
      if (!response.ok) throw Error("Status code: " + response.status);
      router.refresh();
      setOpenDialog(false);
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setNoteCreation(false);
    }
  }

  return (
    <motion.div
      variants={bg}
      initial="initial"
      animate="animate"
      exit="exit"
      className="fixed top-0 right-0 z-20 h-screen w-full bg-[#00000054] flex items-center justify-center"
    >
      <motion.form
        variants={form}
        onSubmit={handleSubmit(onSubmit)}
        className="relative flex flex-col items-center justify-evenly h-[500px] md:h-[600px] lg:h-[500px] 2xl:h-[85%] w-[95%] md:w-[70%] lg:w-[50%] rounded-md 2xl:rounded-[0.375vw] bg-white"
      >
        <svg
          onClick={() => setOpenDialog(!openDialog)}
          className="cursor-pointer h-5 w-5 2xl:w-[1.5vw] 2xl:h-[1.5vw] absolute top-[5%] right-[5%]"
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
        </svg>
        <h1 className="capitalize font-semibold text-[7vw] md:text-[5vw] lg:text-[2.5vw] tracking-tight leading-[100%]">
          publish note
        </h1>
        <div className="flex flex-col w-[95%] md:w-[90%] lg:w-[75%] gap-[0.5vw]">
          <label
            className="capitalize font-medium text-[3.5vw] lg:text-[1.5vw]"
            htmlFor="title"
          >
            Title
          </label>
          <input
            id="title"
            className="h-[30px] 2xl:h-[5vh] w-[100%]  border-b border-b-black outline-none focus:2xl:text-[1.5vw] transition-colors focus:border-blue-500"
            type="text"
            {...register("title")}
          />
          {errors.title && (
            <span className="capitalize text-red-500 text-xs font-[500] 2xl:text-[0.9vw]">
              {errors.title?.message}
            </span>
          )}
        </div>
        <div className="flex flex-col w-[95%] md:w-[90%] lg:w-[75%] gap-[1.5vw]">
          <label
            className="capitalize font-medium text-[3.5vw] lg:text-[1.5vw]"
            htmlFor="content"
          >
            content
          </label>
          <textarea
            id="content"
            className="w-[100%] rounded-md 2xl:rounded-[0.375vw] border border-black outline-none h-[200px] 2xl:h-[15vw] focus:2xl:text-[1.5vw] transition-colors focus:border-blue-500"
            {...register("content")}
          />
          {errors.content && (
            <span className="capitalize text-red-500 text-xs font-[500] 2xl:text-[0.9vw]">
              {errors.content?.message}
            </span>
          )}
        </div>
        {noteCreation ? (
          <Loader />
        ) : (
          <button
            type="submit"
            className="uppercase 2xl:text-[1.2vw] 2xl:px-[1.5vw] 2xl:py-[0.5vw] border border-black rounded-full px-4 py-1 transition-all duration-300 hover:bg-black hover:text-white"
          >
            done
          </button>
        )}
      </motion.form>
    </motion.div>
  );
}

export default Dialog;
