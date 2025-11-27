import { baseApi } from "../../utils/apiBaseQuery";


export const SettingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getProfile: builder.query({
      query: () => ({
        url: "/users/my-profile",
        method: "GET",
      }),
    }),

    editProfile: builder.mutation({
      query: (data) => ({
        url: "/users/update-my-profile",
        method: "PATCH",
        body: data
      }),
    }),

    changePassword: builder.mutation({
      query: (data) => ({
        url: "/auth/change-password",
        method: "PATCH",
        body: data
      }),
    }),



  }),
});

// Export hooks
export const {
  useGetProfileQuery,
  useEditProfileMutation,
  useChangePasswordMutation
} = SettingsApi;
