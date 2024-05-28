"use client";
import React, { useState } from "react";
import { UserButton } from "@clerk/nextjs";
import Dialog from "./Dialog";
import Chat from "./Chat";
import { AnimatePresence, motion } from "framer-motion";

function Navbar() {
  const [openDialog, setOpenDialog] = useState(false);
  const [openChat, setOpenChat] = useState(false);

  return (
    <nav className="py-[2vw] lg:py-[1vw] shadow-sm">
      <div className="w-[95%] mx-auto flex items-center justify-center">
        <div className="flex-[1]">
          <span className="leading-[100%] tracking-tight font-medium text-[10vw] md:text-[5vw] lg:text-[3vw]">
            Shah.
          </span>
        </div>
        <div className="flex-[1] flex items-center justify-end gap-[4vw] lg:gap-[2vw]">
          <span
            onClick={() => setOpenDialog(!openDialog)}
            className="cursor-pointer rounded-full border border-black h-[2.5rem] lg:h-[3vw] w-[2.5rem] lg:w-[3vw] flex items-center justify-center"
          >
            <svg
              className="h-[2rem] lg:w-[2vw] w-[2rem] lg:h-[2vw]"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              ></path>
            </svg>
          </span>
          <span
            onClick={() => setOpenChat(!openChat)}
            className="cursor-pointer  relative rounded-full border border-black h-[2.5rem] lg:h-[3vw] w-[2.5rem] lg:w-[3vw] flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-[2rem] lg:w-[2vw] w-[2rem] lg:h-[2vw]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 6V2H8" />
              <path d="m8 18-4 4V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2Z" />
              <path d="M2 12h2" />
              <path d="M9 11v2" />
              <path d="M15 11v2" />
              <path d="M20 12h2" />
            </svg>
          </span>
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: { avatarBox: { width: "2.5rem", height: "2.5rem" } },
            }}
          />
          <AnimatePresence mode="wait">
            {openDialog && (
              <Dialog setOpenDialog={setOpenDialog} openDialog={openDialog} />
            )}
          </AnimatePresence>
          <AnimatePresence mode="wait">
            {openChat && <Chat openChat={openChat} setOpenChat={setOpenChat} />}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
