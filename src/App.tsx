import {
  AuthBindings,
  GitHubBanner,
  Refine,
  Authenticated,
} from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import { MantineInferencer } from "@refinedev/inferencer/mantine";

import {
  AuthPage,
  ErrorComponent,
  notificationProvider,
  RefineThemes,
  ThemedLayoutV2,
} from "@refinedev/mantine";

import {
  ColorScheme,
  ColorSchemeProvider,
  Global,
  MantineProvider,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { NotificationsProvider } from "@mantine/notifications";
import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import { dataProvider } from "./rest-data-provider";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { axiosInstance } from "./rest-data-provider/utils";

const baseURL = "https://love-spending-time-api.caprover.credot-web.com";
const localStorageUserKey = "refine-tutorial-auth-user";

const authProvider: AuthBindings = {
  login: async ({ email, password, remember }) => {
    console.log(email, password, remember);

    try {
      const response = await axiosInstance.post(`${baseURL}/api/auth/local`, {
        identifier: "Albert",
        password: "d^jgg8&&%wE48J",
      });

      const user = response.data.user;
      console.log(user);
      axiosInstance.defaults.headers.common = {
        Authorization: `Bearer ${response.data.jwt}`,
      };

      localStorage.setItem(localStorageUserKey, JSON.stringify(user));

      return {
        success: true,
        redirectTo: "/",
      };
    } catch (e) {
      localStorage.removeItem(localStorageUserKey);
      return {
        success: false,
        error: {
          message: "Login failed",
          name: "Invalid email or password",
        },
      };
    }
  },
  logout: async () => {
    localStorage.removeItem(localStorageUserKey);
    return {
      success: true,
      redirectTo: "/",
    };
  },
  onError: async (error) => {
    localStorage.removeItem(localStorageUserKey);
    console.error(error);
    return { error, redirectTo: "/login" };
  },
  check: async () => {
    try {
      const response = await axiosInstance.get(`${baseURL}/api/users/me`);

      const user = response.data;
      console.log(user);
      localStorage.setItem(localStorageUserKey, JSON.stringify(user));

      return { authenticated: true };
    } catch (e) {
      localStorage.removeItem(localStorageUserKey);

      return {
        authenticated: false,
        // redirectTo: "/login",
        error: {
          message: "Check failed",
          name: "Not authenticated",
        },
      };
    }
  },
  getIdentity: async () => ({
    id: JSON.parse(localStorage.getItem(localStorageUserKey) ?? "").username,
    name: JSON.parse(localStorage.getItem(localStorageUserKey) ?? "").username,
    avatar: "https://unsplash.com/photos/IWLOvomUmWU/download?force=true&w=640",
  }),
};

function App() {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "mantine-color-scheme",
    defaultValue: "dark",
    getInitialValueInEffect: true,
  });

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ColorSchemeProvider
          colorScheme={colorScheme}
          toggleColorScheme={toggleColorScheme}
        >
          {/* You can change the theme colors here. example: theme={{ ...RefineThemes.Magenta, colorScheme:colorScheme }} */}
          <MantineProvider
            theme={{ ...RefineThemes.Blue, colorScheme: colorScheme }}
            withNormalizeCSS
            withGlobalStyles
          >
            <Global styles={{ body: { WebkitFontSmoothing: "auto" } }} />
            <NotificationsProvider position="top-right">
              <DevtoolsProvider>
                <Refine
                  authProvider={authProvider}
                  dataProvider={dataProvider(`${baseURL}/api`, axiosInstance)}
                  notificationProvider={notificationProvider}
                  routerProvider={routerBindings}
                  options={{
                    syncWithLocation: true,
                    warnWhenUnsavedChanges: true,
                    useNewQueryKeys: true,
                    projectId: "i6hK1s-y7TgSi-YNpNH3",
                  }}
                  resources={[
                    {
                      name: "news",
                      list: "/news",
                      show: "/news/show/:id",
                      create: "/news/create",
                      edit: "/news/edit/:id",
                    },
                  ]}
                >
                  <Routes>
                    <Route
                      element={
                        <Authenticated
                          key="1"
                          fallback={<CatchAllNavigate to="/login" />}
                        >
                          <ThemedLayoutV2 Title={() => "愛 聚時光"}>
                            <Outlet />
                          </ThemedLayoutV2>
                        </Authenticated>
                      }
                    >
                      <Route
                        index
                        element={<NavigateToResource resource="news" />}
                      />

                      <Route path="news">
                        {/* <Route index element={<BlogPostList />} /> */}
                        {/* <Route path="show/:id" element={<BlogPostShow />} />
                        <Route path="edit/:id" element={<BlogPostEdit />} />
                        <Route path="create" element={<BlogPostCreate />} /> */}

                        {/* right now the types don't match */}
                        <Route index element={<MantineInferencer />} />
                        {/* <Route
                          path="show/:id"
                          element={<MantineInferencer />}
                        />
                        <Route
                          path="edit/:id"
                          element={<MantineInferencer />}
                        />
                        <Route path="create" element={<MantineInferencer />} /> */}
                      </Route>
                    </Route>

                    <Route
                      element={
                        <Authenticated key="2" fallback={<Outlet />}>
                          <NavigateToResource />
                        </Authenticated>
                      }
                    >
                      <Route
                        path="/login"
                        element={<AuthPage type="login" />}
                      />
                    </Route>
                    <Route
                      element={
                        <Authenticated key="3" fallback={<Outlet />}>
                          <ThemedLayoutV2>
                            <Outlet />
                          </ThemedLayoutV2>
                        </Authenticated>
                      }
                    >
                      <Route path="*" element={<ErrorComponent />} />
                    </Route>
                  </Routes>
                  <RefineKbar />
                  <UnsavedChangesNotifier />
                  <DocumentTitleHandler />
                </Refine>
                <DevtoolsPanel />
              </DevtoolsProvider>
            </NotificationsProvider>
          </MantineProvider>
        </ColorSchemeProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
