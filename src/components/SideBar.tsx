import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import {
  ChevronUpIcon,
  Cog8ToothIcon,
  UserIcon,
} from "@heroicons/react/20/solid";
import {
  HomeIcon,
  TicketIcon,
  Square2StackIcon,
} from "@heroicons/react/24/outline";
import LogoWhite from "../assets/LogoWhite-removebg.svg";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col">
        {/* Header */}
        <div className="">
          <Menu as="div" className="relative">
            <Menu.Button className="w-full flex items-center justify-between px-3 h-20">
              <div className="flex items-center gap-3">
                <div className="h-24 w-24">
                    <img
                        src={LogoWhite}
                        alt="Logo"
                        className="h-full w-full object-cover"
                    />
                </div>
                 {/* <span className="font-medium"><span className="khmer-font">បាយ</span>-Canteen</span> */}
            </div>
            </Menu.Button>
            
          </Menu>
        </div>

        {/* Body */}
        <div className="flex-1 p-4 pt-1 overflow-y-auto">
          <a
            href="/dashboard"
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100"
          >
            <HomeIcon className="w-5 h-5" />
            Dashboard
          </a>
          <a
            href="/events"
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100"
          >
            <Square2StackIcon className="w-5 h-5" />
            Menu Management
          </a>
          <a
            href="/orders"
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100"
          >
            <TicketIcon className="w-5 h-5" />
            Food For Voters
          </a>
        </div>

        {/* Footer */}
        <div className="p-4 border-t">
          <Menu as="div" className="relative">
            <Menu.Button className="w-full flex items-center justify-between px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200">
              <div className="flex items-center gap-2">
                <img
                  src="/profile-photo.jpg"
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <p className="text-sm font-medium">Erica</p>
                  <p className="text-xs text-gray-500">erica@example.com</p>
                </div>
              </div>
              <ChevronUpIcon className="w-5 h-5" />
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
            </Transition>
          </Menu>
        </div>
      </aside>
    </div>
  );
}