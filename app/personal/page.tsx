"use client";

import Database from "@/lib/db";
import React, { useEffect } from "react";
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
} from "@nextui-org/react";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";

import { PlusIcon } from "@heroicons/react/24/outline";
import { EllipsisVerticalIcon as VerticalDotsIcon } from "@heroicons/react/24/outline";
import { MagnifyingGlassIcon as SearchIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

import newPersonForm from "@/components/newPersonForm";

import {
  Usuario,
  statusOptions,
  statusOptionsColorMap,
  INITIAL_VISIBLE_COLUMNS,
  usersColumns as columns,
} from "@/lib/definitions";
import NewPersonForm from "@/components/newPersonForm";

export default function Personal() {
  const [users, setUsers] = React.useState<Usuario[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    // Load users
  }, []);

  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  const [filterValue, setFilterValue] = React.useState("");
  const hasSearchFilter = Boolean(filterValue);

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...users];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        (user.Nombre + " " + user.Apellidos)
          .toLowerCase()
          .includes(filterValue.toLowerCase())
      );
    }

    return filteredUsers;
  }, [users, filterValue, hasSearchFilter]);

  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const onSearchChange = React.useCallback((value: string) => {
    if (value) {
      setFilterValue(value);
    } else {
      setFilterValue("");
    }
  }, []);
  const onClear = React.useCallback(() => {
    setFilterValue("");
  }, []);
  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4 w-full">
        <div className="flex justify-between gap-3 items-end flex-wrap w-full">
          <Input
            isClearable
            className="w-full"
            placeholder="Buscar por nombre..."
            startContent={<SearchIcon className="h-6 w-6" />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3 h-full w-full">
            <Dropdown>
              <DropdownTrigger>
                <Button
                  endContent={<ChevronDownIcon className="h-6 w-6" />}
                  variant="flat"
                >
                  Columnas
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Tabla Columnnas"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {column.name.toUpperCase()}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <div className="flex flex-row justify-end">
              <Button
                color="primary"
                endContent={<PlusIcon className="h-6 w-6" />}
                onClick={() => onOpen()}
              >
                Nuevo Usuario
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }, [filterValue, onClear, onSearchChange, visibleColumns]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys.size === filteredItems.length
            ? "Todos los registros seleccionados"
            : `${selectedKeys.size} de ${filteredItems.length} seleccionados`}
        </span>
        {/* <Pagination
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
            Previous
          </Button>
          <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onNextPage}>
            Next
          </Button>
        </div> */}
      </div>
    );
  }, [filteredItems.length, selectedKeys.size]);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const sortedItems = React.useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [filteredItems]);

  const renderCell = React.useCallback((user, columnKey) => {
    const cellValue = user[columnKey];

    switch (columnKey) {
      case "persona":
        return (
          // TODO: Update user avatar
          <User
            avatarProps={{ radius: "lg", src: user.avatar }}
            description={user.email}
            name={cellValue}
          >
            {user.email}
          </User>
        );
      case "rol":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{cellValue}</p>
            <p className="text-bold text-tiny capitalize text-default-400">
              {user.rol}
            </p>
          </div>
        );
      case "actions":
        return (
          <div className="relative flex justify-end items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <VerticalDotsIcon className="text-default-300" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem>Ver</DropdownItem>
                <DropdownItem>Editar</DropdownItem>
                <DropdownItem>Eliminar</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "edad",
    direction: "ascending",
  });

  return (
    <div className="w-full h-full">
      <Modal
        size="5xl"
        isOpen={isOpen}
        onClose={onClose}
        backdrop="blur"
        scrollBehavior="inside"
        placement="center"
      >
        <ModalContent>
          <ModalHeader>Nueva Persona</ModalHeader>
          <ModalBody>
            <NewPersonForm />
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
      <Table
        aria-label="Tabla de usuarios"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: "max-h-[382px]",
        }}
        selectedKeys={selectedKeys}
        selectionMode="multiple"
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}
        className="w-full"
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.sorteable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"Sin registros"} items={sortedItems}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
