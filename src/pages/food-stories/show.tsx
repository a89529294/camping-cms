import { IResourceComponentsProps, useShow } from "@refinedev/core";
import {
  Show,
  TextField,
  NumberField,
  TagField,
  ListButton,
  EditButton,
  DeleteButton,
} from "@refinedev/mantine";
import { Title, Group, Grid, Stack, Image } from "@mantine/core";
import { ShowMeal } from "../../rest-data-provider";
import { Carousel } from "@mantine/carousel";
import { sliderSize } from "../../constants";
import { RemoteImage } from "../../types";
import { Breadcrumb } from "../../components/breadcrumb";
import { extraDeleteButtonProps } from "../../components/buttons";

const order = 5;

export const MealShow: React.FC<IResourceComponentsProps> = () => {
  const { queryResult } = useShow();
  const { data, isLoading } = queryResult;

  const record = data?.data;

  console.log(record?.details);

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
                images: queryResult?.data?.data.details
                  .map((v: any) => v.images)
                  .flat()
                  .map((v: any) => v.id),
              }}
            >
              刪除
            </DeleteButton>
          )}
        </>
      )}
    >
      <Title my="xs" order={5}>
        餐點組合名稱
      </Title>
      <TextField value={record?.name} />
      <Title my="xs" order={5}>
        餐點
      </Title>
      <Grid>
        {record?.details.map((v: ShowMeal, idx: number) => (
          <Grid.Col key={idx} span={6}>
            <Stack mt="sm">
              <Title order={order}>名稱</Title>
              <TextField value={v.title} />
              <Title order={order}>介紹</Title>
              <TextField value={v.content} />
              <Carousel
                mt="sm"
                slideSize={sliderSize}
                height={sliderSize}
                align="start"
                slideGap="md"
              >
                {v.images.map((image: RemoteImage) => (
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
            </Stack>
          </Grid.Col>
        ))}
      </Grid>
    </Show>
  );
};
