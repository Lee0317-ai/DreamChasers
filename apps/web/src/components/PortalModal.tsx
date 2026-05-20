"use client";

import { useEffect } from "react";
import type { PortalItem } from "./portal-data";

type PortalModalProps = {
  item: PortalItem | null;
  onClose: () => void;
};

export function PortalModal({ item, onClose }: PortalModalProps) {
  useEffect(() => {
    if (!item) {
      return;
    }

    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [item, onClose]);

  if (!item) {
    return null;
  }

  return (
    <div className="modal-overlay open" onClick={onClose} role="presentation">
      <div
        aria-labelledby="portal-modal-title"
        aria-modal="true"
        className="modal"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <div className="modal-header">
          <h3 id="portal-modal-title">{item.detailsTitle}</h3>
          <button aria-label="关闭弹窗" className="modal-close" onClick={onClose} type="button">
            ×
          </button>
        </div>
        <div className="modal-body">
          {item.status === "coming" ? (
            item.details.map((detail) => <p key={detail}>{detail}</p>)
          ) : (
            <>
              <p>{item.description}</p>
              <ul>
                {item.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
              {item.footnote ? <p className="modal-footnote">{item.footnote}</p> : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
