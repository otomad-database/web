import "server-only";

import clsx from "clsx";
import gqlRequest from "graphql-request";
import Image from "next/image";

import { VideoLink } from "~/components/Link";
import { graphql } from "~/gql";
import { VideoPage_SimilarVideosDocument } from "~/gql/graphql";

graphql(`
  query VideoPage_SimilarVideos($id: ID!) {
    video(id: $id) {
      similarVideos(input: { limit: 12 }) {
        items {
          video {
            id
            title
            thumbnailUrl
          }
        }
      }
    }
  }
`);

export const getSimilarVideos = async (
  id: string
): Promise<{ videos: { id: string; title: string; thumbnail: string }[] }> => {
  const {
    video: {
      similarVideos: { items },
    },
  } = await gqlRequest(
    new URL("/graphql", process.env.NEXT_PUBLIC_API_ENDPOINT).toString(),
    VideoPage_SimilarVideosDocument,
    { id }
  );
  return {
    videos: items.map(({ video }) => ({
      id: video.id,
      title: video.title,
      thumbnail: video.thumbnailUrl,
    })),
  };
};

export async function SimilarVideosSection({
  id,
  className,
}: {
  id: string;
  className?: string;
}) {
  const similar = await getSimilarVideos(id);

  return (
    <section className={clsx(className)}>
      <h2 className={clsx(["text-xl"], ["text-slate-900"])}>似ている動画</h2>
      <div
        className={clsx(
          ["mt-2"],
          ["grid"],
          ["grid-cols-2", "md:grid-cols-3", "lg:grid-cols-6"],
          ["gap-x-4"],
          ["gap-y-2"]
        )}
      >
        {similar.videos.map(({ id, title, thumbnail }) => (
          <div key={id}>
            <VideoLink videoId={id} className={clsx(["block"])}>
              <Image
                className={clsx(["w-full"], ["h-auto"], ["rounded-lg"])}
                src={thumbnail}
                width={256}
                height={192}
                alt={title}
                priority={true}
              />
            </VideoLink>
            <VideoLink
              videoId={id}
              className={clsx(
                ["block"],
                ["px-1"],
                ["py-1"],
                ["text-xs"],
                ["line-clamp-2"]
              )}
            >
              {title}
            </VideoLink>
          </div>
        ))}
      </div>
    </section>
  );
}