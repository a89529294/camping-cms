import { IResourceComponentsProps, useShow } from "@refinedev/core";
import {
  Show,
  TextField,
  DateField,
  BooleanField,
  ListButton,
  EditButton,
  DeleteButton,
  RefreshButton,
} from "@refinedev/mantine";
import { Title, Anchor, Image, ActionIcon } from "@mantine/core";
import { Breadcrumb } from "../../components/breadcrumb";
import { Carousel } from "@mantine/carousel";
import { RemoteImage } from "../../types";
import { extraDeleteButtonProps } from "../../components/buttons";

export const NewsShow: React.FC<IResourceComponentsProps> = () => {
  const { queryResult } = useShow();
  const { data, isLoading } = queryResult;

  const record = data?.data;
  const sliderSize = 200;
  const order = 5;

  return (
    <Show
      isLoading={isLoading}
      title="消息細節"
      canDelete
      breadcrumb={<Breadcrumb />}
      headerButtons={({
        deleteButtonProps,
        editButtonProps,
        listButtonProps,
      }) => (
        <>
          {listButtonProps && (
            <ListButton {...listButtonProps}>列表</ListButton>
          )}
          {editButtonProps && (
            <EditButton {...editButtonProps}>修改</EditButton>
          )}
          {deleteButtonProps && (
            <DeleteButton
              {...extraDeleteButtonProps}
              {...deleteButtonProps}
              meta={{
                images:
                  queryResult?.data?.data.images.map(
                    (v: { id: number }) => v.id
                  ) ?? [],
              }}
            >
              刪除
            </DeleteButton>
          )}
        </>
      )}
    >
      <Title my="xs" order={order}>
        標題
      </Title>
      <TextField value={record?.title} />
      <Title my="xs" order={order}>
        內容
      </Title>
      <TextField value={record?.content} />
      <Title my="xs" order={order}>
        起始時間
      </Title>
      <DateField value={record?.startDate} />
      <Title my="xs" order={order}>
        結束時間
      </Title>
      <DateField value={record?.endDate} />
      <Title my="xs" order={order}>
        圖片
      </Title>
      <Carousel
        mt="sm"
        slideSize={sliderSize}
        height={sliderSize}
        align="start"
        slideGap="md"
      >
        {record?.images.map((image: RemoteImage) => (
          <Carousel.Slide key={image.id}>
            <Image
              width={sliderSize}
              height={sliderSize}
              src={image.url}
              fit="contain"
            />
          </Carousel.Slide>
        ))}
      </Carousel>
      <Title my="xs" order={order}>
        置頂
      </Title>
      <BooleanField value={record?.isTop} />
    </Show>
  );
};
