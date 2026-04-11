import React from "react"
export const DropdownMenu = ({ children }) => <div className="relative group/dropdown inline-block">{children}</div>
export const DropdownMenuTrigger = ({ asChild, children }) => <div className="cursor-pointer">{children}</div>
export const DropdownMenuContent = ({ className, children }) => <div className={`absolute right-0 hidden group-hover/dropdown:block z-50 mt-2 min-w-[8rem] overflow-hidden rounded-md border bg-white p-1 text-gray-800 shadow-md ${className}`}>{children}</div>
export const DropdownMenuItem = ({ className, children, onClick }) => <div onClick={onClick} className={`relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-gray-100 ${className}`}>{children}</div>
export const DropdownMenuLabel = ({ className, children }) => <div className={`px-2 py-1.5 text-sm font-semibold ${className}`}>{children}</div>
export const DropdownMenuSeparator = () => <div className="-mx-1 my-1 h-px bg-gray-200" />
