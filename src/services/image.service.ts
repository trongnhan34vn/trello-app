import { baseApi, buildUrl, IMAGE_ENDPOINT } from '.';
import type { SuccessResponse } from '../types/api.type';
import type { Image } from '../types/image.type';

export const imageSerivce = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listImage: builder.query<SuccessResponse<Image[]>, void>({
      query: () => buildUrl({ path: IMAGE_ENDPOINT.LIST }),
    }),
  }),
});

export const { useListImageQuery } = imageSerivce;
