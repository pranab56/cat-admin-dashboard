import { baseApi } from "../../utils/apiBaseQuery";


export const overviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    overViewStateCard: builder.query({
      query: () => ({
        url: "/payment/overview",
        method: "GET",
      }),
    }),

    AllEarningResioChart: builder.query({
      query: (year) => {
        const url = year
          ? `/payment/all-earning-rasio?year=${year}`
          : `/payment/all-earning-rasio`;

        return {
          url,
          method: "GET",
        };
      },
    }),

    allUsers: builder.query({
      query: () => ({
        url: `/users/all-users`,
        method: "GET",
      }),
    }),

    blockUser: builder.mutation({
      query: (id) => ({
        url: `/users/blocked/${id}`,
        method: "PATCH",
      }),
    }),


  }),
});

// Export hooks
export const {
  useOverViewStateCardQuery,
  useAllEarningResioChartQuery,
  useAllUsersQuery,
  useBlockUserMutation
} = overviewApi;
