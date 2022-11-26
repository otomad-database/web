"use client";

import "client-only";

import React, { createContext, ReactNode, useState } from "react";
import useSWR from "swr";

import { graphql } from "~/gql";
import { gqlClient } from "~/gql/client";

import { HistoryItemType, TagType } from "./types";

const VideoPageRefreshTagsQueryDocument = graphql(`
  query VideoPageRefreshTags($id: ID!) {
    video(id: $id) {
      id
      tags {
        id
        name
        type
      }
    }
  }
`);

const VideoPageRefreshHistoryQueryDocument = graphql(`
  query VideoPageRefreshHistory($id: ID!) {
    video(id: $id) {
      id
      history(order: { createdAt: ASC }) {
        type: __typename
        id
        createdAt
        user {
          id
          name
          displayName
          icon
        }
        ... on VideoAddTitleHistoryItem {
          title
        }
        ... on VideoDeleteTitleHistoryItem {
          title
        }
        ... on VideoChangePrimaryTitleHistoryItem {
          from
          to
        }
        ... on VideoAddThumbnailHistoryItem {
          thumbnail
        }
        ... on VideoDeleteThumbnailHistoryItem {
          thumbnail
        }
        ... on VideoChangePrimaryThumbnailHistoryItem {
          from
          to
        }
        ... on VideoAddTagHistoryItem {
          tag {
            id
            name
            type
          }
        }
        ... on VideoDeleteTagHistoryItem {
          tag {
            id
            name
            type
          }
        }
      }
    }
  }
`);

export const UpdateableContext = createContext<{
  tags: TagType[];
  updateTags(): void;
  history: HistoryItemType[];
  updateHistory(): void;
}>({
  tags: [],
  updateTags() {},
  history: [],
  updateHistory() {},
});

export const UpdateableProvider: React.FC<{
  children: ReactNode;
  videoId: string;
  initTags: TagType[];
  initHistory: HistoryItemType[];
}> = ({ children, videoId, initTags, initHistory }) => {
  const [tags, setTags] = useState(initTags);
  const { mutate: updateTags } = useSWR(
    [VideoPageRefreshTagsQueryDocument, videoId],
    (doc, vid) => gqlClient.request(doc, { id: vid }),
    {
      suspense: false,
      onSuccess(data) {
        const {
          video: { tags },
        } = data;
        setTags(tags.map(({ id, name, type }) => ({ id, name, type })));
      },
    }
  );

  const [history, setHistory] = useState<HistoryItemType[]>(initHistory);
  const { mutate: updateHistory } = useSWR(
    [VideoPageRefreshHistoryQueryDocument, videoId],
    (doc, vid) => gqlClient.request(doc, { id: vid }),
    {
      suspense: false,
      onSuccess(data) {
        const {
          video: { history },
        } = data;
        setHistory(
          history.map((item) => {
            const { id, createdAt } = item;
            const user = {
              id: item.user.id,
              name: item.user.name,
              displayName: item.user.displayName,
              icon: item.user.icon,
            };
            switch (item.type) {
              case "VideoRegisterHistoryItem": {
                return { id, createdAt, user, type: "REGISTER" };
              }
              case "VideoAddTitleHistoryItem": {
                const { title } = item;
                return { id, createdAt, user, type: "ADD_TITLE", title };
              }
              case "VideoDeleteTitleHistoryItem": {
                const { title } = item;
                return { id, createdAt, user, type: "DELETE_TITLE", title };
              }
              case "VideoChangePrimaryTitleHistoryItem": {
                const { from, to } = item;
                return {
                  id,
                  createdAt,
                  user,
                  type: "CHANGE_PRIMARY_TITLE",
                  from: from || null,
                  to,
                };
              }
              case "VideoAddThumbnailHistoryItem": {
                const { thumbnail } = item;
                return {
                  id,
                  createdAt,
                  user,
                  type: "ADD_THUMBNAIL",
                  thumbnail,
                };
              }
              case "VideoDeleteThumbnailHistoryItem": {
                const { thumbnail } = item;
                return {
                  id,
                  createdAt,
                  user,
                  type: "DELETE_THUMBNAIL",
                  thumbnail,
                };
              }
              case "VideoChangePrimaryThumbnailHistoryItem": {
                const { from, to } = item;
                return {
                  id,
                  createdAt,
                  user,
                  type: "CHANGE_PRIMARY_THUMBNAIL",
                  from: from || null,
                  to,
                };
              }
              case "VideoAddTagHistoryItem": {
                const { tag } = item;
                return {
                  id,
                  createdAt,
                  user,
                  type: "ADD_TAG",
                  tag: { id: tag.id, name: tag.name, type: tag.type },
                };
              }
              case "VideoDeleteTagHistoryItem": {
                const { tag } = item;
                return {
                  id,
                  createdAt,
                  user,
                  type: "DELETE_TAG",
                  tag: { id: tag.id, name: tag.name, type: tag.type },
                };
              }
            }
          })
        );
      },
    }
  );

  return (
    <UpdateableContext.Provider
      value={{
        tags,
        history,
        updateTags() {
          updateTags();
        },
        updateHistory() {
          updateHistory();
        },
      }}
    >
      {children}
    </UpdateableContext.Provider>
  );
};