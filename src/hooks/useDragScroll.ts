import { useEffect, useRef, useState } from "react";

type DragScrollHandlers<T extends HTMLElement> = {
  ref: React.RefObject<T | null>;
  isDragging: boolean;
  onMouseDown: React.MouseEventHandler<T>;
  shouldBlockClick: () => boolean;
};

export const useDragScroll = <T extends HTMLElement>(): DragScrollHandlers<T> => {
  const ref = useRef<T | null>(null);

  const [isDragging, setIsDragging] = useState(false);

  const startX = useRef(0);
  const startScrollLeft = useRef(0);
  const moved = useRef(false);

  const DRAG_THRESHOLD = 6;

  const onMouseDown: React.MouseEventHandler<T> = (e) => {
    const el = ref.current;
    if (!el) return;

    setIsDragging(true);
    moved.current = false;

    startX.current = e.clientX;
    startScrollLeft.current = el.scrollLeft;

    el.style.cursor = "grabbing";
    el.style.userSelect = "none";
  };

  useEffect(() => {
    if (!isDragging) return;

    const el = ref.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const dx = e.clientX - startX.current;

      if (!moved.current && Math.abs(dx) > DRAG_THRESHOLD) {
        moved.current = true;
      }

      el.scrollLeft = startScrollLeft.current - dx;
    };

    const onUp = () => {
      setIsDragging(false);
      // el은 클로저에 잡혀있으니 그대로 써도 되고, 안전하게 ref.current 써도 됨
      el.style.cursor = "grab";
      el.style.userSelect = "";
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [isDragging]);

  const shouldBlockClick = () => moved.current;

  return { ref, isDragging, onMouseDown, shouldBlockClick };
};