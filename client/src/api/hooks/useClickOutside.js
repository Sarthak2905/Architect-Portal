import { useEffect, useRef } from "react";

/**
 * Returns a ref to attach to the menu/dropdown container. Calling
 * onOutsideClick whenever a click lands outside that container — used
 * to close dropdown menus (the ⋮ card menus, comboboxes) automatically.
 */
export const useClickOutside = (onOutsideClick) => {
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onOutsideClick();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onOutsideClick]);

  return ref;
};
