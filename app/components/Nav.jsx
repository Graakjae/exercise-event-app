import { Link, NavLink } from "@remix-run/react";
import { AnimatePresence, motion as m } from "framer-motion";
import { useState } from "react";
import Switch from "./Switch";
import useStore from "~/store/useStore";
import { useThemeStore } from "~/store";

export default function Nav() {
  const theme = useStore(useThemeStore, (state) => state.theme);
  const [isOpen, setIsOpen] = useState(false);
  const links = [
    { to: "/events", text: "Events" },
    { to: "/profile", text: "Profile" },
    { to: "/add-event", text: "Add event" },
  ];
  return (
    <nav className="px-[5%] md:mt-6">
      <div className="md:flex justify-between items-center hidden">
        <div className="md:flex items-center gap-10">
          {links.map((link) => (
            <NavLink
              to={link.to}
              key={link.to}
              className={({ isActive }) =>
                `text-[25px] font-bold  ${isActive ? "text-[#635FC7]" : theme === "light" ? "text-black" : "text-white"}`
              }
            >
              {link.text}
            </NavLink>
          ))}
        </div>
        <div className="hidden md:block">
          <Switch />
        </div>
      </div>
      <AnimatePresence>
        <m.button
          whileTap={{ scale: 0.85 }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.3,
            ease: [0, 0.71, 0.2, 1.01],
            scale: {
              type: "spring",
              damping: 7,
              stiffness: 100,
              restDelta: 0.001,
            },
          }}
          onClick={() => setIsOpen(!isOpen)}
          className="fixed flex justify-center items-center right-3 top-3 md:right-8 md:top-8 rounded-full duration-200 h-[65px] w-[65px] md:h-[80px] md:w-[80px] bg-[#635FC7] cursor-pointer z-50 md:hidden"
          name="menu-button"
        >
          <img
            src="/burger-menu-white.png"
            alt="menu"
            className="w-[40px] h-[40px]"
          />
        </m.button>
      </AnimatePresence>
      <AnimatePresence>
        {isOpen && (
          <div className="z-20 ">
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ duration: 0.2, opacity: 0 }}
              className="bg-black/50 inset-0 fixed w-[100svw] "
              onClick={() => setIsOpen(false)}
            />
            <m.aside
              initial={{ x: "100%" }}
              animate={{ x: "0", transition: { delay: 0.2, type: "tween" } }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.2 }}
              className={`w-[98%] md:w-[550px] h-[99%] md:h-[96%] top-[0.5%] right-[1%] md:top-[2%] md:right-[1%] p-8 flex flex-col border-r fixed rounded-lg z-30 overflow-y-auto ${theme === "light" ? "bg-white" : "bg-black"}
                                `}
            >
              <div className="text-center flex-col gap-4 mt-[100px]">
                <Switch />
                {links &&
                  links.map((link, i) => (
                    <div className=" md:mr-[30px] mt-[20px]">
                      <NavLink
                        to={`${link.to}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                          duration: 0.25,
                          delay: i / 10,
                        }}
                        onClick={() => setIsOpen(!isOpen)}
                        className="relative block text-[50px] md:text-[80px] text-[#635FC7] font-extrabold transition-colors duration-200 "
                      >
                        {link.text}
                      </NavLink>
                    </div>
                  ))}
              </div>
            </m.aside>
          </div>
        )}
      </AnimatePresence>
    </nav>
  );
}
