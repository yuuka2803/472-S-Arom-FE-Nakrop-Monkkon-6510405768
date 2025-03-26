"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { register as registerUser } from "@/api/authentication/useRegister";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";

const signUpSchema = z
  .object({
    username: z.string().min(3, {
      message: "Username must be at least 3 characters.",
    }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    profileImage: z.instanceof(File).refine((file) => file.size <= 5000000, {
      message: "The file should be less than 5MB.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type TSignUpSchema = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    resetField,
    setValue,
  } = useForm<TSignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
    },
  });

  async function onSignUpSubmit(values: TSignUpSchema): Promise<void> {
    try {      
      const signUpData = {
        username: values.username,
        password: values.password,
        email: values.email,
        profile_image: values.profileImage
      }
      await registerUser(signUpData)
      router.replace('/login')
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="container mx-auto max-w-md py-10">
      <Card className="w-full bg-[#F4ECE5] shadow-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-semibold text-center text-arom_brown">
            Create an account
          </CardTitle>
          <CardDescription className="text-center text-arom_gray">
            Enter your details below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSignUpSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="username"
                className="text-base pl-2 text-arom_gray"
              >
                Username
              </Label>
              <div className="relative">
                {/* <Icons.user className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /> */}
                <Input
                  id="username"
                  {...register("username")}
                  type="text"
                  placeholder="Enter your username (3 characters)"
                  className=" placeholder:text-arom_brown"
                />
              </div>
              {errors.username && (
                <p className="text-sm text-arom_orange-100 pl-2">
                  {errors.username.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-base pl-2 text-arom_gray"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  {...register("password")}
                  type="password"
                  placeholder="Enter your password (8 characters)"
                  className=" placeholder:text-arom_brown"
                />
              </div>
              {errors.password && (
                <p className="text-sm text-arom_orange-100 pl-2">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-base pl-2 text-arom-brown text-arom_gray"
              >
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  {...register("confirmPassword")}
                  type="password"
                  placeholder="Confirm your password"
                  className=" placeholder:text-arom_brown"
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-arom_orange-100 pl-2">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-base pl-2 text-arom_gray"
              >
                Email
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  {...register("email")}
                  type="email"
                  placeholder="Enter your email"
                  className=" placeholder:text-arom_brown"
                />
              </div>
              {errors.email && (
                <p className="text-sm text-arom_orange-100 pl-2">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="profileImage"
                className="text-base pl-2 text-arom_gray"
              >
                Profile Image
              </Label>
              <Input
                id="profileImage"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setValue("profileImage", file);
                  }
                }}
                className=" placeholder:text-arom_brown text-arom_brown"
              />
              {errors.profileImage && (
                <p className="text-sm text-arom_orange-100 pl-2">
                  {errors.profileImage.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full bg-arom_brown hover:bg-arom_gray"
              disabled={isSubmitting}
            >
              Create Your Account
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center text-base">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <a
              className="text-primary hover:underline text-base cursor-pointer"
              onClick={() => {
                router.replace("/login");
              }}
            >
              Log in
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
