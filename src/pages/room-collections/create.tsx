import { IResourceComponentsProps } from "@refinedev/core";
import { Create, useForm } from "@refinedev/mantine";
import {
  FileInput,
  TextInput,
  Image,
  ActionIcon,
  Mark,
  Title,
} from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import { sliderSize } from "../../constants";
import { LocalImage } from "../../types";
import { IconTrash } from "@tabler/icons";
import { SaveButton } from "../../components/buttons/save";
import { Breadcrumb } from "../../components/breadcrumb";
import { MantineRichTextEditor } from "../../components/mantine-rich-text-editor";
import { useState } from "react";
import DOMPurify from "dompurify";

export const RoomCreate: React.FC<IResourceComponentsProps> = () => {
  const [weekDaysVsHolidaysContent, setWeekDaysVsHolidaysContent] =
    useState("");
  const [checkInRequirementsContent, setCheckInRequirementsContent] =
    useState("");
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
      intro: "",
      weekDaysVsHolidays: "",
      checkInRequirements: "",
      images: [] as LocalImage[],
    },
    transformValues: (v) => ({
      ...v,
      images: v.images.map((image) => image.file),
      count: 1,
      maxCount: 1,
      checkinTime: "12:00:00.000",
      checkoutTime: "18:00:00.000",
      holidayJudgment: DOMPurify.sanitize(weekDaysVsHolidaysContent),
      notice: DOMPurify.sanitize(checkInRequirementsContent),
    }),
    refineCoreProps: {
      successNotification: () => ({
        message: "新增房型成功",
        type: "success",
      }),
      redirect: "list",
    },
  });

  console.log(values.images);

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
      <Title size="14px" mt="sm" sx={{ lineHeight: 1.55 }}>
        平假日判斷
      </Title>
      <MantineRichTextEditor
        content={weekDaysVsHolidaysContent}
        setContent={setWeekDaysVsHolidaysContent}
      ></MantineRichTextEditor>
      <Title size="14px" mt="sm" sx={{ lineHeight: 1.55 }}>
        入住須知
      </Title>
      <MantineRichTextEditor
        content={checkInRequirementsContent}
        setContent={setCheckInRequirementsContent}
      ></MantineRichTextEditor>

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
            const newImage = {
              id: imageId,
              file,
              src: "",
            };
            const fr = new FileReader();
            fr.readAsDataURL(file);
            console.log(imageId);
            fr.onload = (e) => {
              if (!e.target) return;
              const src = e.target.result as string;

              // setFieldValue(`images.${values.images.length}`, {
              //   ...newImage,
              //   src,
              // });
              console.log(src);
              insertListItem("images", { ...newImage, src });
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
        {values.images.map((imageFile, i) => (
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
              onClick={() => removeListItem("images", i)}
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
