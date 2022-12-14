import { Meta, StoryObj } from "@storybook/react";
import { screen, userEvent } from "@storybook/testing-library";
import { graphql } from "msw";
import {
  createClient as createUrqlClient,
  Provider as UrqlProvider,
} from "urql";

import {
  aSearchTagsItem,
  aSearchTagsPayload,
  aSearchVideosItem,
  aSearchVideosPayload,
  aTag,
  aVideo,
  GlobalNav_SearchBoxDocument,
  PseudoTagType,
} from "~/gql/graphql";

import { SearchBox } from "./SearchBox";

export default {
  component: SearchBox,
  args: {},
  parameters: {
    msw: {
      handlers: [
        graphql.query(GlobalNav_SearchBoxDocument, (req, res, ctx) =>
          res(
            ctx.data({
              tags: aSearchTagsPayload({ items: [] }),
              videos: aSearchVideosPayload({ items: [] }),
            })
          )
        ),
      ],
    },
  },
} as Meta<typeof SearchBox>;

export const Primary: StoryObj<typeof SearchBox> = {
  args: {},
  render(args) {
    return (
      <UrqlProvider value={createUrqlClient({ url: "/graphql" })}>
        <SearchBox {...args} />
      </UrqlProvider>
    );
  },
  parameters: {
    msw: {
      handlers: [
        graphql.query(GlobalNav_SearchBoxDocument, (req, res, ctx) =>
          res(
            ctx.data({
              tags: aSearchTagsPayload({ items: [] }),
              videos: aSearchVideosPayload({ items: [] }),
            })
          )
        ),
      ],
    },
  },
};

export const Click: StoryObj<typeof SearchBox> = {
  args: {},
  render(args) {
    return (
      <UrqlProvider value={createUrqlClient({ url: "/graphql" })}>
        <SearchBox {...args} />
      </UrqlProvider>
    );
  },
  play: async () => {
    await userEvent.click(screen.getByLabelText("Search box input"));
  },
};

export const Nothing: StoryObj<typeof SearchBox> = {
  args: {},
  render(args) {
    return (
      <UrqlProvider value={createUrqlClient({ url: "/graphql" })}>
        <SearchBox {...args} />
      </UrqlProvider>
    );
  },
  play: async () => {
    await userEvent.type(
      screen.getByLabelText("Search box input"),
      "??????????????????????????????"
    );
  },
  parameters: {
    msw: {
      handlers: [
        graphql.query(GlobalNav_SearchBoxDocument, (req, res, ctx) =>
          res(
            ctx.data({
              tags: aSearchTagsPayload({ items: [] }),
              videos: aSearchVideosPayload({ items: [] }),
            })
          )
        ),
      ],
    },
  },
};

export const Type: StoryObj<typeof SearchBox> = {
  args: {},
  render(args) {
    return (
      <UrqlProvider value={createUrqlClient({ url: "/graphql" })}>
        <SearchBox {...args} />
      </UrqlProvider>
    );
  },
  play: async () => {
    await userEvent.type(
      screen.getByLabelText("Search box input"),
      "??????????????????????????????"
    );
  },
  parameters: {
    msw: {
      handlers: [
        graphql.query(GlobalNav_SearchBoxDocument, (req, res, ctx) =>
          res(
            ctx.data({
              tags: aSearchTagsPayload({
                items: [
                  aSearchTagsItem({
                    matchedName: "??????????????????????????????",
                    tag: aTag({
                      id: "tag_1",
                      name: "??????????????????????????????",
                      pseudoType: PseudoTagType.Character,
                    }),
                  }),
                  aSearchTagsItem({
                    matchedName: "???????????????",
                    tag: aTag({
                      id: "tag_2",
                      name: "???????????????",
                      pseudoType: PseudoTagType.Character,
                    }),
                  }),
                  aSearchTagsItem({
                    matchedName: "???????????????",
                    tag: aTag({
                      id: "tag_3",
                      name: "???????????????",
                      pseudoType: PseudoTagType.Character,
                    }),
                  }),
                  aSearchTagsItem({
                    matchedName: "???????????????",
                    tag: aTag({
                      id: "tag_4",
                      name: "???????????????",
                      pseudoType: PseudoTagType.Character,
                    }),
                  }),
                  aSearchTagsItem({
                    matchedName: "????????????",
                    tag: aTag({
                      id: "tag_5",
                      name: "????????????",
                      pseudoType: PseudoTagType.Character,
                    }),
                  }),
                  aSearchTagsItem({
                    matchedName: "????????????????????????????????????",
                    tag: aTag({
                      id: "tag_6",
                      name: "????????????????????????????????????????????????????????????????????????????????????",
                      pseudoType: PseudoTagType.Phrase,
                    }),
                  }),
                ],
              }),
              videos: aSearchVideosPayload({
                items: [
                  aSearchVideosItem({
                    matchedTitle: "???????????????????????????????????????????????????",
                    video: aVideo({
                      id: "video_1",
                      title: "???????????????????????????????????????????????????",
                      thumbnailUrl: "/storybook/960x540.jpg",
                    }),
                  }),
                  aSearchVideosItem({
                    matchedTitle: "??????????????????????????????????????????3",
                    video: aVideo({
                      id: "video_2",
                      title: "??????????????????????????????????????????3",
                      thumbnailUrl: "/storybook/960x540.jpg",
                    }),
                  }),
                  aSearchVideosItem({
                    matchedTitle: "?????????????????????",
                    video: aVideo({
                      id: "video_3",
                      title: "?????????????????????",
                      thumbnailUrl: "/storybook/960x540.jpg",
                    }),
                  }),
                  /*
                  aSearchVideosResultItem({
                    matchedTitle: "??????????????????????????????",
                    video: aVideo({
                      id: "video_4",
                      title: "??????????????????????????????",
                      thumbnailUrl: "/storybook/960x540.jpg",
                    }),
                  }),
                  aSearchVideosResultItem({
                    matchedTitle: "??????????????????",
                    video: aVideo({
                      id: "video_5",
                      title: "??????????????????",
                      thumbnailUrl: "/storybook/960x540.jpg",
                    }),
                  }),
                  aSearchVideosResultItem({
                    matchedTitle: "??????????????????????????????",
                    video: aVideo({
                      id: "video_6",
                      title: "??????????????????????????????",
                      thumbnailUrl: "/storybook/960x540.jpg",
                    }),
                  }),
                  */
                ],
              }),
            })
          )
        ),
      ],
    },
  },
};
