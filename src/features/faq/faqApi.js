import { baseApi } from "../../utils/apiBaseQuery";


export const faqApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getAllFaq: builder.query({
      query: () => ({
        url: "/faq?category=payment", // not dynamic 
        method: "GET",
      }),
    }),

    createFaq: builder.mutation({
      query: (data) => ({
        url: "/faq/create-faq",
        method: "POST",
        body: data
      }),
    }),

    updateFaq: builder.mutation({
      query: ({ id, data }) => ({
        url: `/faq/${id}`,
        method: "PATCH",
        body: data
      }),
    }),

    deleteFaq: builder.mutation({
      query: (id, data) => ({
        url: `/faq/${id}`,
        method: "DELETE",
      }),
    }),

  }),
});

// Export hooks
export const {
  useGetAllFaqQuery,
  useCreateFaqMutation,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
} = faqApi;
