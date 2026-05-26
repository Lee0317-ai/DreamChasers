import { useCallback, useRef, useState } from "react";

export type CropRatio = "自由" | "1:1" | "4:3" | "16:9" | "3:4" | "9:16";
export type CropResizeHandle = "n" | "e" | "s" | "w" | "ne" | "se" | "sw" | "nw";

type Point = {
  x: number;
  y: number;
};

export type CropRect = {
  height: number;
  left: number;
  top: number;
  width: number;
};

type CropDragState =
  | {
      bounds: { height: number; width: number };
      origin: Point;
      rect: CropRect;
      type: "move";
    }
  | {
      bounds: { height: number; width: number };
      handle: CropResizeHandle;
      origin: Point;
      rect: CropRect;
      type: "resize";
    };

const initialRect: CropRect = {
  height: 72,
  left: 14,
  top: 14,
  width: 72
};

const minSize = 16;
const ratioValue: Record<Exclude<CropRatio, "自由">, number> = {
  "1:1": 1,
  "3:4": 3 / 4,
  "4:3": 4 / 3,
  "9:16": 9 / 16,
  "16:9": 16 / 9
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function moveRect(rect: CropRect, deltaX: number, deltaY: number): CropRect {
  return {
    ...rect,
    left: clamp(rect.left + deltaX, 0, 100 - rect.width),
    top: clamp(rect.top + deltaY, 0, 100 - rect.height)
  };
}

function resizeRect(rect: CropRect, handle: CropResizeHandle, deltaX: number, deltaY: number): CropRect {
  const next = { ...rect };

  if (handle.includes("e")) {
    next.width = clamp(rect.width + deltaX, minSize, 100 - rect.left);
  }

  if (handle.includes("s")) {
    next.height = clamp(rect.height + deltaY, minSize, 100 - rect.top);
  }

  if (handle.includes("w")) {
    const left = clamp(rect.left + deltaX, 0, rect.left + rect.width - minSize);
    next.width = rect.width + rect.left - left;
    next.left = left;
  }

  if (handle.includes("n")) {
    const top = clamp(rect.top + deltaY, 0, rect.top + rect.height - minSize);
    next.height = rect.height + rect.top - top;
    next.top = top;
  }

  return next;
}

function centerRect(width: number, height: number): CropRect {
  return {
    height,
    left: (100 - width) / 2,
    top: (100 - height) / 2,
    width
  };
}

function fitRectToRatio(ratio: Exclude<CropRatio, "自由">): CropRect {
  const aspect = ratioValue[ratio];
  const maxWidth = 72;
  const maxHeight = 72;
  const width = aspect >= 1 ? maxWidth : maxHeight * aspect;
  const height = aspect >= 1 ? maxWidth / aspect : maxHeight;

  return centerRect(width, height);
}

function pointerDeltaPercent(event: React.PointerEvent<HTMLElement>, origin: Point, bounds: { height: number; width: number }) {
  return {
    x: ((event.clientX - origin.x) / bounds.width) * 100,
    y: ((event.clientY - origin.y) / bounds.height) * 100
  };
}

function getCanvasBounds(element: HTMLElement) {
  return element.closest("[data-photo-canvas]")?.getBoundingClientRect() ?? element.getBoundingClientRect();
}

export function useCropBox(initialRatio: CropRatio = "自由") {
  const [rect, setRect] = useState<CropRect>(initialRect);
  const [ratio, setRatioState] = useState<CropRatio>(initialRatio);
  const dragRef = useRef<CropDragState | null>(null);

  const setRatio = useCallback((nextRatio: CropRatio) => {
    setRatioState(nextRatio);

    if (nextRatio === "自由") {
      setRect(initialRect);
      return;
    }

    setRect(fitRectToRatio(nextRatio));
  }, []);

  const beginMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (event.button !== 0) {
        return;
      }

      event.stopPropagation();
      const bounds = getCanvasBounds(event.currentTarget);
      event.currentTarget.setPointerCapture(event.pointerId);
      dragRef.current = {
        bounds: { height: bounds.height, width: bounds.width },
        origin: { x: event.clientX, y: event.clientY },
        rect,
        type: "move"
      };
    },
    [rect]
  );

  const beginResize = useCallback(
    (handle: CropResizeHandle) => (event: React.PointerEvent<HTMLElement>) => {
      if (event.button !== 0) {
        return;
      }

      event.stopPropagation();
      const cropBox = event.currentTarget.parentElement;
      const bounds = cropBox?.getBoundingClientRect();

      if (!cropBox || !bounds) {
        return;
      }

      cropBox.setPointerCapture(event.pointerId);
      dragRef.current = {
        bounds: {
          height: getCanvasBounds(cropBox).height,
          width: getCanvasBounds(cropBox).width
        },
        handle,
        origin: { x: event.clientX, y: event.clientY },
        rect,
        type: "resize"
      };
    },
    [rect]
  );

  const updateDrag = useCallback((event: React.PointerEvent<HTMLElement>) => {
    const drag = dragRef.current;

    if (!drag) {
      return;
    }

    event.stopPropagation();
    const delta = pointerDeltaPercent(event, drag.origin, drag.bounds);

    if (drag.type === "move") {
      setRect(moveRect(drag.rect, delta.x, delta.y));
      return;
    }

    setRect(resizeRect(drag.rect, drag.handle, delta.x, delta.y));
  }, []);

  const endDrag = useCallback((event: React.PointerEvent<HTMLElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    dragRef.current = null;
  }, []);

  const reset = useCallback(() => {
    dragRef.current = null;
    setRatioState("自由");
    setRect(initialRect);
  }, []);

  const setCropState = useCallback((nextRect: CropRect, nextRatio: CropRatio) => {
    dragRef.current = null;
    setRect(nextRect);
    setRatioState(nextRatio);
  }, []);

  return {
    rect,
    cropBoxStyle: {
      height: `${rect.height}%`,
      left: `${rect.left}%`,
      top: `${rect.top}%`,
      width: `${rect.width}%`
    },
    ratio,
    reset,
    setCropState,
    setRatio,
    moveHandlers: {
      onPointerCancel: endDrag,
      onPointerDown: beginMove,
      onPointerMove: updateDrag,
      onPointerUp: endDrag
    },
    startResize: beginResize
  };
}
