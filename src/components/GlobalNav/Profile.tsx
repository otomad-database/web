"use client";

import clsx from "clsx";
import Link from "next/link";
import React from "react";
import { useQuery } from "urql";

import { graphql } from "~/gql";
import { GlobalNav_ProfileDocument } from "~/gql/graphql";

import { UserIcon } from "../UserIcon";

graphql(`
  query GlobalNav_Profile {
    whoami {
      id
      name
      displayName
      icon
    }
  }
`);

export const Profile: React.FC<{ className?: string }> = ({ className }) => {
  const [result] = useQuery({ query: GlobalNav_ProfileDocument });
  const { data, error } = result;

  if (error) {
    return (
      <div className={clsx(className)}>
        <Link
          className={clsx(
            ["rounded"],
            ["px-4", "py-2"],
            ["transition-colors", "duration-75"],
            ["border", ["border-sky-400", "hover:border-sky-300"]],
            ["bg-sky-400", ["bg-opacity-25", "hover:bg-opacity-40"]],
            ["text-sky-400", "hover:text-sky-300"]
          )}
          href={"/login"}
        >
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className={clsx(className)}>
      <Link
        href={"/profile"}
        className={clsx(["flex"], ["flex-row"], ["items-center"])}
      >
        <div className={clsx(["w-8"], ["h-8"])}>
          {!data?.whoami && (
            <div
              className={clsx(
                ["rounded-sm"],
                [["w-full"], ["h-full"]],
                ["bg-slate-700"],
                ["animate-pulse"]
              )}
            ></div>
          )}
          {data?.whoami && (
            <UserIcon
              className={clsx(["w-full"], ["h-full"])}
              src={data.whoami.icon}
              name={data.whoami.name}
            />
          )}
        </div>
      </Link>
    </div>
  );
};
