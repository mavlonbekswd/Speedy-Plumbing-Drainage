"use client";

// The optional photo control on the booking forms.
//
// Speedy takes photos and the reference build does not, so this is the part
// with no template. Two things matter more than the picture: the lead must
// still go through, and the customer must be told which photo did not make it.
// lib/imageCompress.ts does the shrinking and returns a skipped list for
// exactly that reason; every entry in it gets a visible sentence here.
//
// Selections ADD to what is already chosen, because a customer who picks one
// photo, then remembers the stopcock, expects two photos and not a swap.

import { useEffect, useRef, useState } from "react";
import { prepareBookingPhotos, type PhotoSkipReason } from "@/lib/imageCompress";
import { FORM_COPY } from "@/lib/claims";
import { HINT_CLASS, LABEL_CLASS } from "@/components/FormStatus";

/** Mirrors the default in prepareBookingPhotos: what the upload as a whole may weigh. */
const TOTAL_BUDGET = 4 * 1024 * 1024;

const SKIP_REASON: Record<PhotoSkipReason, string> = {
  undecodable: "this device could not read the picture",
  too_large: "the picture is too big to send",
  over_limit: "there was no room left for it",
};

export interface PhotoPickerProps {
  /** The file input's id. Locked per form: f-photos, q-photos. */
  id: string;
  files: File[];
  onChange: (files: File[]) => void;
  max?: number;
}

export default function PhotoPicker({ id, files, onChange, max = 4 }: PhotoPickerProps) {
  const [skipped, setSkipped] = useState<{ name: string; reason: PhotoSkipReason }[]>([]);
  const [busy, setBusy] = useState(false);
  const [previews, setPreviews] = useState<{ file: File; url: string }[]>([]);
  // Keyed by the File itself, so a URL is made once and revoked exactly once.
  const urls = useRef<Map<File, string>>(new Map());

  useEffect(() => {
    const map = urls.current;
    for (const file of files) {
      if (!map.has(file)) map.set(file, URL.createObjectURL(file));
    }
    for (const [file, url] of Array.from(map.entries())) {
      if (!files.includes(file)) {
        URL.revokeObjectURL(url);
        map.delete(file);
      }
    }
    setPreviews(files.map((file) => ({ file, url: map.get(file) as string })));
  }, [files]);

  // An object URL left alive holds the whole decoded image, and this runs up to
  // four times on a phone that is already busy.
  useEffect(() => {
    const map = urls.current;
    return () => {
      for (const url of map.values()) URL.revokeObjectURL(url);
      map.clear();
    };
  }, []);

  async function handleSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(event.target.files ?? []);
    // Cleared straight away so picking the same file twice still fires onChange.
    event.target.value = "";
    if (picked.length === 0) return;

    const room = max - files.length;
    if (room <= 0) {
      setSkipped(picked.map((file) => ({ name: file.name, reason: "over_limit" as const })));
      return;
    }

    setBusy(true);
    const used = files.reduce((sum, file) => sum + file.size, 0);
    const prepared = await prepareBookingPhotos(picked, {
      maxFiles: room,
      maxTotal: Math.max(0, TOTAL_BUDGET - used),
    });
    setBusy(false);
    setSkipped(prepared.skipped);
    if (prepared.files.length) onChange([...files, ...prepared.files]);
  }

  function remove(index: number) {
    setSkipped([]);
    onChange(files.filter((_, i) => i !== index));
  }

  const hintId = `${id}-hint`;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className={LABEL_CLASS}>
        {FORM_COPY.full.photoLabel}
      </label>
      <p id={hintId} className={HINT_CLASS}>
        {FORM_COPY.full.photoHint}
      </p>
      <input
        id={id}
        name="photos"
        type="file"
        accept="image/*"
        multiple
        aria-describedby={hintId}
        onChange={handleSelect}
        className="block w-full text-[15px] text-slate file:mr-4 file:min-h-[44px] file:cursor-pointer file:rounded-pill file:border file:border-line file:bg-paper-2 file:px-5 file:text-[14.5px] file:font-semibold file:text-brand"
      />

      {busy && <p className={HINT_CLASS}>Preparing your photos...</p>}

      {previews.length > 0 && (
        <ul className="flex flex-wrap gap-3 pt-1">
          {previews.map((preview, index) => (
            <li
              key={preview.url}
              className="flex items-center gap-3 rounded-chip border border-line bg-white p-2"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview.url}
                alt=""
                width={56}
                height={56}
                className="h-14 w-14 rounded-chip object-cover"
              />
              <button
                type="button"
                onClick={() => remove(index)}
                aria-label={`Remove photo ${index + 1}`}
                className="press flex h-11 w-11 items-center justify-center rounded-pill border border-line text-[18px] font-bold text-brand"
              >
                <span aria-hidden>&times;</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {skipped.length > 0 && (
        <ul className="flex flex-col gap-1 pt-1">
          {skipped.map((entry, index) => (
            <li key={`${entry.name}-${index}`} className="text-[13.5px] leading-[1.5] text-[#B3261E]">
              {entry.name} was not added, because {SKIP_REASON[entry.reason]}.
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
