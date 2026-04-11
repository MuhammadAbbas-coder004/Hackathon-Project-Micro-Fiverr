import React from "react"
export const Avatar = ({ className, children }) => <div className={`relative flex shrink-0 overflow-hidden rounded-full ${className}`}>{children}</div>
export const AvatarImage = ({ src, className }) => src ? <img src={src} className={`aspect-square h-full w-full ${className}`} /> : null
export const AvatarFallback = ({ className, children }) => <div className={`flex h-full w-full items-center justify-center rounded-full bg-muted ${className}`}>{children}</div>
