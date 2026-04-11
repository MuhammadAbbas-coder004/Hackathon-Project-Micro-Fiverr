import React from "react"
export const TooltipProvider = ({ children }) => <>{children}</>
export const Tooltip = ({ children }) => <div className="relative group inline-block">{children}</div>
export const TooltipTrigger = ({ asChild, children }) => <>{children}</>
export const TooltipContent = ({ className, children, side }) => <div className={`absolute hidden group-hover:block z-50 rounded-md border bg-black text-white px-3 py-1.5 text-sm shadow-md mt-2 ${className}`}>{children}</div>
