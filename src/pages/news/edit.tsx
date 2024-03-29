import { IResourceComponentsProps } from "@refinedev/core";
import { Edit, ListButton, DeleteButton, useForm } from "@refinedev/mantine";
import {
  TextInput,
  Checkbox,
  Image,
  ActionIcon,
  FileInput,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { Breadcrumb } from "../../components/breadcrumb";
import { Carousel } from "@mantine/carousel";
import { LocalImage, RemoteImage } from "../../types";
import { useEffect, useState } from "react";
import { IconTrash } from "@tabler/icons";
import { SaveButton } from "../../components/buttons/save";
import { useNavigate } from "react-router-dom";
import { extraDeleteButtonProps } from "../../components/buttons";

const sliderSize = 200;

export const NewsEdit: React.FC<IResourceComponentsProps> = () => {
  const navigate = useNavigate();
  const [initImagesSet, setInitImagesSet] = useState(false);
  const [currentImages, setCurrentImages] = useState<
    (RemoteImage | LocalImage)[]
  >([]);
  const {
    getInputProps,
    saveButtonProps,
    setFieldValue,
    refineCore: { queryResult },
  } = useForm({
    initialValues: {
      title: "",
      content: "",
      startDate: new Date(),
      endDate: new Date(),
      isTop: "",
      images: [],
    },
    refineCoreProps: {
      successNotification: () => ({
        message: "修改消息成功",
        type: "success",
      }),
    },
    validate: {
      title: (value) => (value.length === 0 ? "標題為必填" : null),
      content: (value) => (value.length === 0 ? "內容為必填" : null),
      startDate: (value) => (!value ? "起始日期為必填" : null),
      endDate: (value) => (!value ? "結束日期為必填" : null),
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
        oldImages: currentImages
          .filter((v): v is RemoteImage => "url" in v)
          .map((v) => v.id),
        newImages: currentImages
          .filter((v): v is LocalImage => "file" in v)
          .map((v) => v.file),
      };
    },
  });

  useEffect(() => {
    if (!queryResult || initImagesSet || !queryResult.isSuccess) return;
    setInitImagesSet(true);

    setCurrentImages(queryResult.data?.data.images);
  }, [queryResult, initImagesSet]);

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
      title="修改最新消息"
      breadcrumb={<Breadcrumb />}
      headerButtons={({ listButtonProps }) => (
        <>
          {listButtonProps && (
            <ListButton {...listButtonProps}>列表</ListButton>
          )}

          <DeleteButton
            {...extraDeleteButtonProps}
            onSuccess={() => navigate("/news")}
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
      <TextInput required mt="sm" label="標題" {...getInputProps("title")} />
      <TextInput required mt="sm" label="內容" {...getInputProps("content")} />
      <DatePicker
        dropdownPosition="bottom-start"
        locale="zh-tw"
        label="起始日期"
        placeholder="請選擇日期"
        required
        {...getInputProps("startDate")}
      />

      <DatePicker
        dropdownPosition="top-start"
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
            setCurrentImages((pv) =>
              pv.map((imageFile) =>
                imageFile.id === imageId ? { ...imageFile, src } : imageFile
              )
            );
          };
          setCurrentImages((pv) => [
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
        {currentImages?.map((image) => (
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
              onClick={() =>
                setCurrentImages((pv) =>
                  pv.filter((imageF) => imageF.id !== image.id)
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
    </Edit>
  );
};
