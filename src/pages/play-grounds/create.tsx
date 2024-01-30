import { IResourceComponentsProps } from "@refinedev/core";
import { Create, useForm } from "@refinedev/mantine";
import { FileInput, TextInput, Image, ActionIcon } from "@mantine/core";
import { SaveButton } from "../../components/buttons/save";
import { Breadcrumb } from "../../components/breadcrumb";
import { useState } from "react";
import { LocalImage } from "../../types";
import { Carousel } from "@mantine/carousel";
import { sliderSize } from "../../constants";
import { IconTrash } from "@tabler/icons";

export const PlaygroundCreate: React.FC<IResourceComponentsProps> = () => {
  const [imageFiles, setImageFiles] = useState<LocalImage[]>([]);
  const {
    getInputProps,
    saveButtonProps,
    setFieldValue,
    refineCore: { formLoading },
  } = useForm({
    initialValues: { title: "", content: "" },
    validate: {
      title: (value) => (value.length === 0 ? "標題為必填" : null),
      content: (value) => (value.length === 0 ? "內容為必填" : null),
    },
    transformValues: (values) => {
      return {
        ...values,
        images: imageFiles.map((v) => v.file),
      };
    },
    refineCoreProps: {
      successNotification: () => ({
        message: "新增親子設施成功",
        type: "success",
      }),
    },
  });

  return (
    <Create
      isLoading={formLoading}
      footerButtons={() => (
        <>
          <SaveButton {...saveButtonProps}>新增</SaveButton>
        </>
      )}
      breadcrumb={<Breadcrumb />}
      title="新增親子設施"
      wrapperProps={{
        mih: "100%",
        children: undefined,
      }}
    >
      <TextInput required mt="sm" label="標題" {...getInputProps("title")} />
      <TextInput required mt="sm" label="內容" {...getInputProps("content")} />
      <FileInput
        value={null}
        mt="sm"
        label="上傳圖片"
        accept="image/*"
        onChange={(file) => {
          if (!file) return;
          const imageId = crypto.randomUUID();
          const fr = new FileReader();
          fr.readAsDataURL(file);
          fr.onload = (e) => {
            if (!e.target) return;
            const src = e.target.result as string;
            setImageFiles((pv) =>
              pv.map((imageFile) =>
                imageFile.id === imageId ? { ...imageFile, src } : imageFile
              )
            );
          };
          setImageFiles((pv) => [
            ...pv,
            {
              id: imageId,
              file,
              src: "",
            },
          ]);

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
        {imageFiles.map((imageFile) => (
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
              onClick={() =>
                setImageFiles((pv) =>
                  pv.filter((imageF) => imageF.id !== imageFile.id)
                )
              }
            >
              <IconTrash size={16} style={{ cursor: "pointer" }} />
            </ActionIcon>
          </Carousel.Slide>
        ))}
      </Carousel>
    </Create>
  );
};
