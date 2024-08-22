import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";

export function PopoverMenu({ button, Menu }) {
  return (
    <Popover className="absolute right-0">
      <PopoverButton>{button}</PopoverButton>
      <PopoverPanel anchor="bottom end" className="flex flex-col">
        {Menu}
      </PopoverPanel>
    </Popover>
  );
}
