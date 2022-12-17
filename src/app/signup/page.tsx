import clsx from "clsx";

import { SkipIfLoggedin } from "~/components/SkipIfLoggedin";

import { SignupForm } from "./SignupForm";

export default async function Page() {
  return (
    <SkipIfLoggedin>
      <div className={clsx(["flex", ["justify-center"], ["items-center"]])}>
        <SignupForm className={clsx(["w-full", "md:w-96"])} />
      </div>
    </SkipIfLoggedin>
  );
}