import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";

export function Modal({
  button,
  children,
  className,
  setIsOpen,
  isOpen,
  addOverlay = true,
  id,
}) {
  return (
    <div>
      <div>{button}</div>
      <Dialog
        transition
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className={`relative z-50 transition duration-300 ease-out data-[closed]:opacity-0`}
      >
        {addOverlay ? (
          <DialogBackdrop className="fixed inset-0 bg-black/70 duration-300 ease-out data-[closed]:opacity-0" />
        ) : (
          ""
        )}

        <div className="fixed inset-0 flex items-center justify-center ">
          <DialogPanel
            className={`space-y-4  duration-300 ease-out data-[closed]:scale-95 data-[closed]:opacity-0  ${className}`}
          >
            {children}
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
}
