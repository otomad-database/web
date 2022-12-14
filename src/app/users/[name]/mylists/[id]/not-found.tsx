import "server-only";

import clsx from "clsx";

export default function NotFound() {
  return (
    <main className={clsx(["px-8"])}>
      <h1
        className={clsx(
          ["tracking-wider"],
          ["text-4xl"],
          ["font-bold"],
          ["text-slate-900"]
        )}
      >
        404
      </h1>
      <p className={clsx(["mt-2"], ["text-slate-900"])}>
        マイリストは存在しないか、プライベートの可能性があります。
      </p>
    </main>
  );
}
