import { IResourceComponentsProps, useShow } from "@refinedev/core";
import { Show, TextField, NumberField } from "@refinedev/mantine";
import { Title, Image, Group, ActionIcon } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import { sliderSize } from "../../constants";
import { RemoteImage } from "../../types";
import { IconTrash } from "@tabler/icons";

export const RoomShow: React.FC<IResourceComponentsProps> = () => {
  const { queryResult } = useShow();
  const { data, isLoading } = queryResult;

  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Title my="xs" order={5}>
        房型名稱
      </Title>
      <TextField value={record?.name} />
      <Title my="xs" order={5}>
        房型介紹
      </Title>
      <TextField value={record?.intro} />
      <Title my="xs" order={5}>
        房型圖片
      </Title>
      <Carousel
        mt="sm"
        slideSize={sliderSize}
        height={sliderSize}
        align="start"
        slideGap="md"
      >
        {record?.images.map((imageFile: RemoteImage) => (
          <Carousel.Slide key={imageFile.id}>
            <Image
              width={sliderSize}
              height={sliderSize}
              src={imageFile.url}
              fit="contain"
            />
          </Carousel.Slide>
        ))}
      </Carousel>
    </Show>
  );
};
