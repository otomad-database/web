import { css } from "@emotion/css";
import { Meta, StoryObj } from "@storybook/react";
import { graphql } from "msw";
import {
  createClient as createUrqlClient,
  Provider as UrqlProvider,
} from "urql";

import {
  aSearchTagsItem,
  aTag,
  PseudoTagType,
  RegisterTag_RegisterTagDocument,
  RegisterTag_SearchTagsDocument,
} from "~/gql/graphql";
import { RestProvider } from "~/rest";

import { RegisterTagForm } from "./Form";

export default {
  component: RegisterTagForm,
  args: {
    className: css`
      width: 960px;
    `,
  },
  render(args) {
    return (
      <UrqlProvider value={createUrqlClient({ url: "/graphql" })}>
        <RestProvider value={{ base: window.location.origin }}>
          <RegisterTagForm {...args} />
        </RestProvider>
      </UrqlProvider>
    );
  },
  parameters: {
    layout: "centered",
    msw: {
      handlers: [
        graphql.mutation(RegisterTag_RegisterTagDocument, (req, res, ctx) =>
          res(
            ctx.data({
              registerTag: {
                tag: aTag({
                  id: "tag:1",
                  name: req.variables.primaryName,
                  explicitParent: aTag({
                    id: "tag:2",
                    name: "仮",
                  }),
                }),
              },
            })
          )
        ),
        graphql.query(RegisterTag_SearchTagsDocument, (req, res, ctx) =>
          res(
            ctx.data({
              searchTags: {
                items: [
                  aSearchTagsItem({
                    matchedName: "後藤ひとり",
                    tag: aTag({
                      id: "tag:1",
                      name: "後藤ひとり",
                      pseudoType: PseudoTagType.Character,
                      explicitParent: aTag({
                        id: "tag:2",
                        name: "ぼっち・ざ・ろっく！",
                      }),
                    }),
                  }),
                  aSearchTagsItem({
                    matchedName: "ぼっち・ざ・ろっく！",
                    tag: aTag({
                      id: "tag:3",
                      name: "ぼっち・ざ・ろっく！",
                      pseudoType: PseudoTagType.Copyright,
                      explicitParent: null,
                    }),
                  }),
                ],
              },
            })
          )
        ),
      ],
    },
  },
} as Meta<typeof RegisterTagForm>;

export const Primary: StoryObj<typeof RegisterTagForm> = {
  args: {},
};
