import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start max-w-xl">

        <h1 className="text-3xl font-bold text-center sm:text-left">
          Welcome to Gawe App Beta
        </h1>
        <p className="text-base text-center sm:text-left text-gray-700 dark:text-gray-300">
          Gawe App is a collection application currently in beta testing, designed to provide a global menu for various useful tools. Our goal is to offer a friendly and efficient experience for users to access multiple features in one place.
        </p>
        <p className="text-base text-center sm:text-left text-gray-700 dark:text-gray-300">
          The application currently contains the following menus:
        </p>
        <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)] mb-4">
          <li className="mb-2 tracking-[-.01em]">
            <a href="/antrian" className="font-semibold underline hover:text-blue-600 transition-colors">
              Antrian
            </a>
            &nbsp;– Manage and monitor queues efficiently.
          </li>
          <li className="mb-2 tracking-[-.01em]">
            <a href="/note" className="font-semibold underline hover:text-blue-600 transition-colors">
              Note
            </a>
            &nbsp;– Create and organize your notes with ease.
          </li>
          <li className="mb-2 tracking-[-.01em]">
            <a href="/smallest-ratio" className="font-semibold underline hover:text-blue-600 transition-colors">
              Smallest Ratio
            </a>
            &nbsp;– Calculate and find the smallest ratio for your data.
          </li>
          <li className="mb-2 tracking-[-.01em]">
            <a href="/blog" className="font-semibold underline hover:text-blue-600 transition-colors">
              Blog
            </a>
            &nbsp;– Read and share articles or updates.
          </li>
        </ol>
        {/* <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="#"
            tabIndex={-1}
            aria-disabled="true"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="#"
            tabIndex={-1}
            aria-disabled="true"
          >
            Read our docs
          </a>
        </div> */}
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} Gawe App. All rights reserved.
        </span>
      </footer>
    </div>
  );
}
