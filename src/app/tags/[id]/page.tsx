import clsx from "clsx";

import { VideoList } from "~/components/common/VideoList";
import { getFragment, graphql } from "~/gql";
import { VideoList_VideoFragmentDoc } from "~/gql/graphql";
import { gqlRequest } from "~/utils/gqlRequest";

export async function generateStaticParams() {
  const { findTags } = await gqlRequest(
    graphql(`
      query TagPagePaths {
        findTags(input: { limit: 96, order: { updatedAt: DESC } }) {
          nodes {
            id
          }
        }
      }
    `)
  );
  return findTags.nodes.map(({ id }) => ({ id }));
}

export default async function Page({ params }: { params: { id: string } }) {
  const { tag } = await gqlRequest(
    graphql(`
      query TagPage($id: ID!) {
        tag(id: $id) {
          id
          name
          taggedVideos {
            id
            ...VideoList_Video
          }
        }
      }
    `),
    { id: params.id }
  );

  const taggedVideos = getFragment(
    VideoList_VideoFragmentDoc,
    tag.taggedVideos
  );

  return (
    <>
      <h1 className={clsx(["flex"], ["items-center"])}>
        <span className={clsx(["block"], ["text-2xl"], ["text-slate-800"])}>
          {tag.name}
        </span>
      </h1>
      <div className={clsx(["mt-4"])}>
        <VideoList className={clsx()} videos={taggedVideos} />
      </div>
    </>
  );
}
