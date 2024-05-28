import Link from "next/link";

export default function Home() {
  return (
    <main className="h-screen flex flex-col items-center justify-center gap-[5vw] lg:gap-[2vw]">
      <h1 className="text-[25vw] lg:text-[12vw] tracking-tight leading-[100%]">
        Shah.
      </h1>
      <p className="text-center font-light text-[3.5vw] lg:text-[1.5vw] tracking-tight leading-[100%]">
        An AI powered chat app which give responses based on your dyamically
        created data.
      </p>
      <Link
        href="/notes"
        className="underline-effect capitalize text-[6vw] lg:text-[3vw] tracking-tight"
      >
        explore
      </Link>
    </main>
  );
}
