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

const variablesSchema = z.object({
  title: z.string(),
  content: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  isTop: z.boolean(),
});

const NewsListSchema = z.object({
  data: z.array(
    z.object({
      id: z.number(),
      attributes: variablesSchema,
    })
  ),
  meta: z.object({
    pagination: z.object({
      total: z.number(),
    }),
  }),
});

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
      _sort?: string;
      _order?: string;
    } = {};

    if (mode === "server") {
      query["pagination[page]"] = current;
      query["pagination[pageSize]"] = pageSize;
    }

    const generatedSort = generateSort(sorters);
    if (generatedSort) {
      const { _sort, _order } = generatedSort;
      query._sort = _sort.join(",");
      query._order = _order.join(",");
    }

    const { data, headers } = await httpClient[requestMethod](
      `${url}?${stringify(query)}&${stringify(queryFilters)}`,
      {
        headers: headersFromMeta,
      }
    );
    // const { data } = await httpClient[requestMethod](`${url}`, {
    //   headers: headersFromMeta,
    // });

    const newsList = NewsListSchema.parse(data);

    const total = data.meta.pagination.total;

    return {
      data: newsList.data.map((news: any) => ({
        id: news.id,
        ...news.attributes,
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
    const validVariables = variablesSchema.parse(variables);
    console.log(validVariables);

    const url = `${apiUrl}/${resource}`;

    const { headers, method } = meta ?? {};
    const requestMethod = (method as MethodTypesWithBody) ?? "post";

    const { data } = await httpClient[requestMethod](
      url,
      {
        data: {
          title: validVariables.title,
          content: validVariables.content,
          startDate: validVariables.startDate,
          endDate: validVariables.endDate,
          isTop: validVariables.isTop,
        },
      },
      {
        headers,
      }
    );

    return {
      data,
    };
  },

  update: async ({ resource, id, variables, meta }) => {
    const url = `${apiUrl}/${resource}/${id}`;

    const { headers, method } = meta ?? {};
    const requestMethod = (method as MethodTypesWithBody) ?? "put";

    const { data } = await httpClient[requestMethod](
      url,
      {
        data: variables,
      },
      {
        headers,
      }
    );

    return {
      data,
    };
  },

  getOne: async ({ resource, id, meta }) => {
    const url = `${apiUrl}/${resource}/${id}`;

    const { headers, method } = meta ?? {};
    const requestMethod = (method as MethodTypes) ?? "get";

    const { data } = await httpClient[requestMethod](url, { headers });

    const validData = variablesSchema.parse(data.data.attributes);

    return {
      data: validData as any,
    };
  },

  deleteOne: async ({ resource, id, variables, meta }) => {
    const url = `${apiUrl}/${resource}/${id}`;

    const { headers, method } = meta ?? {};
    const requestMethod = (method as MethodTypesWithBody) ?? "delete";

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
