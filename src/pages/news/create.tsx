import { IResourceComponentsProps } from "@refinedev/core";
import { Create, useForm } from "@refinedev/mantine";
import {
  TextInput,
  Checkbox,
  FileInput,
  Image,
  ActionIcon,
} from "@mantine/core";
import { Breadcrumb } from "../../components/breadcrumb";
import { DatePicker } from "@mantine/dates";
import { Carousel } from "@mantine/carousel";
import { useState } from "react";
import { IconTrash } from "@tabler/icons";
import { SaveButton } from "../../components/buttons/save";
import { LocalImage } from "../../types";

export const NewsCreate: React.FC<IResourceComponentsProps> = () => {
  const [imageFiles, setImageFiles] = useState<LocalImage[]>([]);
  const {
    getInputProps,
    saveButtonProps,
    setFieldValue,
    refineCore: { formLoading },
  } = useForm({
    initialValues: {
      title: "",
      content: "",
      startDate: new Date(),
      endDate: new Date(),
      isTop: false,
    },
    validate: {
      title: (value) => (value.length === 0 ? "標題為必填" : null),
      content: (value) => (value.length === 0 ? "內容為必填" : null),
      startDate: (value) => (!value ? "起始日期為必填" : null),
      endDate: (value) => (!value ? "結束日期為必填" : null),
    },
    refineCoreProps: {
      successNotification: () => ({
        message: "新增消息成功",
        type: "success",
      }),
    },
    transformValues: (values) => {
      return {
        ...values,
        startDate: new Date(values.startDate.getTime() + 8 * 60 * 60 * 1000)
          .toISOString()
          .slice(0, 10),
        endDate: new Date(values.endDate.getTime() + 8 * 60 * 60 * 1000)
          .toISOString()
          .slice(0, 10),
        images: imageFiles.map((v) => v.file),
      };
    },
  });

  const sliderSize = 200;

  return (
    <Create
      isLoading={formLoading}
      footerButtons={() => (
        <>
          <SaveButton {...saveButtonProps}>新增</SaveButton>
        </>
      )}
      breadcrumb={<Breadcrumb />}
      title="新增最新消息"
      wrapperProps={{
        mih: "100%",
        children: undefined,
      }}
    >
      <TextInput required mt="sm" label="標題" {...getInputProps("title")} />
      <TextInput required mt="sm" label="內容" {...getInputProps("content")} />
      <DatePicker
        mt="sm"
        dropdownPosition="bottom-start"
        locale="zh-tw"
        label="起始日期"
        placeholder="請選擇日期"
        required
        {...getInputProps("startDate")}
      />

      <DatePicker
        mt="sm"
        dropdownPosition="bottom-start"
        locale="zh-tw"
        label="結束日期"
        placeholder="請選擇日期"
        required
        {...getInputProps("endDate")}
      />
      <FileInput
        value={null}
        mt="sm"
        label="上傳圖片"
        required
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
      <Checkbox
        mt="sm"
        label="Is Top"
        {...getInputProps("isTop", { type: "checkbox" })}
      />
    </Create>
  );
};
