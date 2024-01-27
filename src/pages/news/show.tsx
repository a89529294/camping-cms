import { IResourceComponentsProps, useShow } from "@refinedev/core";
import { Show, TextField, DateField, BooleanField } from "@refinedev/mantine";
import { Title } from "@mantine/core";

export const NewsShow: React.FC<IResourceComponentsProps> = () => {
  const { queryResult } = useShow();
  const { data, isLoading } = queryResult;

  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Title my="xs" order={5}>
        Title
      </Title>
      <TextField value={record?.title} />
      <Title my="xs" order={5}>
        Content
      </Title>
      <TextField value={record?.content} />
      <Title my="xs" order={5}>
        Start Date
      </Title>
      <DateField value={record?.startDate} />
      <Title my="xs" order={5}>
        End Date
      </Title>
      <DateField value={record?.endDate} />
      <Title my="xs" order={5}>
        Is Top
      </Title>
      <BooleanField value={record?.isTop} />
    </Show>
  );
};
