import React from "react";
import {
  matchResourceFromRoute,
  useBreadcrumb,
  useLink,
  useRefineContext,
  useResource,
  useRouterContext,
  useRouterType,
} from "@refinedev/core";
import { BreadcrumbProps } from "@refinedev/mantine";
import { Text, Breadcrumbs, Anchor, Group } from "@mantine/core";
import { IconHome } from "@tabler/icons";

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  breadcrumbProps,
  showHome = true,
  hideIcons = false,
  meta,
}) => {
  const routerType = useRouterType();
  let { breadcrumbs } = useBreadcrumb({ meta });
  const Link = useLink();
  const { Link: LegacyLink } = useRouterContext();

  const { hasDashboard } = useRefineContext();

  const { resources } = useResource();

  const rootRouteResource = matchResourceFromRoute("/", resources);

  const ActiveLink = routerType === "legacy" ? LegacyLink : Link;

  if (breadcrumbs.length === 1) {
    return null;
  }

  breadcrumbs = breadcrumbs.map((breadcrumb) => {
    if (breadcrumb.label === "Show")
      return {
        ...breadcrumb,
        label: "細節",
      };
    if (breadcrumb.label === "Edit")
      return {
        ...breadcrumb,
        label: "修改",
      };
    if (breadcrumb.label === "Create")
      return {
        ...breadcrumb,
        label: "新增",
      };
    return breadcrumb;
  });

  return (
    <Breadcrumbs
      aria-label="breadcrumb"
      styles={{
        separator: { marginRight: 8, marginLeft: 8, color: "dimgray" },
      }}
      {...breadcrumbProps}
    >
      {showHome && (hasDashboard || rootRouteResource.found) && (
        <Anchor component={ActiveLink as any} color="dimmed" to="/">
          {rootRouteResource?.resource?.meta?.icon ?? <IconHome size={18} />}
        </Anchor>
      )}
      {breadcrumbs.map(({ label, icon, href }) => {
        return (
          <Group key={label} spacing={4} align="center" noWrap>
            {!hideIcons && icon}
            {href ? (
              <Anchor
                component={ActiveLink as any}
                color="dimmed"
                to={href}
                size="sm"
              >
                {label}
              </Anchor>
            ) : (
              <Text color="dimmed" size="sm">
                {label}
              </Text>
            )}
          </Group>
        );
      })}
    </Breadcrumbs>
  );
};
