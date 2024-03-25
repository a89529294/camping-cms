import {
  BaseRecord,
  CreateParams,
  DataProvider,
  MetaQuery,
} from "@refinedev/core";
import { generateSort, generateFilter } from "./utils";
import { AxiosInstance } from "axios";
import { stringify } from "query-string";
import { z } from "zod";

type MethodTypes = "get" | "delete" | "head" | "options";
type MethodTypesWithBody = "post" | "put" | "patch";

const showExtend = {
  images: z.object({
    data: z
      .array(
        z.object({
          id: z.number(),
          attributes: z.object({
            url: z.string(),
          }),
        })
      )
      .nullable()
      .transform((v) => v ?? []),
  }),
};
const updateExtend = {
  newImages: z.array(z.instanceof(File)),
  oldImages: z.array(z.number()),
};

const newsSchema = z.object({
  title: z.string(),
  content: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  isTop: z.boolean(),
});

const createNewsSchema = newsSchema.extend({
  images: z.array(z.instanceof(File)),
});

const updateNewsSchema = newsSchema.extend(updateExtend);

const showNewsSchema = newsSchema.extend(showExtend);

const newsListSchema = z.object({
  data: z.array(
    z.object({
      id: z.number(),
      attributes: newsSchema,
    })
  ),
  meta: z.object({
    pagination: z.object({
      total: z.number(),
    }),
  }),
});

const playgroundSchema = z.object({
  title: z.string(),
  content: z.string(),
});

const playgroundListSchema = z.object({
  data: z.array(
    z.object({
      id: z.number(),
      attributes: playgroundSchema,
    })
  ),
  meta: z.object({
    pagination: z.object({
      total: z.number(),
    }),
  }),
});

const createPlaygroundSchema = playgroundSchema.extend({
  images: z.array(z.instanceof(File)),
});

const showPlaygroundSchema = playgroundSchema.extend(showExtend);

const updatePlaygroundSchema = playgroundSchema.extend(updateExtend);

const mealCreateDetailsSchema = z.array(
  z.object({
    title: z.string(),
    content: z.string(),
    images: z.array(z.instanceof(File)),
  })
);

const mealShowDetailsSchema = z.array(
  z
    .object({
      title: z.string(),
      content: z.string(),
    })
    .extend(showExtend)
);

const mealUpdateDetailsSchema = z.array(
  z
    .object({
      title: z.string(),
      content: z.string(),
    })
    .extend(updateExtend)
);

const mealSchema = z.object({
  name: z.string(),
});

const mealsListSchema = z.object({
  data: z.array(
    z.object({
      id: z.number(),
      attributes: mealSchema,
    })
  ),
  meta: z.object({
    pagination: z.object({
      total: z.number(),
    }),
  }),
});

const createMealSchema = mealSchema.extend({
  details: mealCreateDetailsSchema,
});

const showMealSchema = mealSchema
  .extend({ details: mealShowDetailsSchema })
  .transform((v) => ({
    ...v,
    details: v.details.map((detail) => ({
      ...detail,
      images: detail.images.data.map((image) => ({
        id: image.id,
        url: image.attributes.url,
      })),
    })),
  }));

export type ShowMeal = z.infer<typeof showMealSchema>["details"][number];

const updateMealSchema = mealSchema.extend({
  details: mealUpdateDetailsSchema,
});

const roomSchema = z.object({
  name: z.string(),
  intro: z.string(),
  count: z.number(),
  maxCount: z.number(),
  checkinTime: z.string(),
  checkoutTime: z.string(),
  holidayJudgment: z.string().nullable(),
  notice: z.string().nullable(),
});

const roomsListSchema = z.object({
  data: z.array(
    z.object({
      id: z.number(),
      attributes: roomSchema,
    })
  ),
  meta: z.object({
    pagination: z.object({
      total: z.number(),
    }),
  }),
});

const createRoomSchema = roomSchema.extend({
  images: z.array(z.instanceof(File)),
});

const showRoomSchema = roomSchema.extend(showExtend);

const updateRoomSchema = roomSchema.extend(updateExtend);

const resourceSchemaMap = {
  news: {
    list: newsListSchema,
    create: createNewsSchema,
    show: showNewsSchema,
    update: updateNewsSchema,
  },
  "play-grounds": {
    list: playgroundListSchema,
    create: createPlaygroundSchema,
    show: showPlaygroundSchema,
    update: updatePlaygroundSchema,
  },
  "food-stories": {
    list: mealsListSchema,
    create: createMealSchema,
    show: showMealSchema,
    update: updateMealSchema,
  },
  "room-collections": {
    list: roomsListSchema,
    create: createRoomSchema,
    show: showRoomSchema,
    update: updateRoomSchema,
  },
};

export const dataProvider = (
  apiUrl: string,
  httpClient: AxiosInstance
): Omit<
  Required<DataProvider>,
  "createMany" | "updateMany" | "deleteMany"
> => ({
  getList: async ({ resource, pagination, filters, sorters, meta }) => {
    const url = `${apiUrl}/${resource}`;

    const { current = 1, pageSize = 10, mode = "server" } = pagination ?? {};

    const { headers: headersFromMeta, method } = meta ?? {};
    const requestMethod = (method as MethodTypes) ?? "get";

    const queryFilters = generateFilter(filters);

    const query: {
      "pagination[page]"?: number;
      "pagination[pageSize]"?: number;
      [sort: `sort[${number}]`]: string;
    } = {};

    if (sorters) {
      sorters.forEach(({ field, order }, index) => {
        query[`sort[${index}]`] = `${field}:${order}`;
      });
    }

    if (mode === "server") {
      query["pagination[page]"] = current;
      query["pagination[pageSize]"] = pageSize;
    }

    const { data, headers } = await httpClient[requestMethod](
      `${url}?${stringify(query)}&${stringify(queryFilters)}`,
      {
        headers: headersFromMeta,
      }
    );

    const list =
      resourceSchemaMap[resource as keyof typeof resourceSchemaMap].list.parse(
        data
      );

    const total = data.meta.pagination.total;

    return {
      data: list.data.map((item: any) => ({
        id: item.id,
        ...item.attributes,
      })),
      total: total || data.length,
    };
  },

  getMany: async ({ resource, ids, meta }) => {
    const { headers, method } = meta ?? {};
    const requestMethod = (method as MethodTypes) ?? "get";

    const { data } = await httpClient[requestMethod](
      `${apiUrl}/${resource}?${stringify({ id: ids })}`,
      { headers }
    );

    return {
      data,
    };
  },

  create: async ({ resource, variables, meta }) => {
    const validVariables =
      resourceSchemaMap[
        resource as keyof typeof resourceSchemaMap
      ].create.parse(variables);

    const url = `${apiUrl}/${resource}`;

    const { headers, method } = meta ?? {};
    const requestMethod = (method as MethodTypesWithBody) ?? "post";

    let images: number[] = [];

    if ("images" in validVariables && validVariables.images.length) {
      const formData = new FormData();
      validVariables.images.forEach((image) => formData.append("files", image));

      const { data } = await httpClient[requestMethod](
        `${apiUrl}/upload`,
        formData
      );

      images = data.map((v: { id: number }) => v.id);
    }

    if ("details" in validVariables) {
      const mealsDetailsImages: (number[] | null)[] = [];
      const promises: Promise<any>[] = [];
      validVariables.details.forEach(({ images }) => {
        if (images.length) {
          const formData = new FormData();
          images.forEach((file) => formData.append("files", file));

          promises.push(
            httpClient[requestMethod](`${apiUrl}/upload`, formData)
          );
        } else promises.push(Promise.resolve(null));
      });

      (await Promise.allSettled(promises)).forEach((v, idx) => {
        if (v.status === "fulfilled") {
          if (v.value !== null)
            mealsDetailsImages[idx] = v.value.data.map(
              (v: { id: number }) => v.id
            );
          else mealsDetailsImages[idx] = null;
        }
      });

      const { data } = await httpClient[requestMethod](
        url,
        {
          data: {
            ...validVariables,
            details: validVariables.details.map((v, idx) => ({
              ...v,
              images: mealsDetailsImages[idx],
            })),
          },
        },
        {
          headers,
        }
      );

      return {
        data,
      };
    } else {
      const { data } = await httpClient[requestMethod](
        url,
        {
          data: {
            ...validVariables,
            images,
          },
        },
        {
          headers,
        }
      );

      return {
        data,
      };
    }
  },

  update: async ({ resource, id, variables, meta }) => {
    const { headers, method } = meta ?? {};
    const requestMethod = (method as MethodTypesWithBody) ?? "put";
    const url = `${apiUrl}/${resource}/${id}`;
    const validVariables =
      resourceSchemaMap[
        resource as keyof typeof resourceSchemaMap
      ].update.parse(variables);

    if ("details" in validVariables) {
      const images: number[][] = [];
      const promises: Promise<any>[] = [];

      validVariables.details.forEach((v) => {
        if (v.newImages.length === 0)
          promises.push(Promise.resolve({ data: [] }));
        else {
          const formData = new FormData();
          v.newImages.forEach((image) => formData.append("files", image));
          promises.push(httpClient["post"](`${apiUrl}/upload`, formData));
        }
      });

      (await Promise.allSettled(promises)).forEach((v, i) => {
        if (v.status === "fulfilled")
          images[i] = [
            ...validVariables.details[i].oldImages,
            ...v.value.data.map((image: { id: number }) => image.id),
          ];
        else images[i] = validVariables.details[i].oldImages;
      });

      const { data } = await httpClient[requestMethod](
        url,
        {
          data: {
            ...validVariables,
            details: validVariables.details.map((detail, i) => ({
              title: detail.title,
              content: detail.content,
              images: images[i],
            })),
          },
        },
        {
          headers,
        }
      );

      return {
        data,
      };
    } else {
      let newImages: number[] = [];

      if (validVariables.newImages.length) {
        const formData = new FormData();
        validVariables.newImages.forEach((image) =>
          formData.append("files", image)
        );

        const { data } = await httpClient["post"](`${apiUrl}/upload`, formData);

        newImages = data.map((v: { id: number }) => v.id);
      }

      const { data } = await httpClient[requestMethod](
        url,
        {
          data: {
            ...variables,
            images: [...validVariables.oldImages, ...newImages],
          },
        },
        {
          headers,
        }
      );

      return {
        data,
      };
    }
  },

  getOne: async ({ resource, id, meta }) => {
    const populateSegment =
      resource === "food-stories"
        ? "?populate[details][populate][0]=images"
        : "?populate=images";
    const url = `${apiUrl}/${resource}/${id}${populateSegment}`;

    const { headers, method } = meta ?? {};
    const requestMethod = (method as MethodTypes) ?? "get";

    const { data } = await httpClient[requestMethod](url, { headers });

    const validData = resourceSchemaMap[
      resource as keyof typeof resourceSchemaMap
    ].show.parse(data.data.attributes);

    const transformedData = validData as any;

    if ("details" in validData) {
      // for (const key in validData) {
      //   if (key === "details")
      //     transformedData["details"] = validData.details.map((v) => ({
      //       ...v,
      //       images: v.images.data.map((image) => ({
      //         id: image.id,
      //         url: image.attributes.url,
      //       })),
      //     }));
      //   else transformedData[key] = validData[key as keyof typeof validData];
      // }
    } else {
      for (const key in validData) {
        if (key.endsWith("Date"))
          transformedData[key] = new Date(
            validData[key as Exclude<keyof typeof validData, "images">]
          );
        else if (key === "images")
          transformedData[key] = validData.images.data.map((v) => ({
            id: v.id,
            url: v.attributes.url,
          }));
        else transformedData[key] = validData[key as keyof typeof validData];
      }
    }

    return {
      data: {
        ...transformedData,
      },
    };
  },

  deleteOne: async ({ resource, id, variables, meta }) => {
    const { headers, method } = meta ?? {};
    const requestMethod = (method as MethodTypesWithBody) ?? "delete";
    if (meta && meta.images) {
      const { images } = meta;
      const promises: Promise<Response>[] = [];
      images.forEach((id: number) =>
        promises.push(httpClient[requestMethod](`${apiUrl}/upload/files/${id}`))
      );
      await Promise.allSettled(promises);
    }

    const url = `${apiUrl}/${resource}/${id}`;

    const { data } = await httpClient[requestMethod](url, {
      data: variables,
      headers,
    });

    return {
      data,
    };
  },

  getApiUrl: () => {
    return apiUrl;
  },

  custom: async ({
    url,
    method,
    filters,
    sorters,
    payload,
    query,
    headers,
  }) => {
    let requestUrl = `${url}?`;

    if (sorters) {
      const generatedSort = generateSort(sorters);
      if (generatedSort) {
        const { _sort, _order } = generatedSort;
        const sortQuery = {
          _sort: _sort.join(","),
          _order: _order.join(","),
        };
        requestUrl = `${requestUrl}&${stringify(sortQuery)}`;
      }
    }

    if (filters) {
      const filterQuery = generateFilter(filters);
      requestUrl = `${requestUrl}&${stringify(filterQuery)}`;
    }

    if (query) {
      requestUrl = `${requestUrl}&${stringify(query)}`;
    }

    let axiosResponse;
    switch (method) {
      case "put":
      case "post":
      case "patch":
        axiosResponse = await httpClient[method](url, payload, {
          headers,
        });
        break;
      case "delete":
        axiosResponse = await httpClient.delete(url, {
          data: payload,
          headers: headers,
        });
        break;
      default:
        axiosResponse = await httpClient.get(requestUrl, {
          headers,
        });
        break;
    }

    const { data } = axiosResponse;

    return Promise.resolve({ data });
  },
});
