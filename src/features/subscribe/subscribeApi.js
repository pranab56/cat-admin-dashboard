import { baseApi } from "../../utils/apiBaseQuery";


export const subscribeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getAllPackage: builder.query({
      query: () => ({
        url: "/package/packages",
        method: "GET",
      }),
    }),

    createPackage: builder.mutation({
      query: (data) => ({
        url: "/package/create-package",
        method: "POST",
        body: data
      }),
    }),

    updatePackage: builder.mutation({
      query: ({ id, data }) => ({
        url: `/package/${id}`,
        method: "PATCH",
        body: data
      }),
    }),

    deletePackage: builder.mutation({
      query: (id, data) => ({
        url: `/package/${id}`,
        method: "DELETE",
        body: data
      }),
    }),


  }),
});

// Export hooks
export const {
  useGetAllPackageQuery,
  useCreatePackageMutation,
  useUpdatePackageMutation,
  useDeletePackageMutation
} = subscribeApi;
