import "dayjs/locale/zh-tw";
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
import {
  localStorageRememberMeKey,
  localStorageUserIdentifierKey,
  localStorageUserPasswordKey,
  baseURL,
  localStorageUserKey,
  localStorageJWTKey,
} from "./constants";
import { PlaygroundList } from "./pages/play-grounds/list";
import { PlaygroundCreate } from "./pages/play-grounds/create";
import { PlaygroundShow } from "./pages/play-grounds/show";
import { PlaygroundEdit } from "./pages/play-grounds/edit";
import { MealList } from "./pages/food-stories/list";
import { MealCreate } from "./pages/food-stories/create";
import { MealShow } from "./pages/food-stories/show";
import { MealEdit } from "./pages/food-stories/edit";
import { RoomList } from "./pages/room-collections/list";
import { RoomCreate } from "./pages/room-collections/create";
import { RoomShow } from "./pages/room-collections/show";
import { RoomEdit } from "./pages/room-collections/edit";

const authProvider: AuthBindings = {
  login: async ({ identifier, password, remember }) => {
    console.log(identifier, password, remember);

    if (remember) {
      localStorage.setItem(localStorageRememberMeKey, "true");
      localStorage.setItem(localStorageUserIdentifierKey, identifier);
      localStorage.setItem(localStorageUserPasswordKey, password);
    } else {
      localStorage.removeItem(localStorageRememberMeKey);
      localStorage.removeItem(localStorageUserIdentifierKey);
      localStorage.removeItem(localStorageUserPasswordKey);
    }

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
      localStorage.removeItem(localStorageRememberMeKey);
      localStorage.removeItem(localStorageUserIdentifierKey);
      localStorage.removeItem(localStorageUserPasswordKey);
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
                html: { overflowX: "hidden", height: "100%" },
                body: { WebkitFontSmoothing: "auto", height: "100%" },
                "#root": { height: "100%" },
                ".truncate": {
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                },
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
                      meta: { label: "最新消息" },
                    },
                    {
                      name: "play-grounds",
                      list: "/play-grounds",
                      show: "/play-grounds/show/:id",
                      create: "/play-grounds/create",
                      edit: "/play-grounds/edit/:id",
                      meta: { label: "親子設施" },
                    },
                    {
                      name: "food-stories",
                      list: "/food-stories",
                      show: "/food-stories/show/:id",
                      create: "/food-stories/create",
                      edit: "/food-stories/edit/:id",
                      meta: { label: "餐點組合" },
                    },
                    {
                      name: "room-collections",
                      list: "/room-collections",
                      show: "/room-collections/show/:id",
                      create: "/room-collections/create",
                      edit: "/room-collections/edit/:id",
                      meta: { label: "房型" },
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
                        <Route index element={<NewsList />} />
                        <Route path="create" element={<NewsCreate />} />
                        <Route path="show/:id" element={<NewsShow />} />
                        <Route path="edit/:id" element={<NewsEdit />} />
                      </Route>

                      <Route path="/play-grounds">
                        <Route index element={<PlaygroundList />} />
                        <Route path="create" element={<PlaygroundCreate />} />
                        <Route path="show/:id" element={<PlaygroundShow />} />
                        <Route path="edit/:id" element={<PlaygroundEdit />} />
                      </Route>

                      <Route path="/food-stories">
                        <Route index element={<MealList />} />
                        <Route path="create" element={<MealCreate />} />
                        <Route path="show/:id" element={<MealShow />} />
                        <Route path="edit/:id" element={<MealEdit />} />
                      </Route>

                      <Route path="/room-collections">
                        <Route index element={<RoomList />} />
                        <Route path="create" element={<RoomCreate />} />
                        <Route path="show/:id" element={<RoomShow />} />
                        <Route path="edit/:id" element={<RoomEdit />} />
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
