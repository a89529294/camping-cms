import { IResourceComponentsProps, useShow } from "@refinedev/core";
import { Show, TextField, NumberField, TagField } from "@refinedev/mantine";
import { Title, Group, Grid, Stack, Image } from "@mantine/core";
import { ShowMeal } from "../../rest-data-provider";
import { Carousel } from "@mantine/carousel";
import { sliderSize } from "../../constants";
import { RemoteImage } from "../../types";

const order = 5;

export const MealShow: React.FC<IResourceComponentsProps> = () => {
  const { queryResult } = useShow();
  const { data, isLoading } = queryResult;

  const record = data?.data;

  console.log(record?.details);

  return (
    <Show isLoading={isLoading}>
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
