import { Carousel } from "@mantine/carousel";
import { Image, Title } from "@mantine/core";
import { IResourceComponentsProps, useShow } from "@refinedev/core";
import { Show, TextField } from "@refinedev/mantine";
import { sliderSize } from "../../constants";
import { RemoteImage } from "../../types";
import DOMPurify from "dompurify";

export const RoomShow: React.FC<IResourceComponentsProps> = () => {
  const { queryResult } = useShow();
  const { data, isLoading } = queryResult;

  const record = data?.data;

  console.log(record);

  return (
    <Show isLoading={isLoading} title="房型細節" canDelete>
      <Title my="xs" order={5}>
        房型名稱
      </Title>
      <TextField value={record?.name} />
      <Title my="xs" order={5}>
        房型介紹
      </Title>
      <TextField value={record?.intro} />
      <Title my="xs" order={5}>
        平假日判斷
      </Title>
      <div
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(record?.holidayJudgment),
        }}
      />
      <Title my="xs" order={5}>
        入住須知
      </Title>
      <div
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(record?.notice),
        }}
      />
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
