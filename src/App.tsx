import { AuthBindings, Refine, Authenticated } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import { MantineInferencer } from "@refinedev/inferencer/mantine";

import {
  ErrorComponent,
  notificationProvider,
  RefineThemes,
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
import { NewsList } from "./pages/news/list";
import { ThemedLayoutV2 } from "./components/layout";
import { NewsCreate } from "./pages/news/create";
import { NewsShow } from "./pages/news/show";
import { NewsEdit } from "./pages/news/edit";
import { AuthPage } from "./components/pages/auth";

const baseURL = "https://love-spending-time-api.caprover.credot-web.com";
const localStorageUserKey = "refine-tutorial-auth-user";
const localStorageJWTKey = "refine-tutorial-auth-jwt";

const authProvider: AuthBindings = {
  login: async ({ identifier, password, remember }) => {
    console.log(identifier, password, remember);

    try {
      const response = await axiosInstance.post(`${baseURL}/api/auth/local`, {
        identifier,
        password,
      });

      const { user, jwt } = response.data;

      axiosInstance.defaults.headers.common = {
        Authorization: `Bearer ${jwt}`,
      };

      localStorage.setItem(localStorageUserKey, JSON.stringify(user));
      localStorage.setItem(localStorageJWTKey, JSON.stringify(jwt));

      return {
        success: true,
        redirectTo: "/",
      };
    } catch (e) {
      localStorage.removeItem(localStorageUserKey);
      localStorage.removeItem(localStorageJWTKey);
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
    localStorage.removeItem(localStorageUserKey);
    return {
      success: true,
      redirectTo: "/",
    };
  },
  onError: async (error) => {
    localStorage.removeItem(localStorageUserKey);
    localStorage.removeItem(localStorageJWTKey);
    console.error(error);
    return { error, redirectTo: "/login" };
  },
  check: async () => {
    try {
      const rawJWT = localStorage.getItem(localStorageJWTKey);
      const jwt = rawJWT ? JSON.parse(rawJWT) : null;
      if (jwt)
        axiosInstance.defaults.headers.common = {
          Authorization: `Bearer ${jwt}`,
        };

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
            <Global
              styles={{
                html: { overflowX: "hidden" },
                body: { WebkitFontSmoothing: "auto" },
              }}
            />
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
                          {/* If you want to change the default themed layout;
You should pass layout related components to the <ThemedLayoutV2 /> component's props. */}
                          <ThemedLayoutV2 Title={() => <div>愛 聚時光</div>}>
                            <Outlet />
                          </ThemedLayoutV2>
                        </Authenticated>
                      }
                    >
                      <Route
                        index
                        element={<NavigateToResource resource="news" />}
                      />

                      <Route path="/news">
                        {/* <Route index element={<BlogPostList />} /> */}
                        {/* <Route path="show/:id" element={<BlogPostShow />} />
                        <Route path="edit/:id" element={<BlogPostEdit />} />
                        <Route path="create" element={<BlogPostCreate />} /> */}

                        <Route index element={<NewsList />} />
                        <Route path="create" element={<NewsCreate />} />
                        <Route path="show/:id" element={<NewsShow />} />
                        <Route path="edit/:id" element={<NewsEdit />} />
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
