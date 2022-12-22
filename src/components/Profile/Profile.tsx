"use client";

import clsx from "clsx";
import React from "react";
import { useQuery } from "urql";

import { MylistLink } from "~/components/common/Link";
import { UserIcon } from "~/components/common/UserIcon";
import { VideoList } from "~/components/common/VideoList";
import { graphql } from "~/gql";
import { ProfilePageDocument } from "~/gql/graphql";

import { Logout } from "./Logout";

graphql(`
  query ProfilePage {
    whoami {
      id
      name
      displayName
      icon
      favorites {
        id
        registrations(input: { limit: 12 }) {
          nodes {
            id
            video {
              id
              title
              thumbnailUrl
            }
          }
        }
        recommendedVideos(input: { limit: 12 }) {
          items {
            video {
              id
              title
              thumbnailUrl
            }
            score
          }
        }
      }
    }
  }
`);

export const Profile: React.FC<{ className?: string }> = ({ className }) => {
  const [result] = useQuery({ query: ProfilePageDocument });
  const { data } = result;

  if (data?.whoami === null) {
    return (
      <div className={clsx(className)}>
        <p>You have to login</p>
      </div>
    );
  }

  const whoami = data?.whoami;
  return (
    <main className={clsx(className)}>
      <h1 className={clsx(["text-xl"])}>Profile</h1>
      <section className={clsx(["mt-4"])}>
        <div className={clsx(["w-24"], ["h-24"])}>
          {!whoami && (
            <div
              className={clsx(
                ["rounded-lg"],
                [["w-full"], ["h-full"]],
                ["bg-slate-200"],
                ["animate-pulse"]
              )}
            ></div>
          )}
          {whoami && (
            <UserIcon
              className={clsx(["w-full"], ["h-full"], ["rounded-md"])}
              src={whoami.icon}
              name={whoami.name}
            />
          )}
        </div>
        <div className={clsx(["mt-2"], ["flex", "items-center"])}>
          <div
            className={clsx(
              !whoami && ["w-32", "bg-slate-200", "animate-pulse"]
            )}
          >
            {!whoami && (
              <span className={clsx(["text-transparent"])}>LOADING</span>
            )}
            {whoami && (
              <span className={clsx(["text-lg"], ["text-slate-900"])}>
                {whoami.displayName}
              </span>
            )}
          </div>
          <div
            className={clsx(
              ["ml-1"],
              !whoami && ["w-24", "bg-slate-200", "animate-pulse"]
            )}
          >
            {!whoami && (
              <span className={clsx(["text-transparent"])}>LOADING</span>
            )}
            {whoami && (
              <span
                className={clsx(["text-sm"], ["text-slate-500"], ["font-mono"])}
              >
                @{whoami.name}
              </span>
            )}
          </div>
        </div>
        <Logout className={clsx(["mt-2"])} />
      </section>
      <section className={clsx(["mt-4"])}>
        <h2 className={clsx(["text-lg"])}>いいねした動画</h2>
        {whoami && (
          <>
            <MylistLink mylistId={whoami.favorites.id}>ページ</MylistLink>
            <VideoList
              className={clsx(["mt-2"])}
              videos={whoami.favorites.registrations.nodes.map(({ video }) => ({
                id: video.id,
                title: video.title,
                thumbnailUrl: video.thumbnailUrl,
              }))}
            />
          </>
        )}
      </section>
      <section className={clsx(["mt-4"])}>
        <h2 className={clsx(["text-lg"])}>
          あなたのいいねした動画からのオススメ
        </h2>
        {whoami && (
          <VideoList
            className={clsx(["mt-2"])}
            videos={whoami.favorites.recommendedVideos.items.map(
              ({ video }) => ({
                id: video.id,
                title: video.title,
                thumbnailUrl: video.thumbnailUrl,
              })
            )}
          />
        )}
      </section>
    </main>
  );
};