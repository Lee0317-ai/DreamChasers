import { useCallback, useRef, useState } from "react";

type Point = {
  x: number;
  y: number;
};

type DragState = {
  origin: Point;
  startPan: Point;
};

export function useCanvasPan() {
  const [pan, setPan] = useState<Point>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<DragState | null>(null);

  const resetPan = useCallback(() => {
    dragRef.current = null;
    setPan({ x: 0, y: 0 });
    setIsDragging(false);
  }, []);

  const setCanvasPan = useCallback((nextPan: Point) => {
    dragRef.current = null;
    setPan(nextPan);
    setIsDragging(false);
  }, []);

  const beginPan = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (event.button !== 0) {
        return;
      }

      event.currentTarget.setPointerCapture(event.pointerId);
      dragRef.current = {
        origin: { x: event.clientX, y: event.clientY },
        startPan: pan
      };
      setIsDragging(true);
    },
    [pan]
  );

  const movePan = useCallback((event: React.PointerEvent<HTMLElement>) => {
    const drag = dragRef.current;

    if (!drag) {
      return;
    }

    setPan({
      x: drag.startPan.x + event.clientX - drag.origin.x,
      y: drag.startPan.y + event.clientY - drag.origin.y
    });
  }, []);

  const endPan = useCallback((event: React.PointerEvent<HTMLElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    dragRef.current = null;
    setIsDragging(false);
  }, []);

  return {
    isDragging,
    pan,
    panHandlers: {
      onPointerCancel: endPan,
      onPointerDown: beginPan,
      onPointerLeave: endPan,
      onPointerMove: movePan,
      onPointerUp: endPan
    },
    resetPan,
    setCanvasPan
  };
}
