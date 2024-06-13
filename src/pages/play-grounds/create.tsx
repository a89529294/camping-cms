import { Carousel } from "@mantine/carousel";
import { ActionIcon, FileInput, Image, TextInput } from "@mantine/core";
import { IResourceComponentsProps } from "@refinedev/core";
import { Create, useForm } from "@refinedev/mantine";
import { IconTrash } from "@tabler/icons";
import { Breadcrumb } from "../../components/breadcrumb";
import { SaveButton } from "../../components/buttons/save";
import { sliderSize } from "../../constants";
import { LocalImage } from "../../types";

export const PlaygroundCreate: React.FC<IResourceComponentsProps> = () => {
  const {
    getInputProps,
    saveButtonProps,
    insertListItem,
    refineCore: { formLoading },
    values,
    setFieldValue,
  } = useForm({
    initialValues: { title: "", content: "", images: [] as LocalImage[] },
    validate: {
      title: (value) => (value.length === 0 ? "標題為必填" : null),
    },
    transformValues: (v) => {
      return {
        ...v,
        images: v.images.map((image) => image.file),
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
      <TextInput mt="sm" label="內容" {...getInputProps("content")} />
      <FileInput
        value={[]}
        mt="sm"
        label="上傳圖片"
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
        {values.images.map((imageFile) => (
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
                setFieldValue(
                  "images",
                  values.images.filter((vi) => vi.id !== imageFile.id)
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
