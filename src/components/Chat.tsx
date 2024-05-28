import { useUser } from "@clerk/nextjs";
import { Message } from "ai";
import { useChat } from "ai/react";
import Image from "next/image";
import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const bg = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
  exit: {
    opacity: 0,
    transition: { delay: 0.2, duration: 0.3 },
  },
};

const form = {
  initial: { clipPath: "inset(100% 0 0 0)" },
  animate: {
    clipPath: "inset(0)",
    // filter: "blur(8px)",
    transition: {
      type: "tween",
      delay: 0.2,
      duration: 0.3,
      ease: [0.61, 1, 0.88, 1],
    },
  },
  exit: {
    clipPath: "inset(100% 0 0 0)",
    transition: {
      type: "tween",
      duration: 0.3,
      ease: [0.61, 1, 0.88, 1],
    },
  },
};

type Props = {
  openChat: boolean;
  setOpenChat: (value: boolean) => void;
};

function Chat({ openChat, setOpenChat }: Props) {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setMessages,
    isLoading,
    error,
  } = useChat();

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (openChat) {
      inputRef.current?.focus();
    }
  }, [openChat]);

  const lastMessageIsUser = messages[messages.length - 1]?.role === "user";

  return (
    <motion.div
      variants={bg}
      initial="initial"
      animate="animate"
      exit="exit"
      className="fixed z-20 top-0 right-0 h-screen w-full bg-[#00000054] flex items-center justify-center"
    >
      <motion.div
        variants={form}
        className="relative flex bg-white h-[500px] w-[95%] md:w-[50%] lg:w-[50%] 2xl:h-[85vh]  flex-col rounded-md 2xl:rounded-[0.375vw]"
      >
        <button onClick={() => setOpenChat(!openChat)}>
          <svg
            className="cursor-pointer h-5 w-5 2xl:w-[1.5vw] 2xl:h-[1.5vw] absolute top-[2%] left-[1%]"
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
        </button>
        <div
          className="h-full overflow-y-auto m-3 2xl:m-[1.25vw]"
          ref={scrollRef}
        >
          {messages.map((message) => (
            <ChatMessage message={message} key={message.id} />
          ))}
          {isLoading && lastMessageIsUser && (
            <ChatMessage
              message={{
                role: "assistant",
                content: "Thinking...",
              }}
            />
          )}
          {error && (
            <ChatMessage
              message={{
                role: "assistant",
                content:
                  "Something went wrong or you might have exceeded your limit. Please try again in next couple of hours.",
              }}
            />
          )}
          {!error && messages.length === 0 && (
            <div className="flex h-full items-center justify-center font-light lg:text-[1.25vw]">
              Ask the AI a question about your notes.
            </div>
          )}
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex gap-1 lg:gap-[0.5vw] m-3 lg:m-[1.25vw]"
        >
          <button type="button" onClick={() => setMessages([])}>
            <svg
              className="w-5 h-5 2xl:h-[1.5vw] 2xl:w-[1.5vw]"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.5 1C5.22386 1 5 1.22386 5 1.5C5 1.77614 5.22386 2 5.5 2H9.5C9.77614 2 10 1.77614 10 1.5C10 1.22386 9.77614 1 9.5 1H5.5ZM3 3.5C3 3.22386 3.22386 3 3.5 3H5H10H11.5C11.7761 3 12 3.22386 12 3.5C12 3.77614 11.7761 4 11.5 4H11V12C11 12.5523 10.5523 13 10 13H5C4.44772 13 4 12.5523 4 12V4L3.5 4C3.22386 4 3 3.77614 3 3.5ZM5 4H10V12H5V4Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>

          <input
            className="py-[1vw] 2xl:py-[1.25vw] w-[100%] border-b border-b-black outline-none placeholder:2xl:text-[1.25vw] focus:2xl:text-[1.25vw]"
            value={input}
            onChange={handleInputChange}
            placeholder="Ask anything..."
            ref={inputRef}
          />
          <button type="submit">
            <svg
              className="w-5 h-5 2xl:h-[1.5vw] 2xl:w-[1.5vw]"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.20308 1.04312C1.00481 0.954998 0.772341 1.0048 0.627577 1.16641C0.482813 1.32802 0.458794 1.56455 0.568117 1.75196L3.92115 7.50002L0.568117 13.2481C0.458794 13.4355 0.482813 13.672 0.627577 13.8336C0.772341 13.9952 1.00481 14.045 1.20308 13.9569L14.7031 7.95693C14.8836 7.87668 15 7.69762 15 7.50002C15 7.30243 14.8836 7.12337 14.7031 7.04312L1.20308 1.04312ZM4.84553 7.10002L2.21234 2.586L13.2689 7.50002L2.21234 12.414L4.84552 7.90002H9C9.22092 7.90002 9.4 7.72094 9.4 7.50002C9.4 7.27911 9.22092 7.10002 9 7.10002H4.84553Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

function ChatMessage({
  message: { role, content },
}: {
  message: Pick<Message, "role" | "content">;
}) {
  const { user } = useUser();

  const isAiMessage = role === "assistant";

  return (
    <div
      className={`
            "mb-3 flex items-center",
           ${isAiMessage ? "justify-start" : "justify-end"}
          `}
    >
      {isAiMessage && (
        <span className="my-3 2xl:my-[0.5vw] w-fit h-fit p-2 2xl:p-[0.25vw] rounded-full border border-black flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-[2rem] lg:w-[2vw] w-[2rem] lg:h-[2vw]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M12 6V2H8" />
            <path d="m8 18-4 4V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2Z" />
            <path d="M2 12h2" />
            <path d="M9 11v2" />
            <path d="M15 11v2" />
            <path d="M20 12h2" />
          </svg>
        </span>
      )}
      <p
        className={`
              whitespace-pre-line rounded-md 2xl:rounded-[0.375vw] border px-3 py-2 2xl:text-[1vw] 2xl:py-[0.5vw] 2xl:px-[0.75vw]
              ${
                isAiMessage
                  ? "bg-white ml-3 my-3 2xl:ml-[0.5vw] 2xl:my-[0.5vw]"
                  : "bg-[#F4F4F4]"
              }
            `}
      >
        {content}
      </p>
      {!isAiMessage && user?.imageUrl && (
        <Image
          src={user.imageUrl}
          alt="User image"
          width={100}
          height={100}
          className="ml-2 2xl:ml-[0.5vw] 2xl:h-[2.5vw] 2xl:w-[2.5vw] h-10 w-10 rounded-full object-cover"
        />
      )}
    </div>
  );
}

export default Chat;
