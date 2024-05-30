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
  Check,
  statusOptions,
  statusOptionsColorMap,
  INITIAL_VISIBLE_COLUMNS,
  checksColumns as columns,
  Column,
} from "@/lib/definitions";

// import { ChecksForm } from "@/components/ChecksForm";
import { ItemsTable } from "@/components/table";
import ChecksForm from "@/components/ChecksForm";

import { Toaster, toast } from 'sonner';
import { Items } from "cloudflare/resources/rules/lists/items";

type CompleteCheck = Check & { userChecked: Usuario };

export default function Personal() {
  const [users, setUsers] = React.useState<CompleteCheck[]>([]);
  const [mode, setMode] = React.useState<"view" | "edit" | "create">("view");
  const [filterValue, setFilterValue] = React.useState<string>("");
  const [page, setPage] = React.useState(1);
  const [pages, setPages] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [selectedKeys, setSelectedKeys] = React.useState<string[]>([]);
  const [filteredItems, setFilteredItems] = React.useState<CompleteCheck[]>([]);
  const [loadingUsers, setLoadingUsers] = React.useState(true);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  React.useEffect(() => {
    // Get users from api
    const fetchUsers = async () => {
      reloadUsers();
    }

    fetchUsers();
  }, []);

  const reloadUsers = async () => {
    setLoadingUsers(true);
    const _checks = await fetch("/api/checks").then((res) => res.json());
    const _usuarios = await fetch("/api/users", {
    }).then((res) => res.json());

    const __checks: CompleteCheck[] = _checks.map((check: Check) => {
      return {
        ...check,
        userChecked: _usuarios.find((u: Usuario) => u.id === check.userChecked)
      } as CompleteCheck;
    });

    const checks = __checks.sort((a, b) => {
      // Sort by date and time
      return new Date(b.FechaYHora).getTime() - new Date(a.FechaYHora).getTime();
    })

    console.log("checks", checks);

    setUsers(checks);
    setFilteredItems(checks);
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
        return user.id.toLowerCase().includes(value.toLowerCase());
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
              Recargar Checks
            </Button>
            <Button color="primary" endContent={<PlusIcon />} onPress={() => {
              onOpenChange();
              setMode("create");
            }}>
              Agregar nuevo Check
            </Button>
          </div>

        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">{users.length} checks</span>
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

  const deleteUser = async (user: CompleteCheck) => {
    toast.promise(
      new Promise(async (resolve) => {
        const _deleteUser = async () => {
          const response = await fetch("/api/checks/delete/" + user.id, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: user.id }),
          });

          if (response.status === 200) {
            console.log("Check eliminado con exito");
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
        loading: 'Eliminando check...',
        success: 'Check eliminado con exito',
        error: 'Error al eliminar check'
      },
    );

    // reloadUsers();
  }

  const renderCell = React.useCallback((user: CompleteCheck, columnKey: Column) => {
    switch (columnKey.uid) {
      case "id":
        return user.id;

      case "userChecked":
        return (
          <User
            avatarProps={{ radius: "lg", src: "" }}
            description={user.userChecked.Apellidos}
            name={user.userChecked.Nombre}
          >
            {user.userChecked.Nombre} + " " + {user.userChecked.Apellidos}
          </User>
        )

      case "movimiento":
        return (
          <Chip color={statusColorMap[user.movimiento === 0 ? "active" : "paused"]}>{
            user.movimiento === 0 ? "Entrada" : "Salida"
          }</Chip>
        )

      case "FechaYHora":
        return user.FechaYHora.toString();

      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            {/* <Tooltip content="Detalles">
              <span className="text-9xl text-default-400 cursor-pointer active:opacity-50">
                <EyeOpenIcon
                  onClick={() => {
                    setUserToViewOrEdit(user);
                    onOpenChange();
                    setMode("view");
                  }}
                />
              </span>
            </Tooltip> */}
            {/* <Tooltip content="Editar Usuario">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <Pencil1Icon
                  onClick={() => {
                    setUserToViewOrEdit(user);
                    onOpenChange();
                    setMode("edit");
                  }}
                />
              </span>
            </Tooltip> */}
            <Tooltip color="danger" content="Eliminar Usuario">
              <span className="text-lg text-danger cursor-pointer active:opacity-50">
                <TrashIcon
                  onClick={() => deleteUser(user)}
                />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return "N/A";
    }
  }, []);

  return (
    <>
      <Toaster expand={true} />
      {/* <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="5xl" placement="center" scrollBehavior="outside" backdrop="blur">
        <ModalContent>
          {(onClose) => (
            <div>
              <ModalHeader>
                {
                  mode === "view" ? "Detalles del Check" :
                    mode === "edit" ? "Editar Check" :
                      mode === "create" ? "Crear Check" : "Check"
                }
              </ModalHeader>
              <ModalBody>
                <ChecksForm isOpen={isOpen} onOpenChange={onOpenChange} mode={mode} />
              </ModalBody>
            </div>
          )}
        </ModalContent>
      </Modal> */}
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