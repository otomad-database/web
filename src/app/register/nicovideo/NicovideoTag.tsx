"use client";
import clsx from "clsx";
import React, { ComponentProps, Fragment } from "react";
import { useQuery } from "urql";

import { getFragment as useFragment, graphql } from "~/gql";
import {
  RegisterNicovideoPage_InnerTagFragmentDoc,
  RegisterNicovideoPage_ResultFragment,
  RegisterNicovideoPage_ResultFragmentDoc,
  RegisterNicovideoPage_SearchTagCandidatesDocument,
} from "~/gql/graphql";

import { TagInner } from "./TagInner";
import { useIfSkipTag } from "./useIfSkipTag";

graphql(`
  fragment RegisterNicovideoPage_Result on SearchTagsResultItem {
    matchedName
    tag {
      id
      ...RegisterNicovideoPage_InnerTag
    }
  }

  query RegisterNicovideoPage_SearchTagCandidates($query: String!) {
    searchTags(input: { query: $query, limit: 2 }) {
      result {
        ...RegisterNicovideoPage_Result
      }
    }
  }
`);

export const Candidate: React.FC<
  {
    item: RegisterNicovideoPage_ResultFragment;
  } & Omit<ComponentProps<typeof TagInner>, "className" | "fragment">
> = ({ item, ...props }) => {
  const fragment = useFragment(
    RegisterNicovideoPage_InnerTagFragmentDoc,
    item.tag
  );
  return (
    <Fragment>
      <TagInner tag={fragment} {...props} />
    </Fragment>
  );
};

export const NicovideoTag: React.FC<{
  className?: string;
  tag: string;
  picktags: string[];
  reducer(v: { type: "add" | "remove"; id: string }): void;
}> = ({ className, tag, ...props }) => {
  const unneccesary = useIfSkipTag(tag);

  const [result] = useQuery({
    query: RegisterNicovideoPage_SearchTagCandidatesDocument,
    pause: unneccesary,
    variables: { query: tag },
  });
  const a = useFragment(
    RegisterNicovideoPage_ResultFragmentDoc,
    result.data?.searchTags.result
  );

  return (
    <div className={clsx(className)}>
      <div>
        <div className={clsx(["text-sm"], ["text-slate-900"], ["font-bold"])}>
          {tag}
        </div>
      </div>
      {unneccesary && (
        <p className={clsx(["text-xs"], ["text-slate-500"])}>
          検索対象外のタグです
        </p>
      )}
      {result.data?.searchTags.result && (
        <div className={clsx(["mt-1"])}>
          {result.data.searchTags.result.length === 0 && (
            <p className={clsx(["text-xs"], ["text-slate-500"])}>
              候補が見つかりませんでした
            </p>
          )}
          <div className={clsx(["w-full"], ["flex"], ["gap-x-2"])}>
            {a?.map((r, i) => (
              <Candidate key={i} item={r} {...props} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
