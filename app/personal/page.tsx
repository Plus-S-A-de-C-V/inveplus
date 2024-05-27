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
  useDisclosure,
  Tooltip,
  Spinner,
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter
} from "@nextui-org/react";

import { PlusIcon, MagnifyingGlassIcon, DotsVerticalIcon, EyeOpenIcon, Pencil1Icon, TrashIcon, ReloadIcon } from '@radix-ui/react-icons'

import {
  Usuario,
  statusOptions,
  statusOptionsColorMap,
  INITIAL_VISIBLE_COLUMNS,
  usersColumns as columns,
  Column,
} from "@/lib/definitions";

import PersonForm from "@/components/PersonForm";
import { ItemsTable } from "@/components/table";

import { Toaster, toast } from 'sonner';
import { Items } from "cloudflare/resources/rules/lists/items";

export default function Personal() {
  const [users, setUsers] = React.useState<Usuario[]>([]);
  const [userToViewOrEdit, setUserToViewOrEdit] = React.useState<Usuario | undefined>(undefined);
  const [mode, setMode] = React.useState<"view" | "edit" | "create">("view");
  const [filterValue, setFilterValue] = React.useState<string>("");
  const [page, setPage] = React.useState(1);
  const [pages, setPages] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [selectedKeys, setSelectedKeys] = React.useState<string[]>([]);
  const [filteredItems, setFilteredItems] = React.useState<Usuario[]>([]);
  const [loadingUsers, setLoadingUsers] = React.useState(true);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  React.useEffect(() => {
    // Get users from api
    const fetchUsers = async () => {
      const users = await fetch("/api/users", {
        cache: "force-cache",
      }).then((res) => res.json());
      setUsers(users);
      setFilteredItems(users);
      setLoadingUsers(false);
    }

    fetchUsers();
  }, []);

  const reloadUsers = async () => {
    setLoadingUsers(true);
    const users = await fetch("/api/users").then((res) => res.json());
    setUsers(users);
    setFilteredItems(users);
    setLoadingUsers(false);
  }

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
            <Button color="default" startContent={<ReloadIcon />} onPress={reloadUsers} variant="bordered">
              Recargar Usuarios
            </Button>
            <Button color="primary" endContent={<PlusIcon />} onPress={() => {
              setUserToViewOrEdit(undefined);
              onOpenChange();
              setMode("create");
            }}>
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
        {/* <span className="w-[30%] text-small text-default-400">
          {selectedKeys.length === users.length
            ? "Todos los usuarios seleccionados"
            : `${selectedKeys.length} de ${filteredItems.length} seleccionados`}
        </span> */}
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

  const deleteUser = async (user: Usuario) => {
    toast.promise(
      new Promise(async (resolve) => {
        const _deleteUser = async () => {
          const response = await fetch("/api/users/delete", {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: user.id }),
          }).then((res) => res.json());

          if (response.status === 200) {
            const newUsers = users.filter((u) => u.id !== user.id);
            setUsers(newUsers);
            setFilteredItems(newUsers);
            resolve(true);
          } else {
            resolve(false);
          }
        }

        await _deleteUser();
      }),
      {
        loading: 'Eliminando usuario...',
        success: 'Usuario eliminado con exito',
        error: 'Error al eliminar usuario'
      },
    );

    // reloadUsers();
  }

  const renderCell = React.useCallback((user: Usuario, columnKey: Column) => {
    // const cellValue = user[columnKey as keyof User];

    const getDateWithouthTime = (date: Date | undefined) => {
      if (!date) return "N/A"

      const newDate = new Date(date);
      return newDate.toDateString();
    }

    switch (columnKey.uid) {
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
            <p className="text-bold text-small capitalize">rol</p>
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
          <div className="relative flex items-center gap-2">
            <Tooltip content="Detalles">
              <span className="text-9xl text-default-400 cursor-pointer active:opacity-50">
                <EyeOpenIcon
                  onClick={() => {
                    setUserToViewOrEdit(user);
                    onOpenChange();
                    setMode("view");
                  }}
                />
              </span>
            </Tooltip>
            <Tooltip content="Editar Usuario">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <Pencil1Icon
                  onClick={() => {
                    setUserToViewOrEdit(user);
                    onOpenChange();
                    setMode("edit");
                  }}
                />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Eliminar Usuario">
              <span className="text-lg text-danger cursor-pointer active:opacity-50">
                <TrashIcon
                  onClick={() => deleteUser(user)}
                />
              </span>
            </Tooltip>
          </div>
        );
      case "email":
        return <p>{user.InformacionPersonal?.correoElectronico}</p>
      case "numero":
        return <p>{user.InformacionPersonal?.NumeroTelefonico}</p>
      case "direccion":
        return <p>{user.InformacionPersonal?.Direccion}</p>
      case "clinica":
        return <p>{user.InformacionMedica?.ClinicaAsignada}</p>
      case "sangre":
        return <p>{user.InformacionMedica?.TipoDeSangre}</p>
      case "nacimiento":
        return <p>{getDateWithouthTime(user.InformacionPersonal?.FechaDeNacimiento)}</p>
      case "curp":
        return <p>{user.InformacionPersonal?.CURP}</p>
      case "rfc":
        return <p>{user.InformacionPersonal?.RFC}</p>
      case "lector":
        return <p>{user.InformacionPersonal?.ClaveLector}</p>
      default:
        return "N/A";
    }
  }, []);

  return (
    <>
      <Toaster expand={true} />
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="5xl" placement="center" scrollBehavior="outside" backdrop="blur">
        <ModalContent>
          {(onClose) => (
            <div>
              <ModalHeader>Agregar nuevo usuario</ModalHeader>
              <ModalBody>
                <PersonForm isOpen={isOpen} onOpenChange={onOpenChange} user={userToViewOrEdit} mode={mode} />
              </ModalBody>
            </div>
          )}
        </ModalContent>
      </Modal>
      <ItemsTable
        items={filteredItems.slice((page - 1) * rowsPerPage, page * rowsPerPage)}
        loadingContent={loadingUsers}
        topContent={topContent}
        bottomContent={bottomContent}
        renderCell={renderCell}
        columns={columns}
      />
    </>
  );

}