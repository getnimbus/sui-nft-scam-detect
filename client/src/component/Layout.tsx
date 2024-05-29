import { FNavbar } from "./Navbar";

export const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <>
      <div className="w-full h-full min-h-[calc(100vh-80px)]">
        {/* header */}
        <FNavbar />

        {/* container */}
        <main
          className={`max-w-screen-xl mx-auto flex flex-col gap-10 items-center justify-between `}
        >
          {children}
        </main>
      </div>
      {/* footer */}
      <footer
        className={`md:pt-10 max-w-screen-xl mx-auto flex items-center justify-center py-4`}
      >
        © {new Date().getUTCFullYear()}{" "}
        <a
          className="ml-1 text-blue-400"
          href="https://getnimbus.io/"
          target="_blank"
        >
          Nimbus, Inc
        </a>
        . All rights reserved.
      </footer>
    </>
  );
};
