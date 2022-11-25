import "server-only";

import { graphql } from "~/gql";
import { gqlClient } from "~/gql/client";

const TagPageQueryDocument = graphql(`
  query TagPage($id: ID!) {
    tag(id: $id) {
      id
      name
      type
      taggedVideos {
        id
        title
        thumbnailUrl
        tags {
          name
        }
      }
    }
  }
`);

export const getData = async (
  id: string
): Promise<{
  id: string;
  name: string;
  context: {
    id: string;
    name_primary: string;
  } | null;
  taggedVideos: {
    id: string;
    title: string;
    thumbnailUrl: string;
  }[];
}> => {
  const { tag } = await gqlClient.request(TagPageQueryDocument, { id });

  return {
    id: tag.id,
    name: tag.name,
    context: null,
    taggedVideos: tag.taggedVideos.map(({ id, title, thumbnailUrl }) => ({
      id,
      title,
      thumbnailUrl,
    })),
  };
};
