import React from "react";
import { IResourceComponentsProps } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import { ColumnDef, flexRender } from "@tanstack/react-table";
import { ScrollArea, Table, Pagination, Group } from "@mantine/core";
import { List, EditButton, ShowButton, DeleteButton } from "@refinedev/mantine";

type ColumnMeta = {
  width?: number | string;
  truncate?: boolean;
};

export const NewsList: React.FC<IResourceComponentsProps> = () => {
  const columns = React.useMemo<ColumnDef<any>[]>(
    () => [
      {
        id: "id",
        accessorKey: "id",
        header: "Id",
      },
      {
        id: "title",
        accessorKey: "title",
        header: "標題",
        meta: { width: 245, truncate: true },
      },
      {
        id: "content",
        accessorKey: "content",
        header: "內容",
        meta: { width: 500, truncate: true },
      },
      {
        id: "startDate",
        accessorKey: "startDate",
        header: "起始時間",
      },
      {
        id: "endDate",
        accessorKey: "endDate",
        header: "結束時間",
      },
      {
        id: "actions",
        accessorKey: "id",
        header: "",
        cell: function render({ getValue }) {
          return (
            <Group spacing="xs" noWrap>
              <ShowButton hideText recordItemId={getValue() as string} />
              <EditButton hideText recordItemId={getValue() as string} />
            </Group>
          );
        },
      },
    ],
    []
  );

  const {
    getHeaderGroups,
    getRowModel,
    setOptions,
    refineCore: {
      setCurrent,
      pageCount,
      current,
      tableQueryResult: { data: tableData },
    },
  } = useTable({
    columns,
  });

  setOptions((prev) => ({
    ...prev,
    meta: {
      ...prev.meta,
    },
  }));

  return (
    <List
      createButtonProps={{
        children: "新增消息",
        svgIconProps: { style: { display: "none" } },
      }}
      title="最新消息"
    >
      <ScrollArea>
        <Table highlightOnHover>
          <thead>
            {getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      style={{
                        width: (header.column.columnDef.meta as ColumnMeta)
                          ?.width
                          ? (header.column.columnDef.meta as ColumnMeta)?.width
                          : "auto",
                      }}
                    >
                      {!header.isPlaceholder &&
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {getRowModel().rows.map((row) => {
              return (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td
                        key={cell.id}
                        style={{
                          overflow: (cell.column.columnDef.meta as ColumnMeta)
                            ?.truncate
                            ? "hidden"
                            : undefined,
                          textOverflow: (
                            cell.column.columnDef.meta as ColumnMeta
                          )?.truncate
                            ? "ellipsis"
                            : undefined,
                          whiteSpace: (cell.column.columnDef.meta as ColumnMeta)
                            ?.truncate
                            ? "nowrap"
                            : undefined,
                          width: (cell.column.columnDef.meta as ColumnMeta)
                            ?.width
                            ? (cell.column.columnDef.meta as ColumnMeta).width
                            : "auto",
                          maxWidth: (cell.column.columnDef.meta as ColumnMeta)
                            ?.width
                            ? (cell.column.columnDef.meta as ColumnMeta).width
                            : "auto",
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </Table>
      </ScrollArea>
      <br />
      <Pagination
        position="right"
        total={pageCount}
        page={current}
        onChange={setCurrent}
      />
    </List>
  );
};
