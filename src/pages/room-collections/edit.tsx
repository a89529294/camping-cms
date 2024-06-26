import { IResourceComponentsProps } from "@refinedev/core";
import { DeleteButton, Edit, ListButton, useForm } from "@refinedev/mantine";
import { TextInput, Image, ActionIcon, FileInput, Title } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import { sliderSize } from "../../constants";
import { IconTrash } from "@tabler/icons";
import { LocalImage, RemoteImage } from "../../types";
import { SaveButton } from "../../components/buttons/save";
import { Breadcrumb } from "../../components/breadcrumb";
import { useNavigate } from "react-router-dom";
import { extraDeleteButtonProps } from "../../components/buttons";
import { useEffect, useState } from "react";
import { MantineRichTextEditor } from "../../components/mantine-rich-text-editor";
import DOMPurify from "dompurify";

export const RoomEdit: React.FC<IResourceComponentsProps> = () => {
  const navigate = useNavigate();
  const [weekDaysVsHolidaysContent, setWeekDaysVsHolidaysContent] = useState<
    null | string
  >(null);
  const [checkInRequirementsContent, setCheckInRequirementsContent] = useState<
    null | string
  >(null);
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
      weekDaysVsHolidays: "",
      checkInRequirements: "",
      images: [] as (RemoteImage | LocalImage)[],
    },
    transformValues: (values) => {
      return {
        ...values,
        count: 1,
        maxCount: 1,
        checkinTime: "12:00:00.000",
        checkoutTime: "18:00:00.000",
        holidayJudgment: DOMPurify.sanitize(weekDaysVsHolidaysContent ?? ""),
        notice: DOMPurify.sanitize(checkInRequirementsContent ?? ""),
        oldImages: values.images
          .filter((v): v is RemoteImage => "url" in v)
          .map((v) => v.id),
        newImages: values.images
          .filter((v): v is LocalImage => "file" in v)
          .map((v) => v.file),
      };
    },
  });

  useEffect(() => {
    console.log(queryResult?.data?.data.holidayJudgment);
    setWeekDaysVsHolidaysContent(queryResult?.data?.data.holidayJudgment ?? "");
    setCheckInRequirementsContent(queryResult?.data?.data.notice ?? "");
  }, [queryResult?.data?.data]);

  // TODO need to DOMPurify holidayJudgment and notice before saving data

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
      title="修改房型細節"
      breadcrumb={<Breadcrumb />}
      headerButtons={({ listButtonProps }) => (
        <>
          {listButtonProps && (
            <ListButton {...listButtonProps}>列表</ListButton>
          )}

          <DeleteButton
            {...extraDeleteButtonProps}
            onSuccess={() => navigate("/rooms-collections")}
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
      <TextInput mt="sm" label="房型名稱" {...getInputProps("name")} />
      <TextInput mt="sm" label="房型介紹" {...getInputProps("intro")} />

      <Title size="14px" mt="sm" sx={{ lineHeight: 1.55 }}>
        平假日判斷
      </Title>
      {weekDaysVsHolidaysContent !== null && (
        <MantineRichTextEditor
          content={weekDaysVsHolidaysContent}
          setContent={setWeekDaysVsHolidaysContent}
        ></MantineRichTextEditor>
      )}
      <Title size="14px" mt="sm" sx={{ lineHeight: 1.55 }}>
        入住須知
      </Title>
      {checkInRequirementsContent !== null && (
        <MantineRichTextEditor
          content={checkInRequirementsContent}
          setContent={setCheckInRequirementsContent}
        ></MantineRichTextEditor>
      )}

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
            fr.onload = (e) => {
              if (!e.target) return;
              const src = e.target.result as string;

              // setFieldValue(`images.${values.images.length}`, {
              //   ...newImage,
              //   src,
              // });
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
