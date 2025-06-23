"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import useLogin from "@/components/auth/login/useLogin";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    errors,
    onSubmit,
    callbackUrl,
    setLoginMutation,
  } = useLogin();

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-12">
      <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.root?.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.root?.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={setLoginMutation.isLoading}
        >
          {setLoginMutation.isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">Or continue with</p>
        <div className="flex justify-center gap-4 mt-4">
          <Button
            variant="outline"
            onClick={() => signIn("google", { callbackUrl })}
          >
            Google
          </Button>
          <Button
            variant="outline"
            onClick={() => signIn("github", { callbackUrl })}
          >
            GitHub
          </Button>
        </div>
      </div>

      <div className="mt-6 text-center text-sm">
        <span className="text-gray-600">Don't have an account? </span>
        <a href="/register" className="text-primary font-medium">
          Sign up
        </a>
      </div>
    </div>
  );
}
