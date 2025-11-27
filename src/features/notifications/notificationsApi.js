import { baseApi } from "../../utils/apiBaseQuery";


export const notificationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getAllNotification: builder.query({
      query: () => ({
        url: "/notification/admin-all",
        method: "GET",
      }),
    }),

    readAllNotification: builder.mutation({
      query: () => ({
        url: `/notification/all-read`,
        method: "POST",
      }),
    }),

    deleteNotification: builder.mutation({
      query: (id) => ({
        url: `/notification/admin/${id}`,
        method: "DELETE",
      }),
    }),




  }),
});

// Export hooks
export const {
  useGetAllNotificationQuery,
  useReadAllNotificationMutation,
  useDeleteNotificationMutation
} = notificationsApi;
