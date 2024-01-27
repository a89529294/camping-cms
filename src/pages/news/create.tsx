import { IResourceComponentsProps } from "@refinedev/core";
import { Create, useForm } from "@refinedev/mantine";
import { TextInput, Checkbox } from "@mantine/core";

export const NewsCreate: React.FC<IResourceComponentsProps> = () => {
  const {
    getInputProps,
    saveButtonProps,
    setFieldValue,
    refineCore: { formLoading },
  } = useForm({
    initialValues: {
      title: "",
      content: "",
      startDate: "",
      endDate: "",
      isTop: false,
      createdAt: "",
      updatedAt: "",
    },
    validate: {
      title: (value) => (value.length === 0 ? "標題為必填" : null),
      content: (value) => (value.length === 0 ? "內容為必填" : null),
      startDate: (value) => (value.length === 0 ? "起始日期為必填" : null),
      endDate: (value) => (value.length === 0 ? "結束日期為必填" : null),
    },
    refineCoreProps: {
      successNotification: () => ({
        message: "新增消息成功",
        type: "success",
      }),
    },
  });

  return (
    <Create isLoading={formLoading} saveButtonProps={saveButtonProps}>
      <TextInput required mt="sm" label="標題" {...getInputProps("title")} />
      <TextInput required mt="sm" label="內容" {...getInputProps("content")} />
      {/* 
                    DatePicker component is not included in "@refinedev/mantine" package.
                    To use a <DatePicker> component, you can follow the official documentation for Mantine.
                    
                    Docs: https://mantine.dev/dates/date-picker/
                */}
      <TextInput
        required
        mt="sm"
        label="起始日期"
        {...getInputProps("startDate")}
      />
      {/* 
                    DatePicker component is not included in "@refinedev/mantine" package.
                    To use a <DatePicker> component, you can follow the official documentation for Mantine.
                    
                    Docs: https://mantine.dev/dates/date-picker/
                */}
      <TextInput
        required
        mt="sm"
        label="結束日期"
        {...getInputProps("endDate")}
      />
      <Checkbox
        mt="sm"
        label="Is Top"
        {...getInputProps("isTop", { type: "checkbox" })}
      />
    </Create>
  );
};
