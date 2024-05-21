"use client";

// import Database from "@/lib/db";
import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  User,
  Pagination,
  Selection,
  ChipProps,
  SortDescriptor
} from "@nextui-org/react";

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";

import { PlusIcon, MagnifyingGlassIcon, DotsVerticalIcon } from '@radix-ui/react-icons'

import {
  Usuario,
  statusOptions,
  statusOptionsColorMap,
  INITIAL_VISIBLE_COLUMNS,
  usersColumns as columns,
  Column,
} from "@/lib/definitions";

import NewPersonForm from "@/components/newPersonForm";

export default function Personal() {
  const [users, setUsers] = React.useState<Usuario[]>([]);
  const [filterValue, setFilterValue] = React.useState<string>("");
  const [page, setPage] = React.useState(1);
  const [pages, setPages] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [selectedKeys, setSelectedKeys] = React.useState<Usuario[]>([]);
  const [filteredItems, setFilteredItems] = React.useState<Usuario[]>([]);
  const [hasSearchFilter, setHasSearchFilter] = React.useState(false);
  const [sortedItems, setSortedItems] = React.useState<Usuario[]>([]);

  React.useEffect(() => {
    // Get users from api
    const fetchUsers = async () => {
      const users = await fetch("/api/users").then((res) => res.json());
      setUsers(users);
      setFilteredItems(users);
    }

    fetchUsers();
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("")
    setPage(1)
  }, [])

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);

      const filteredItems = users.filter((user) => {
        return user.Nombre.toLowerCase().includes(value.toLowerCase());
      });

      setFilteredItems(filteredItems);
      setPage(1);
    } else {
      setFilterValue("");
      setFilteredItems(users);
    }
  }, []);

  const onRowsPerPageChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const { isOpen, onOpen, onOpenChange } = React.useDisclosure();

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Buscar por nombre..."
            startContent={<MagnifyingGlassIcon className="h-1/2" />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            {/* <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {
                      // Capitalize the first letter of each word
                      column.uid
                        .split(" ")
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ")
                    }
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown> */}
            <Button color="primary" endContent={<PlusIcon />} onPress={onOpen}>
              Agregar nuevo usuario
            </Button>
          </div>

        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">{users.length} usuarios</span>
          <label className="flex items-center text-default-400 text-small">
            Filas por pagina:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [filterValue, onClear, onRowsPerPageChange, onSearchChange, users.length]);

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys.length === users.length
            ? "Todos los usuarios seleccionados"
            : `${selectedKeys.length} de ${filteredItems.length} seleccionados`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onPreviousPage}>
            Anterior
          </Button>
          <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onNextPage}>
            Siguiente
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, filteredItems.length, page, pages, onPreviousPage, onNextPage]);

  const statusColorMap: Record<string, ChipProps["color"]> = {
    active: "success",
    paused: "danger",
    vacation: "warning",
  };

  const renderCell = React.useCallback((user: Usuario, columnKey: React.Key) => {
    // const cellValue = user[columnKey as keyof User];

    switch (columnKey) {
      case "persona":
        return (
          <User
            avatarProps={{ radius: "lg", src: "" }}
            description={user.Apellidos}
            name={user.Nombre}
          >
            {user.Nombre} + " " + {user.Apellidos}
          </User>
        );
      case "role":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{cellValue}</p>
            <p className="text-bold text-tiny capitalize text-default-400">{user.Apellidos}</p>
          </div>
        );
      case "status":
        return (
          <Chip className="capitalize" color={statusColorMap[user.id]} size="sm" variant="flat">
            estado
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex justify-end items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <DotsVerticalIcon className="text-default-900" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem>View</DropdownItem>
                <DropdownItem>Edit</DropdownItem>
                <DropdownItem>Delete</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return "N/A";
    }
  }, []);

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => {
            <>
              <ModalHeader>Agregar nuevo usuario</ModalHeader>
              <ModalBody>
                <NewPersonForm />
              </ModalBody>
              <ModalFooter>
                <Button color="primary" variant="flat" onPress={onclose}>
                  Cancelar
                </Button>
                <Button color="primary" variant="flat" onPress={onclose}>
                  Guardar
                </Button>
              </ModalFooter>
            </>
          }}
        </ModalContent>
      </Modal>
      <Table
        aria-label="Example table with custom cells, pagination and sorting"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: "max-h-[382px]",
        }}
        selectedKeys={selectedKeys}
        selectionMode="multiple"
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={setSelectedKeys}
      >
        <TableHeader columns={columns}>
          {(column: Column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody>
          {
            filteredItems.map((user) => {
              return (
                <TableRow key={user.id}>
                  {columns.map((column) => (
                    <TableCell key={column.uid}>
                      {renderCell(user, column.uid)}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          }
        </TableBody>
      </Table>
    </>
  );

}