import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      position="top-right"
      closeButton={true}
      expand={true}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-[#0e0e11]/90 group-[.toaster]:backdrop-blur-md group-[.toaster]:text-white group-[.toaster]:border-white/10 group-[.toaster]:shadow-[0_12px_40px_rgba(0,0,0,0.5)] group-[.toaster]:rounded-md group-[.toaster]:p-4 group-[.toaster]:font-sans group-[.toaster]:border-l-4 group-[.toaster]:border-l-zinc-500 transition-all duration-300 hover:group-[.toaster]:shadow-[0_16px_48px_rgba(0,0,0,0.65)] hover:group-[.toaster]:border-white/20",
          title: "font-display font-extrabold uppercase tracking-wider text-xs md:text-sm text-white",
          description: "font-sans text-xs text-white/70 mt-0.5",
          icon: "text-zinc-400 mr-1",
          actionButton: "font-display font-extrabold uppercase tracking-wider text-[10px] bg-primary text-white hover:bg-primary-hover rounded px-3 py-1.5 transition-colors border-none cursor-pointer",
          cancelButton: "font-display font-extrabold uppercase tracking-wider text-[10px] bg-white/10 text-white/90 hover:bg-white/20 rounded px-3 py-1.5 transition-colors border-none cursor-pointer",
          closeButton: "group-[.toast]:bg-white/10 group-[.toast]:text-white group-[.toast]:hover:bg-white/20 group-[.toast]:border-none transition-colors",
          success: "group-[.toaster]:border-l-[#10b981]! [&_svg]:text-[#10b981]!",
          error: "group-[.toaster]:border-l-primary! [&_svg]:text-primary!",
          warning: "group-[.toaster]:border-l-[#f59e0b]! [&_svg]:text-[#f59e0b]!",
          info: "group-[.toaster]:border-l-[#3b82f6]! [&_svg]:text-[#3b82f6]!",
          loading: "group-[.toaster]:border-l-zinc-500! [&_svg]:text-zinc-500!",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };

