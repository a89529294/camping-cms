import { IResourceComponentsProps, useShow } from "@refinedev/core";
import {
  DeleteButton,
  EditButton,
  ListButton,
  Show,
  TextField,
} from "@refinedev/mantine";
import { Title, Image } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import { sliderSize } from "../../constants";
import { RemoteImage } from "../../types";
import { Breadcrumb } from "../../components/breadcrumb";
import { extraDeleteButtonProps } from "../../components/buttons";

export const PlaygroundShow: React.FC<IResourceComponentsProps> = () => {
  const { queryResult } = useShow();
  const { data, isLoading } = queryResult;

  const record = data?.data;

  return (
    <Show
      isLoading={isLoading}
      title="親子設施細節"
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
      <Title my="xs" order={5}>
        標題
      </Title>
      <TextField value={record?.title} />
      <Title my="xs" order={5}>
        內容
      </Title>
      <TextField value={record?.content} />
      <Title my="xs" order={5}>
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
    </Show>
  );
};
