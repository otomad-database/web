"use client";
import clsx from "clsx";
import React from "react";

import { graphql } from "~/gql";
import { RegisterNicovideoPage_InnerTagFragment } from "~/gql/graphql";

import { tagtypestyle } from "./Form";

graphql(`
  fragment RegisterNicovideoPage_InnerTag on Tag {
    id
    name
    pseudoType
    explicitParent {
      id
      name
    }
  }
`);

export const TagInner: React.FC<{
  className?: string;
  tag?: RegisterNicovideoPage_InnerTagFragment;
  currentTags: string[];
  reducer(v: { type: "add" | "remove"; id: string }): void;
}> = ({ className, tag, currentTags, reducer }) => {
  return (
    <div
      tabIndex={0}
      aria-checked={tag && currentTags.includes(tag?.id)}
      className={clsx(
        className,
        ["group"],
        ["rounded"],
        ["pr-2", "pl-1"],
        ["py-0.5"],
        [
          "border",
          "border-slate-300",
          "border-l-4",
          tag && tagtypestyle(tag.pseudoType, "border-l", 400),
        ],
        ["aria-checked:bg-sky-100", ["bg-gray-50", "hover:bg-sky-50"]],
        ["cursor-pointer"]
      )}
      onClick={() => {
        if (tag)
          reducer({
            type: currentTags.includes(tag.id) ? "remove" : "add",
            id: tag.id,
          });
      }}
    >
      {tag && (
        <div
          className={clsx(
            ["ml-1"],
            ["text-xs"],
            [
              "text-slate-900",
              "group-hover:text-sky-700",
              "group-aria-checked:text-sky-900",
            ]
          )}
        >
          {tag.name}
          {tag.explicitParent && (
            <span
              className={clsx(
                ["ml-0.5"],
                [
                  "text-slate-500",
                  "group-hover:text-sky-700",
                  "group-aria-checked:text-sky-900",
                ]
              )}
            >
              ({tag.explicitParent.name})
            </span>
          )}
        </div>
      )}
    </div>
  );
};