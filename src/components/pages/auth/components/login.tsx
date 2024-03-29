import React from "react";
import {
  LoginPageProps,
  LoginFormTypes,
  useRouterType,
  useLink,
  useActiveAuthProvider,
  useLogin,
  useRouterContext,
} from "@refinedev/core";
import { ThemedTitleV2, FormContext } from "@refinedev/mantine";
import { FormPropsType } from "../index";
import {
  layoutStyles,
  cardStyles,
  titleStyles,
  pageTitleStyles,
} from "./styles";
import {
  Box,
  Card,
  Checkbox,
  PasswordInput,
  Space,
  TextInput,
  Title,
  Anchor,
  Button,
  Text,
  Divider,
  Stack,
  BoxProps,
  CardProps,
  useMantineTheme,
} from "@mantine/core";
import {
  localStorageRememberMeKey,
  localStorageUserIdentifierKey,
  localStorageUserPasswordKey,
} from "../../../../constants";

type LoginProps = LoginPageProps<BoxProps, CardProps, FormPropsType>;

/**
 * **refine** has a default login page form which is served on `/login` route when the `authProvider` configuration is provided.
 * @see {@link https://refine.dev/docs/api-reference/mantine/components/mantine-auth-page/#login} for more details.
 */
export const LoginPage: React.FC<LoginProps> = ({
  providers,
  rememberMe,
  contentProps,
  wrapperProps,
  renderContent,
  formProps,
  title,
  hideForm,
}) => {
  const theme = useMantineTheme();
  const { useForm, FormProvider } = FormContext;
  const { onSubmit: onSubmitProp, ...useFormProps } = formProps || {};

  const remember = !!localStorage.getItem(localStorageRememberMeKey);
  let identifier = "";
  let password = "";

  if (remember) {
    identifier = localStorage.getItem(localStorageUserIdentifierKey) ?? "";
    password = localStorage.getItem(localStorageUserPasswordKey) ?? "";
  }

  const form = useForm({
    initialValues: {
      identifier,
      password,
      remember,
    },
    validate: {
      identifier: (value: any) => (value.length === 0 ? "請填入用戶名" : null),
      password: (value: any) => (value.length === 0 ? "請填入用密碼" : null),
    },
    ...useFormProps,
  });
  const { onSubmit, getInputProps } = form;

  const authProvider = useActiveAuthProvider();
  const { mutate: login, isLoading } = useLogin<LoginFormTypes>({
    v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
  });

  const PageTitle =
    title === false ? null : (
      <div style={pageTitleStyles}>
        {title ?? <ThemedTitleV2 collapsed={false} />}
      </div>
    );

  const renderProviders = () => {
    if (providers && providers.length > 0) {
      return (
        <>
          <Stack spacing={8}>
            {providers.map((provider) => {
              return (
                <Button
                  key={provider.name}
                  variant="default"
                  fullWidth
                  leftIcon={provider.icon}
                  onClick={() =>
                    login({
                      providerName: provider.name,
                    })
                  }
                >
                  {provider.label}
                </Button>
              );
            })}
          </Stack>
          {!hideForm && <Divider my="md" labelPosition="center" label="or" />}
        </>
      );
    }
    return null;
  };

  const CardContent = (
    <Card style={cardStyles} {...(contentProps ?? {})}>
      <Title
        style={titleStyles}
        color={theme.colorScheme === "dark" ? "brand.5" : "brand.8"}
      >
        愛 聚時光管理系統
      </Title>
      <Space h="sm" />
      <Space h="lg" />
      {renderProviders()}
      {!hideForm && (
        <FormProvider form={form}>
          <form
            onSubmit={onSubmit((values: any) => {
              if (onSubmitProp) {
                return onSubmitProp(values);
              }
              return login(values);
            })}
          >
            <TextInput
              name="identifier"
              label="用戶名"
              placeholder="用戶名"
              {...getInputProps("identifier")}
            />
            <PasswordInput
              name="password"
              autoComplete="current-password"
              mt="md"
              label="密碼"
              placeholder="●●●●●●●●"
              {...getInputProps("password")}
            />
            <Box
              mt="md"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {rememberMe ?? (
                <Checkbox
                  label="記得我"
                  size="xs"
                  {...getInputProps("remember", {
                    type: "checkbox",
                  })}
                />
              )}
            </Box>
            <Button
              mt="md"
              fullWidth
              size="md"
              type="submit"
              loading={isLoading}
            >
              登入
            </Button>
          </form>
        </FormProvider>
      )}
    </Card>
  );

  return (
    <Box
      style={{
        ...layoutStyles,
        justifyContent: hideForm ? "flex-start" : layoutStyles.justifyContent,
        paddingTop: hideForm ? "15dvh" : layoutStyles.padding,
      }}
      {...(wrapperProps ?? {})}
    >
      {renderContent ? (
        renderContent(CardContent, PageTitle)
      ) : (
        <>
          {/* {PageTitle} */}
          {CardContent}
        </>
      )}
    </Box>
  );
};
