import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useLoginMutation } from "@/redux/api/authApi";
import { ApiError, handleApiError } from "@/helpers/error-handlers";

type FormData = {
  email: string;
  password: string;
};

const useLogin = () => {
  const router = useRouter();
  const [loginMutation, setLoginMutation] = useLoginMutation();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      await loginMutation({
        email: data.email,
        password: data.password,
      });
    } catch (error) {
      toast.error(handleApiError(error));
    }
  };

  const handleOAuthSignIn = async (provider: string) => {
    try {
      await signIn(provider, { callbackUrl });
    } catch (error) {
      toast.error("Failed to sign in with " + provider);
    }
  };

  useEffect(() => {
    if (setLoginMutation.isSuccess) {
      toast.success("Login successful");
      // router.push("/");
    } else if (setLoginMutation.isError) {
      toast.error(handleApiError(setLoginMutation.error));
    }
  }, [setLoginMutation.isSuccess, setLoginMutation.isError]);
  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    handleOAuthSignIn,
    callbackUrl,
    setLoginMutation,
  };
};

export default useLogin;
