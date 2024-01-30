import { IResourceComponentsProps } from "@refinedev/core";
import { Edit, useForm } from "@refinedev/mantine";
import { TextInput, Image, ActionIcon, FileInput } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import { sliderSize } from "../../constants";
import { IconTrash } from "@tabler/icons";
import { LocalImage, RemoteImage } from "../../types";

export const RoomEdit: React.FC<IResourceComponentsProps> = () => {
  const {
    getInputProps,
    saveButtonProps,
    setFieldValue,
    refineCore: { queryResult },
    values,
    insertListItem,
    removeListItem,
  } = useForm({
    initialValues: {
      name: "",
      intro: "",
      images: [] as (RemoteImage | LocalImage)[],
    },
    transformValues: (values) => {
      return {
        ...values,
        count: 1,
        maxCount: 1,
        checkinTime: "12:00:00.000",
        checkoutTime: "18:00:00.000",
        oldImages: values.images
          .filter((v): v is RemoteImage => "url" in v)
          .map((v) => v.id),
        newImages: values.images
          .filter((v): v is LocalImage => "file" in v)
          .map((v) => v.file),
      };
    },
  });

  const Data = queryResult?.data?.data;

  return (
    <Edit saveButtonProps={saveButtonProps}>
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
        {values.images.map((imageFile, i) => (
          <Carousel.Slide key={imageFile.id}>
            <Image
              width={sliderSize}
              height={sliderSize}
              src={"file" in imageFile ? imageFile.src : imageFile.url}
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
              onClick={() => removeListItem("images", i)}
            >
              <IconTrash size={16} style={{ cursor: "pointer" }} />
            </ActionIcon>
          </Carousel.Slide>
        ))}
      </Carousel>
    </Edit>
  );
};