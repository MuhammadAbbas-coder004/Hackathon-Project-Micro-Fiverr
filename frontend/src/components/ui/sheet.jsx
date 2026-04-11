import React, { useState, createContext, useContext, useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "../../utils/cn";

const SheetContext = createContext();

export const Sheet = ({ children }) => {
  const [open, setOpen] = useState(false);
  return (
    <SheetContext.Provider value={{ open, setOpen }}>
      {children}
    </SheetContext.Provider>
  );
};

export const SheetTrigger = ({ asChild, children, className }) => {
  const { setOpen } = useContext(SheetContext);
  
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: (e) => {
        if (children.props.onClick) children.props.onClick(e);
        setOpen(true);
      }
    });
  }

  return (
    <div onClick={() => setOpen(true)} className={cn("cursor-pointer inline-block", className)}>
      {children}
    </div>
  );
};

export const SheetContent = ({ className, children, side = "right" }) => {
  const { open, setOpen } = useContext(SheetContext);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const sideClass = side === "right" 
    ? "inset-y-0 right-0 border-l border-border" 
    : "inset-y-0 left-0 border-r border-border";

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={() => setOpen(false)}
      />
      
      {/* Drawer */}
      <div 
        className={cn(
          "fixed z-50 h-full w-[85%] sm:max-w-sm bg-background p-6 shadow-2xl transition-transform transform duration-300 flex flex-col overflow-y-auto",
          sideClass,
          className
        )}
      >
        <button 
          onClick={() => setOpen(false)} 
          className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100"
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </button>
        {children}
      </div>
    </div>
  );
};

export const SheetHeader = ({ className, children }) => (
  <div className={cn("flex flex-col space-y-2 text-left", className)}>
    {children}
  </div>
);

export const SheetTitle = ({ className, children }) => (
  <div className={cn("text-lg font-semibold text-foreground", className)}>
    {children}
  </div>
);

export const SheetClose = ({ asChild, children, className }) => {
  const { setOpen } = useContext(SheetContext);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: (e) => {
        if (children.props.onClick) children.props.onClick(e);
        setOpen(false);
      }
    });
  }

  return (
    <div onClick={() => setOpen(false)} className={cn("cursor-pointer", className)}>
      {children}
    </div>
  );
};
