import { baseApi } from "../../utils/apiBaseQuery";


export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Login
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),

    forgotEmail: builder.mutation({
      query: (forgotEmail) => ({
        url: "/auth/forgot-password-otp",
        method: "POST",
        body: forgotEmail,
      }),
    }),


    forgotEmailOTPCheck: builder.mutation({
      query: (OTP) => ({
        url: "/auth/forgot-password-otp-match",
        method: "PATCH",
        body: OTP,
      }),
    }),

    resetPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/dashboard/reset-password",
        method: "POST",
        headers: {
          resettoken: `${data.token}`,
        },
        body: {
          newPassword: data.password,
          confirmPassword: data.confirmPassword,
        },
      }),
    }),

  }),
});

// Export hooks
export const {
  useLoginMutation,
  useForgotEmailMutation,
  useForgotEmailOTPCheckMutation,
  useResetPasswordMutation
} = authApi;
