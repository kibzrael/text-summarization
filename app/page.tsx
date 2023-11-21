"use client";

import { useState } from "react";

export default function Home() {
  const [summarized, setSummarized] = useState<string>();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append("key", process.env.NEXT_PUBLIC_MEANINGCLOUD_KEY ?? "");
    formData.append("lang", "auto");
    const data = Object.fromEntries(formData.entries());
    console.log(data);

    const requestOptions = {
      method: "POST",
      body: formData,
    };

    fetch("https://api.meaningcloud.com/summarization-1.0", requestOptions)
      .then(async (response) => ({
        status: response.status,
        body: await response.json(),
      }))
      .then(({ status, body }) => setSummarized(body.summary))
      .catch((error) => console.log("error", error));
  };

  return (
    <main className="w-full min-h-screen bg-white text-black px-8 py-4">
      <h1 className="text-5xl font-bold text-center p-8">Text Summarization</h1>
      <form
        className="flex flex-col gap-8 mt-4 mb-8 max-w-5xl mx-auto"
        onSubmit={handleSubmit}>
        <div className="flex gap-8">
          <h3 className="text-xl font-medium flex-1">Text source:</h3>
          <div className="flex flex-col gap-4 flex-[7]">
            <textarea placeholder="Text" rows={5} name="txt"></textarea>
            <input
              type="file"
              name="doc"
              placeholder="Document"
              accept="application/pdf"
            />
            <input type="url" name="url" placeholder="Url" />
          </div>
        </div>

        <div className="flex gap-8 items-center">
          <h3 className="text-xl font-medium flex-1">Sentences:</h3>
          <input
            type="number"
            name="sentences"
            defaultValue={10}
            placeholder="Sentences"
            className=" flex-[7]"
          />
        </div>

        <button className="bg-orange-500 text-white px-8 py-3 rounded">
          Summarize
        </button>
      </form>
      <section
        className="flex flex-col gap-6 rounded-2xl bg-orange-200 px-8 py-6 max-w-5xl mx-auto"
        style={{
          opacity: summarized ? 1 : 0,
          transition: "opacity 1s ease-in-out",
        }}>
        <h3 className="text-2xl font-semibold text-orange-700">
          <img
            src="/sparkle.svg"
            alt="Sparkle"
            style={{ height: "1em", display: "inline", marginRight: "1rem" }}
          />{" "}
          Summarized text
        </h3>
        {summarized}
      </section>
    </main>
  );
}
