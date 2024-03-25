import React from "react";
import { IResourceComponentsProps } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import { ColumnDef, flexRender } from "@tanstack/react-table";
import { ScrollArea, Table, Pagination, Group, Flex } from "@mantine/core";
import { List, EditButton, ShowButton, DeleteButton } from "@refinedev/mantine";
import { ColumnMeta } from "../../types";

export const RoomList: React.FC<IResourceComponentsProps> = () => {
  const columns = React.useMemo<ColumnDef<any>[]>(
    () => [
      {
        id: "id",
        accessorKey: "id",
        header: "Id",
        meta: { width: 100 },
      },
      {
        id: "name",
        accessorKey: "name",
        header: "房型名稱",
        meta: { width: 200 },
      },
      {
        id: "intro",
        accessorKey: "intro",
        header: "房型介紹",
        meta: { width: 700 },
      },
      {
        id: "actions",
        accessorKey: "id",
        header: "",
        meta: { width: "auto" },
        cell: function render({ getValue }) {
          return (
            <Flex gap="xs" justify="end">
              <ShowButton hideText recordItemId={getValue() as string} />
              <EditButton hideText recordItemId={getValue() as string} />
            </Flex>
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
        children: "新增房型",
        svgIconProps: { style: { display: "none" } },
      }}
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
                      <td key={cell.id}>
                        <div
                          className="truncate"
                          style={{
                            width: (cell.column.columnDef.meta as ColumnMeta)
                              ?.width
                              ? (cell.column.columnDef.meta as ColumnMeta)
                                  ?.width
                              : "auto",
                          }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </div>
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
