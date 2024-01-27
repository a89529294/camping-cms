import { IResourceComponentsProps } from "@refinedev/core";
import { Edit, useForm } from "@refinedev/mantine";
import { NumberInput, TextInput, Checkbox } from "@mantine/core";

export const NewsEdit: React.FC<IResourceComponentsProps> = () => {
  const {
    getInputProps,
    saveButtonProps,
    setFieldValue,
    refineCore: { queryResult },
  } = useForm({
    initialValues: {
      title: "",
      content: "",
      startDate: "",
      endDate: "",
      isTop: "",
    },
  });

  const newsData = queryResult?.data?.data;

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <TextInput mt="sm" label="Title" {...getInputProps("title")} />
      <TextInput mt="sm" label="Content" {...getInputProps("content")} />
      {/* 
                    DatePicker component is not included in "@refinedev/mantine" package.
                    To use a <DatePicker> component, you can follow the official documentation for Mantine.
                    
                    Docs: https://mantine.dev/dates/date-picker/
                */}
      <TextInput mt="sm" label="Start Date" {...getInputProps("startDate")} />
      {/* 
                    DatePicker component is not included in "@refinedev/mantine" package.
                    To use a <DatePicker> component, you can follow the official documentation for Mantine.
                    
                    Docs: https://mantine.dev/dates/date-picker/
                */}
      <TextInput mt="sm" label="End Date" {...getInputProps("endDate")} />
      <Checkbox
        mt="sm"
        label="Is Top"
        {...getInputProps("isTop", { type: "checkbox" })}
      />
    </Edit>
  );
};
