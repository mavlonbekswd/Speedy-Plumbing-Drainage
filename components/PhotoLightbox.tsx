"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { X } from "@phosphor-icons/react/dist/ssr";

// Tap a job photo and it opens full size. Mounted ONCE, at the end of <body> in app/layout.tsx.
//
// One delegated click listener on the document, one native <dialog>. Every trigger on the site is
// a plain server-rendered button carrying data-zoom-src, data-zoom-alt and, where there is one,
// data-zoom-caption (see components/ZoomableImage.tsx), so a gallery never becomes a client
// component and the page costs no extra JavaScript per tile.
//
// This file imports NOTHING from lib/media, lib/services, lib/towns or content/: it reads what it
// needs off the element that was clicked. Shipping the media table to every visitor to get one
// file path is exactly the cost this design avoids.
//
// showModal() rather than a hand-built overlay: the rest of the page goes inert, Escape closes,
// and focus is contained, all natively. The picture is rendered only while the dialog is open, so
// a closed dialog holds no <img> at all and no element with an empty src is ever in the document
// (tests/pages.spec.ts asserts alt text on every image on every route).

interface Zoomed {
  src: string;
  alt: string;
  caption?: string;
}

export default function PhotoLightbox() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  /** The button that opened it, so focus can go back exactly where it came from. */
  const triggerRef = useRef<HTMLElement | null>(null);
  const [photo, setPhoto] = useState<Zoomed | null>(null);
  /** Second frame, so the fade has something to fade from. Off under reduced motion. */
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const onDocumentClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const trigger = target?.closest?.("[data-zoom-src]") as HTMLElement | null;
      if (!trigger) return;
      const src = trigger.dataset.zoomSrc;
      if (!src) return;
      triggerRef.current = trigger;
      setPhoto({
        src,
        alt: trigger.dataset.zoomAlt ?? "",
        caption: trigger.dataset.zoomCaption,
      });
    };

    document.addEventListener("click", onDocumentClick);
    return () => document.removeEventListener("click", onDocumentClick);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !photo) return;
    // Guarded: calling showModal on an already-open dialog throws, and React's strict-mode double
    // effect in development would do exactly that. A thrown error here would be a console error
    // on a page tests/pages.spec.ts requires to be clean.
    if (!dialog.open) dialog.showModal();
    const frame = window.requestAnimationFrame(() => setShown(true));
    return () => window.cancelAnimationFrame(frame);
  }, [photo]);

  // The one place closing is handled. Escape, the close button and a click on the backdrop all
  // end in the dialog's own `close` event, so the picture is unmounted and focus returned once,
  // whichever of the three it was. Focus is moved explicitly rather than left to the browser:
  // Safari does not focus a button on a mouse click, so "whatever had focus before" is not
  // reliably the tile that was tapped.
  const onClose = useCallback(() => {
    setPhoto(null);
    setShown(false);
    triggerRef.current?.focus();
    triggerRef.current = null;
  }, []);

  // Resets state directly as well as through the `close` event: the event is a queued task, and a
  // browser can hold it back (a backgrounded tab does), which left the picture mounted inside a
  // closed dialog. `onClose` is idempotent, so the event arriving afterwards changes nothing.
  const close = useCallback(() => {
    dialogRef.current?.close();
    onClose();
  }, [onClose]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      // A click whose target is the dialog itself is a click on the backdrop: the box shrinks to
      // fit the picture, and the browser reports ::backdrop clicks against the dialog element.
      onClick={(event) => {
        if (event.target === dialogRef.current) close();
      }}
      aria-label="Enlarged photo"
      className={[
        "m-auto max-h-none max-w-none border-0 bg-transparent p-0 text-white backdrop:bg-ink/85",
        "transition-opacity duration-150 motion-reduce:transition-none",
        shown ? "opacity-100" : "opacity-0",
      ].join(" ")}
    >
      {photo && (
        <>
          <div className="flex flex-col items-center gap-3">
            {/* A plain <img>, not next/image: the file is already the right size for this (the job
                photographs are 100 to 200 KB) and the optimiser would fetch a second copy of a
                picture the browser has just shown as a thumbnail. */}
            <img
              src={photo.src}
              alt={photo.alt}
              className="max-h-[86vh] max-w-[92vw] rounded-card object-contain"
            />
            {photo.caption && (
              <p className="max-w-[92vw] text-center text-[14px] leading-snug text-white/90">
                {photo.caption}
              </p>
            )}
          </div>

          {/* Fixed, which inside a top-layer dialog is relative to the viewport, so the control
              sits in the same corner whatever shape the picture is. 44px, like the burger. */}
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="press fixed right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-chip bg-ink/60 text-white"
          >
            <X size={22} weight="bold" aria-hidden />
          </button>
        </>
      )}
    </dialog>
  );
}
