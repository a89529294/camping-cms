import { IResourceComponentsProps } from "@refinedev/core";
import { DeleteButton, Edit, ListButton, useForm } from "@refinedev/mantine";
import { FileInput, TextInput, Image, ActionIcon } from "@mantine/core";
import { SaveButton } from "../../components/buttons/save";
import { Breadcrumb } from "../../components/breadcrumb";
import { extraDeleteButtonProps } from "../../components/buttons";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { LocalImage, RemoteImage } from "../../types";
import { Carousel } from "@mantine/carousel";
import { sliderSize } from "../../constants";
import { IconTrash } from "@tabler/icons";

export const PlaygroundEdit: React.FC<IResourceComponentsProps> = () => {
  const navigate = useNavigate();

  const {
    getInputProps,
    saveButtonProps,
    setFieldValue,
    refineCore: { queryResult },
    insertListItem,
    values,
    removeListItem,
  } = useForm({
    initialValues: {
      title: "",
      content: "",
      images: [] as (LocalImage | RemoteImage)[],
    },
    refineCoreProps: {
      successNotification: () => ({
        message: "修改親子設施成功",
        type: "success",
      }),
    },
    validate: {
      title: (value) => (value.length === 0 ? "標題為必填" : null),
    },
    transformValues: (values) => {
      return {
        ...values,
        oldImages: values.images
          .filter((v): v is RemoteImage => "url" in v)
          .map((v) => v.id),
        newImages: values.images
          .filter((v): v is LocalImage => "file" in v)
          .map((v) => v.file),
      };
    },
  });

  return (
    <Edit
      footerButtons={() => (
        <>
          <SaveButton {...saveButtonProps}>修改</SaveButton>
        </>
      )}
      wrapperProps={{
        mih: "100%",
        children: undefined,
      }}
      title="修改親子設施"
      breadcrumb={<Breadcrumb />}
      headerButtons={({ listButtonProps }) => (
        <>
          {listButtonProps && (
            <ListButton {...listButtonProps}>列表</ListButton>
          )}

          <DeleteButton
            {...extraDeleteButtonProps}
            onSuccess={() => navigate("/play-grounds")}
            meta={{
              images:
                queryResult?.data?.data.images.map(
                  (v: { id: number }) => v.id
                ) ?? [],
            }}
          >
            刪除
          </DeleteButton>
        </>
      )}
    >
      <TextInput mt="sm" label="標題" {...getInputProps("title")} />
      <TextInput mt="sm" label="內容" {...getInputProps("content")} />
      <FileInput
        value={[]}
        mt="sm"
        label="上傳圖片"
        required
        accept="image/*"
        multiple
        onChange={(files) => {
          files.forEach((file) => {
            const imageId = crypto.randomUUID();
            const fr = new FileReader();
            fr.readAsDataURL(file);
            fr.onload = (e) => {
              if (!e.target) return;
              const src = e.target.result as string;

              insertListItem("images", {
                id: imageId,
                file,
                src,
              });
            };
          });

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
        {values.images?.map((image, i) => (
          <Carousel.Slide key={image.id}>
            <Image
              width={sliderSize}
              height={sliderSize}
              src={"url" in image ? image.url : image.src}
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
              onClick={() => {
                console.log(i);
                removeListItem("images", i);
              }}
            >
              <IconTrash size={16} style={{ cursor: "pointer" }} />
            </ActionIcon>
          </Carousel.Slide>
        ))}
      </Carousel>
    </Edit>
  );
};
