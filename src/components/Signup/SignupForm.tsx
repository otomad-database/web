"use client";

import "client-only";

import {
  AtSymbolIcon,
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";

import { AuthFormButton } from "~/components/common/AuthForm/Button";
import { AuthFormInput } from "~/components/common/AuthForm/FormInput";
import { LinkSignin } from "~/components/common/Link";
import { usePostAuthSignup } from "~/rest";

const formSchema = z.object({
  name: z.string().min(3, { message: "ユーザーネームは3文字以上です" }),
  displayName: z.string().min(1, { message: "1文字以上" }),
  email: z.string().email({ message: "メールアドレスの形式でない" }),
  password: z.string().min(8, { message: "パスワードは8文字以上" }),
  passwordRepeat: z.string().min(8, { message: "パスワードは8文字以上" }),
});
type FormSchema = z.infer<typeof formSchema>;

export const SignupForm: React.FC<{ className?: string }> = ({ className }) => {
  const router = useRouter();
  const triggerSignup = usePostAuthSignup();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setError,
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });
  const onSubmit: SubmitHandler<FormSchema> = async ({
    name,
    displayName,
    email,
    password,
  }) => {
    const result = await triggerSignup({ name, displayName, email, password });
    if (result.ok) {
      router.replace("/");
    } else {
      const { code: errorMessage } = await result.json<{ code: string }>();
      switch (errorMessage) {
        case "USER_NAME_ALREADY_REGISTERED":
          setError("name", {
            message: "既に登録されているユーザーネームです",
          });
          break;
        case "EMAIL_ALREADY_REGISTERED":
          setError("email", {
            message: "既に登録されているメールアドレスです",
          });
          break;
        default:
          break;
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={clsx(
        className,
        ["rounded-lg"],
        ["px-8", "py-12"],
        ["flex", "flex-col"],
        ["bg-slate-100"],
        ["border", "border-slate-200"],
        ["shadow-lg"]
      )}
    >
      <div className={clsx(["grid"], ["grid-cols-1"], ["gap-y-4"])}>
        <AuthFormInput
          Input={(props) => (
            <input
              {...register("name")}
              {...props}
              type={"text"}
              placeholder="ユーザーネーム"
            ></input>
          )}
          Icon={(props) => <AtSymbolIcon {...props} />}
          error={errors.name}
        />
        <AuthFormInput
          Input={(props) => (
            <input
              {...register("displayName")}
              {...props}
              type={"text"}
              placeholder="表示される名前"
            ></input>
          )}
          Icon={(props) => <UserIcon {...props} />}
          error={errors.displayName}
        />
        <AuthFormInput
          Input={(props) => (
            <input
              {...register("email")}
              {...props}
              type={"text"}
              placeholder="メールアドレス"
            ></input>
          )}
          Icon={(props) => <EnvelopeIcon {...props} />}
          error={errors.email}
        />
        <AuthFormInput
          Input={(props) => (
            <input
              {...register("password")}
              {...props}
              type={"password"}
              placeholder="パスワード"
            ></input>
          )}
          Icon={(props) => <LockClosedIcon {...props} />}
          error={errors.password}
        />
        <AuthFormInput
          Input={(props) => (
            <input
              {...register("passwordRepeat", {
                validate: (value) => {
                  console.log(getValues("password"), value);
                  return (
                    getValues("password") === value ||
                    "パスワードが一致しません"
                  );
                },
              })}
              {...props}
              type={"password"}
              placeholder="パスワードの再入力"
            ></input>
          )}
          Icon={(props) => <LockClosedIcon {...props} />}
          error={errors.passwordRepeat}
        />
      </div>
      <AuthFormButton className={clsx("mt-6")} text="ユーザー登録" />
      <div className={clsx(["mt-4"])}>
        <p>
          <LinkSignin
            className={clsx(
              ["text-blue-400", "hover:text-blue-500"],
              ["text-sm"]
            )}
          >
            ユーザー登録が既に済んでいるなら
          </LinkSignin>
        </p>
      </div>
    </form>
  );
};
