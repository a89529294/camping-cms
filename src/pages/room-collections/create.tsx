import { IResourceComponentsProps } from "@refinedev/core";
import { Create, useForm } from "@refinedev/mantine";
import { FileInput, TextInput, Image, ActionIcon } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import { sliderSize } from "../../constants";
import { LocalImage } from "../../types";
import { IconTrash } from "@tabler/icons";
import { SaveButton } from "../../components/buttons/save";
import { Breadcrumb } from "../../components/breadcrumb";

export const RoomCreate: React.FC<IResourceComponentsProps> = () => {
  const {
    getInputProps,
    saveButtonProps,
    setFieldValue,
    refineCore: { formLoading },
    values,
    insertListItem,
    removeListItem,
  } = useForm({
    initialValues: { name: "", intro: "", images: [] as LocalImage[] },
    transformValues: (v) => ({
      ...v,
      images: v.images.map((image) => image.file),
      count: 1,
      maxCount: 1,
      checkinTime: "12:00:00.000",
      checkoutTime: "18:00:00.000",
    }),
    refineCoreProps: {
      successNotification: () => ({
        message: "新增房型成功",
        type: "success",
      }),
      redirect: "list",
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
      title="新增房型"
      wrapperProps={{
        mih: "100%",
        children: undefined,
      }}
    >
      <TextInput mt="sm" label="房型名稱" {...getInputProps("name")} />
      <TextInput mt="sm" label="房型介紹" {...getInputProps("intro")} />

      <FileInput
        value={null}
        mt="sm"
        label="上傳圖片"
        required
        accept="image/*"
        onChange={(file) => {
          if (!file) return;
          const imageId = crypto.randomUUID();
          const newImage = {
            id: imageId,
            file,
            src: "",
          };
          const fr = new FileReader();
          fr.readAsDataURL(file);
          fr.onload = (e) => {
            if (!e.target) return;
            const src = e.target.result as string;

            setFieldValue(`images.${values.images.length}`, {
              ...newImage,
              src,
            });
          };
          insertListItem("images", newImage);

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
              //   onClick={() =>
              //     setImageFiles((pv) =>
              //       pv.filter((imageF) => imageF.id !== imageFile.id)
              //     )
              //   }
            >
              <IconTrash size={16} style={{ cursor: "pointer" }} />
            </ActionIcon>
          </Carousel.Slide>
        ))}
      </Carousel>
    </Create>
  );
};
