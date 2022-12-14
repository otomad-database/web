"use client";
import React from "react";
import { useQuery } from "urql";

import { getFragment as useFragment, graphql } from "~/gql";
import {
  RegisterNicovideoPage_ExactTagDocument,
  RegisterNicovideoPage_InnerTagFragmentDoc,
} from "~/gql/graphql";

import { TagInner } from "../TagInner";

graphql(`
  query RegisterNicovideoPage_ExactTag($id: ID!) {
    tag(id: $id) {
      id
      ...RegisterNicovideoPage_InnerTag
    }
  }
`);

export const RegisterTag: React.FC<{
  className?: string;
  id: string;
  deselect(): void;
}> = ({ id, ...props }) => {
  const [{ data }] = useQuery({
    query: RegisterNicovideoPage_ExactTagDocument,
    variables: { id },
  });
  const tag = useFragment(RegisterNicovideoPage_InnerTagFragmentDoc, data?.tag);
  return <TagInner tag={tag || undefined} selected={true} {...props} />;
};
