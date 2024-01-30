import { IResourceComponentsProps } from "@refinedev/core";
import { Create, useForm } from "@refinedev/mantine";
import {
  ActionIcon,
  Button,
  FileInput,
  Grid,
  Stack,
  TextInput,
  Textarea,
  Image,
} from "@mantine/core";
import { IconTrash } from "@tabler/icons";
import { Carousel } from "@mantine/carousel";
import { sliderSize } from "../../constants";
import { useState } from "react";
import { LocalImage } from "../../types";

const initDetailItem = {
  title: "",
  content: "",
  images: [] as LocalImage[],
};

export const MealCreate: React.FC<IResourceComponentsProps> = () => {
  const {
    getInputProps,
    saveButtonProps,
    setFieldValue,
    refineCore: { formLoading },
    values,
    insertListItem,
    removeListItem,
  } = useForm({
    initialValues: {
      name: "",
      details: [initDetailItem],
    },
    refineCoreProps: {
      successNotification: () => ({
        message: "新增餐點成功",
        type: "success",
      }),
    },
    transformValues: (values) => {
      return {
        name: values.name,
        details: values.details.map((v) => ({
          ...v,
          images: v.images.map((image) => image.file),
        })),
      };
    },
  });

  console.log(values);

  return (
    <Create isLoading={formLoading} saveButtonProps={saveButtonProps}>
      <TextInput
        required
        mt="sm"
        label="餐點組合名稱"
        {...getInputProps("name")}
      />
      <Button mt="sm" onClick={() => insertListItem("details", initDetailItem)}>
        新增餐點
      </Button>
      <Grid mt="sm">
        {values.details.map((detail, idx) => {
          return (
            <Grid.Col
              span={6}
              key={idx}
              sx={{ position: "relative" }}
              className="group"
            >
              <Stack mt="sm">
                <TextInput
                  label={`餐點${idx + 1}名稱`}
                  required
                  {...getInputProps(`details.${idx}.title`)}
                />
                <Textarea
                  label={`餐點${idx + 1}介紹`}
                  required
                  {...getInputProps(`details.${idx}.content`)}
                />
              </Stack>
              <ActionIcon
                variant="default"
                sx={{
                  display: "none",
                  ".group:hover &": {
                    display: values.details.length > 1 ? "flex" : "none",
                  },
                  position: "absolute",
                  top: 20,
                  right: 20,
                  cursor: "pointer",
                }}
                onClick={() => removeListItem("details", idx)}
              >
                <IconTrash size={16} style={{ cursor: "pointer" }} />
              </ActionIcon>

              <FileInput
                value={null}
                mt="sm"
                label="上傳圖片"
                accept="image/*"
                onChange={(file) => {
                  if (!file) return;
                  const imageId = crypto.randomUUID();
                  const fr = new FileReader();

                  const newImages = [
                    ...detail.images,
                    {
                      id: imageId,
                      file,
                      src: "",
                    },
                  ];

                  fr.readAsDataURL(file);
                  fr.onload = (e) => {
                    if (!e.target) return;
                    const src = e.target.result as string;
                    setFieldValue(
                      `details.${idx}.images`,
                      newImages.map((v) =>
                        v.id === imageId ? { ...v, src } : v
                      )
                    );
                  };

                  setFieldValue(`details.${idx}.images`, newImages);

                  return null;
                }}
              />
              <Carousel
                mt="sm"
                slideSize={sliderSize}
                height={sliderSize}
                align="start"
                slideGap="md"
              >
                {/* {JSON.stringify(detail.images)} */}
                {detail.images.map((imageFile) => (
                  <Carousel.Slide key={imageFile.id}>
                    <Image
                      width={sliderSize}
                      height={sliderSize}
                      src={imageFile.src}
                      fit="contain"
                    />
                    <ActionIcon
                      variant="default"
                      sx={{
                        position: "absolute",
                        top: 16,
                        right: 16,
                        cursor: "pointer",
                      }}
                      // onClick={() =>
                      //   setImageFiles((pv) =>
                      //     pv.filter((imageF) => imageF.id !== imageFile.id)
                      //   )
                      // }
                    >
                      <IconTrash size={16} style={{ cursor: "pointer" }} />
                    </ActionIcon>
                  </Carousel.Slide>
                ))}
              </Carousel>
            </Grid.Col>
          );
        })}
      </Grid>
    </Create>
  );
};
