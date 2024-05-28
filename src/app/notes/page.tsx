import Navbar from "@/components/Navbar";
import Card from "@/components/Card";
import prisma from "@/lib/db/prisma";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Shah. - Notes",
};

async function Notes() {
  const { userId } = auth();

  if (!userId) throw Error("userId undefined");

  const allNotes = await prisma.note.findMany({ where: { userId } });
  return (
    <>
      <Navbar />
      <section className="w-[95%] mx-auto flex flex-wrap items-center justify-center gap-4 2xl:gap-[1vw] my-20 2xl:my-[5vw]">
        {allNotes.map((item, i) => (
          <Card key={i} data={item} />
        ))}
        {allNotes.length === 0 && (
          <div className="text-center font-light 2xl:text-[1vw]">
            {"You currently have no notes."}
          </div>
        )}
      </section>
    </>
  );
}

export default Notes;
