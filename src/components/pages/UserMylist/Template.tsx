"use client";
import clsx from "clsx";
import React from "react";

import { MetaTemplate } from "~/components/common/MylistPage/MetaTemplate";
import {
  MylistPageCommon_SideMylistListFragment,
  UserMylistPage_DetailsFragment,
  UserMylistPage_RegistrationsFragment,
} from "~/gql/graphql";

import { Details } from "./Details";
import { Registrations } from "./Registrations";

export const UserMylistTemplate: React.FC<{
  sidelist: MylistPageCommon_SideMylistListFragment | undefined;
  details: UserMylistPage_DetailsFragment | undefined;
  registrations: UserMylistPage_RegistrationsFragment | undefined;
}> = ({ sidelist, details, registrations }) => {
  return (
    <MetaTemplate
      sidelist={sidelist}
      Main={() => (
        <main className={clsx()}>
          {details && <Details fallback={details} />}
          {registrations && (
            <Registrations
              className={clsx(["mt-2"])}
              fallback={registrations}
            />
          )}
        </main>
      )}
    />
  );
};
