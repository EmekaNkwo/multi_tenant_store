import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRegisterMutation } from "@/redux/api/authApi";
import { handleApiError } from "@/helpers/error-handlers";

const useRegister = () => {
  const router = useRouter();
  const [registerMutation, setRegisterMutation] = useRegisterMutation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm();

  const onSubmit = async (data: any) => {
    try {
      await registerMutation({
        name: data.name,
        email: data.email,
        password: data.password,
        role: "customer",
      });
    } catch (error: any) {
      toast.error(error.message || "Could not create account");
    }
  };

  useEffect(() => {
    if (setRegisterMutation.isSuccess) {
      toast.success("Account Created");
      router.push("/login");
    } else if (setRegisterMutation.isError) {
      toast.error(handleApiError(setRegisterMutation.error));
    }
  }, [setRegisterMutation.isSuccess, setRegisterMutation.isError]);
  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit,
    getValues,
  };
};

export default useRegister;
