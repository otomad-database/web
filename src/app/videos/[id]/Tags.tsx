"use client";

import "client-only";

import React, { useMemo } from "react";
import { useQuery } from "urql";

import { Inner } from "~/components/Videos/Tags/Inner";
import { getFragment as useFragment, graphql } from "~/gql";
import {
  VideoPage_TagsFragmentDoc,
  VideoPage_TagsSectionDocument,
  VideoPageQuery,
} from "~/gql/graphql";

graphql(`
  query VideoPage_TagsSection($id: ID!) {
    video(id: $id) {
      id
      ...VideoPage_Tags
    }
  }
`);

export const Tags: React.FC<{
  className?: string;
  fallback: VideoPageQuery["video"];
}> = ({ fallback, ...props }) => {
  const [{ data }] = useQuery({
    query: VideoPage_TagsSectionDocument,
    variables: { id: fallback.id },
  });
  const tags = useFragment(
    VideoPage_TagsFragmentDoc,
    useMemo(() => data?.video || fallback, [data?.video, fallback])
  );
  return <Inner {...props} videoId={fallback.id} tags={tags} />;
};
