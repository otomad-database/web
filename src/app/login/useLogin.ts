"use client";

import "client-only";

import ky from "ky";
import { rest } from "msw";
import { useCallback } from "react";

import { useViewer } from "~/hooks/useViewer";

export const mockLoginHandler = rest.post(
  new URL("/auth/login", process.env.NEXT_PUBLIC_API_ENDPOINT).toString(),
  async (req, res, ctx) => {
    const result = await req.json<{ name: string; password: string }>();
    if (result.name !== "test")
      return res(ctx.status(400), ctx.json({ error: "user not found" }));
    if (result.password !== "pass")
      return res(ctx.status(400), ctx.json({ error: "password wrong" }));

    return res(
      ctx.cookie("otmd-session", "sessionid-secret", {
        httpOnly: true,
        sameSite: "strict",
        secure: false,
      }),
      ctx.json({ id: "1" })
    );
  }
);

export const useLogin = ({
  onSuccess,
  onError,
}: {
  onSuccess(): void;
  onError(status: "NO_USER" | "WRONG_PASSWORD" | "UNKNOWN"): void;
}) => {
  const [, update] = useViewer();

  const handler = useCallback(
    async ({ name, password }: { name: string; password: string }) => {
      const result = await ky.post(
        new URL("/auth/login", process.env.NEXT_PUBLIC_API_ENDPOINT).toString(),
        {
          json: { name, password },
          throwHttpErrors: false,
          credentials: "include",
        }
      );
      if (result.ok) {
        // const { id } = await result.json<{ id: string }>();
        onSuccess();
        update({ requestPolicy: "network-only" });
      } else {
        const { error } = await result.json<{ error: string }>();
        switch (error) {
          case "user not found":
            onError("NO_USER");
            break;
          case "password wrong":
            onError("WRONG_PASSWORD");
            break;
          default:
            onError("UNKNOWN");
            break;
        }
      }
    },
    [onError, onSuccess, update]
  );
  return handler;
};