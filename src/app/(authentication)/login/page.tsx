"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { jwtDecode } from "jwt-decode";
import { login } from "@/api/authentication/useLogin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  password: z.string().min(1, {
    message: "Wrong password",
  }),
});
type TLoginSchema = z.infer<typeof loginSchema>;

type FormData = {
  username: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter()
  const [decodedToken, setDecodedToken] = useState<any>(null);
  const [loginError, setLoginError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    resetField,
  } = useForm<TLoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onLoginSubmit = async (data: TLoginSchema) => {
    try {
      await login(data);
      const token = localStorage.getItem("jwtToken");
      const decoded = token ? jwtDecode(token) : null;
      setDecodedToken(decoded);

      setLoginError(null);
      router.replace("/calendar")
    } catch (error) {
      console.error(error);
      setLoginError(
        "Login failed. Please check your credentials and try again."
      );
      resetField("username")
      resetField("password")
    }
  };

  return (
    <div className="container mx-auto max-w-md py-10">
      <Card className="w-full bg-[#F4ECE5] shadow-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-semibold text-center text-arom_brown">
            Log in to your account
          </CardTitle>
          <CardDescription className="text-center text-arom_gray">
            Enter username and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onLoginSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="username"
                className="text-base pl-2 text-arom_gray"
              >
                Username
              </Label>
              <div className="relative">
                <Input
                  id="username"
                  {...register("username", {
                    required: "Username is required",
                  })}
                  type="text"
                  placeholder="Enter your username"
                  className="placeholder:text-arom_brown"
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
                  {...register("password", {
                    required: "Password is required",
                  })}
                  type="password"
                  placeholder="Enter your password"
                  className="placeholder:text-arom_brown"
                />
              </div>
              {errors.password && (
                <p className="text-sm text-arom_orange-100 pl-2">
                  {errors.password.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full bg-arom_brown hover:bg-arom_gray"
              disabled={isSubmitting}
            >
              Log In
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <a
              onClick={() => {router.replace('signup')}}
              className="text-primary hover:underline text-base cursor-pointer"
            >
              Sign up
            </a>
          </p>
          {loginError && (
            <Alert variant="destructive">
              <AlertDescription>{loginError}</AlertDescription>
            </Alert>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
