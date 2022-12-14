"use client";

import "client-only";

import clsx from "clsx";
import React, { useId } from "react";

import { ParentTag } from "./ParentTag";
import { TagAdder } from "./TagAdder";

export const ImplictParentTags: React.FC<{
  className?: string;

  fields: {
    id: string; // for for
    tagId: string;
  }[];

  append(payload: { tagId: string }): void;
  remove(index: number): void;
  selectedParentIds: string[];
}> = ({ className, append, remove, selectedParentIds, fields }) => {
  const labelId = useId();

  return (
    <div className={clsx(className)}>
      <label className={clsx(["text-sm"])} htmlFor={labelId}>
        非明示的な親タグ
      </label>
      <div className={clsx(["mt-1"])}>
        <TagAdder
          id={labelId}
          placeholder={"非明示的な親タグ"}
          handleSelect={(payload) => {
            append(payload);
          }}
          selectedIds={selectedParentIds}
        />
        {0 < fields.length && (
          <div className={clsx(["mt-2"], ["w-full"], ["space-y-2"])}>
            {fields.map(({ id, tagId }, index) => (
              <ParentTag
                key={id}
                tagId={tagId}
                handleDelete={() => remove(index)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
