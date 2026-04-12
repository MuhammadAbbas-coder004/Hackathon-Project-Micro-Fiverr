import React, { useState, createContext, useContext, useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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

export const SheetContent = ({ className, children, side = "right", hideClose = false }) => {
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

  const getAnimationProps = () => {
    switch (side) {
      case "top":
        return {
          initial: { y: "-100%" },
          animate: { y: 0 },
          exit: { y: "-100%" },
          transition: { type: "spring", damping: 25, stiffness: 200 }
        };
      case "bottom":
        return {
          initial: { y: "100%" },
          animate: { y: 0 },
          exit: { y: "100%" },
          transition: { type: "spring", damping: 25, stiffness: 200 }
        };
      case "left":
        return {
          initial: { x: "-100%" },
          animate: { x: 0 },
          exit: { x: "-100%" },
          transition: { type: "tween", duration: 0.3 }
        };
      case "right":
      default:
        return {
          initial: { x: "100%" },
          animate: { x: 0 },
          exit: { x: "100%" },
          transition: { type: "tween", duration: 0.3 }
        };
    }
  };

  const getSideClasses = () => {
    switch (side) {
      case "top":
        return "inset-x-0 top-0 h-fit border-b border-border";
      case "bottom":
        return "inset-x-0 bottom-0 h-fit border-t border-border";
      case "left":
        return "inset-y-0 left-0 w-[85%] sm:max-w-sm border-r border-border";
      case "right":
      default:
        return "inset-y-0 right-0 w-[85%] sm:max-w-sm border-l border-border";
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={() => setOpen(false)}
          />
          
          {/* Drawer */}
          <motion.div 
            {...getAnimationProps()}
            className={cn(
              "fixed z-[101] bg-background shadow-2xl flex flex-col overflow-hidden",
              getSideClasses(),
              className
            )}
          >
            {!hideClose && (
              <button 
                onClick={() => setOpen(false)} 
                className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 p-2"
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </button>
            )}
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
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
