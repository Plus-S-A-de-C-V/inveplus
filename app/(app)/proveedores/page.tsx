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
    ButtonGroup,
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
    Tabs, Tab,
    Card, CardBody
} from "@nextui-org/react";


import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";

import { PlusIcon, MagnifyingGlassIcon, DotsVerticalIcon, EyeOpenIcon, Pencil1Icon, TrashIcon, ReloadIcon } from '@radix-ui/react-icons'

import {
    Product,
    Supplier,
    statusOptions,
    statusOptionsColorMap,
    INITIAL_VISIBLE_COLUMNS,
    productColumns,
    ProductColumn,
    supplierColumns,
    SupplierColumn
} from "@/lib/definitions";

import { ItemsTable } from "@/components/table";
import SupplierForm from "@/components/SupplierForm";

import { Toaster, toast } from 'sonner';

export default function Inventario() {
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [page, setPage] = React.useState(1);
    const [pages, setPages] = React.useState(1);

    const [filterValue, setFilterValue] = React.useState<string>("");
    const [suppliers, setSuppliers] = React.useState<Supplier[]>([]);
    const [filteredSuppliers, setFilteredSuppliers] = React.useState<Supplier[]>([]);
    const [supplierToViewOrEdit, setSupplierToViewOrEdit] = React.useState<Supplier | undefined>(undefined);
    const [loadingSuppliers, setLoadingSuppliers] = React.useState<boolean>(false);

    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [mode, setMode] = React.useState<"view" | "edit" | "create">("view");
    const [requestRefresh, setRequestRefresh] = React.useState(false);


    React.useEffect(() => {
        const fetchData = async () => {
            reloadItems();
        }

        fetchData();
    }, []);

    const reloadItems = async () => {
        // TODO:! Implement
        setLoadingSuppliers(true);

        const suppliers = await fetch("/api/suppliers",
            {
                method: "GET",
            }
        ).then((res) => res.json());

        setSuppliers(suppliers);
        setFilteredSuppliers(suppliers);
        setLoadingSuppliers(false);
    }

    React.useEffect(() => {
        if (requestRefresh) {
            reloadItems();
            setRequestRefresh(false);
        }
    }, [requestRefresh])

    const onClear = React.useCallback(() => {
        setFilterValue("")
        setPage(1)
    }, [])
    const onSearchChange = React.useCallback((value?: string) => {
        if (!value) {
            setFilterValue("");
            setFilteredSuppliers(suppliers);
            return;
        }

        const filteredProds = suppliers.filter((supplier) => {
            return supplier.SupplierName.toLowerCase().includes(value.toLowerCase());
        });
        setFilteredSuppliers(filteredProds);
        setPage(1);

    }, []);

    const onRowsPerPageChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);

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
    }, []);

    const topContent = React.useMemo(() => {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex justify-between gap-3 items-end">
                    <div className="flex justify-start gap-2 items-end w-full">
                        <Input
                            isClearable
                            className="w-full sm:max-w-[44%]"
                            placeholder="Buscar por nombre..."
                            startContent={<MagnifyingGlassIcon className="h-1/2" />}
                            value={filterValue}
                            onClear={() => onClear()}
                            onValueChange={onSearchChange}
                        />
                    </div>
                    <div className="flex gap-3">
                        <Button color="default" startContent={<ReloadIcon />} onPress={reloadItems} variant="bordered">
                            Recargar Proveedores
                        </Button>
                        <Button color="primary" endContent={<PlusIcon />} onPress={() => {
                            // TODO: view items
                            setMode("create");
                            onOpen();
                        }}>
                            Agregar Proveedor
                        </Button>
                    </div>

                </div>

                <div className="flex justify-between items-center">
                    {/* <span className="text-default-400 text-small">{users.length} usuarios</span> */}
                    <span className="text-default-400 text-small">{suppliers.length} proveedores</span>
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
    }, [filterValue, suppliers, filteredSuppliers, page, pages]);

    const deleteSupplier = async (supplier: Supplier) => {
        toast.promise(
            new Promise(async (resolve) => {
                const _deleteUser = async () => {
                    const response = await fetch("/api/suppliers/delete/" + supplier.SupplierID, {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        // body: JSON.stringify({ id: supplier.SupplierID }),
                    });

                    if (response.status === 200) {
                        const newUsers = suppliers.filter((u) => u.SupplierID !== supplier.SupplierID);
                        setSuppliers(newUsers);
                        setFilteredSuppliers(newUsers);
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                }

                await _deleteUser();
            }),
            {
                loading: 'Eliminando proveedor...',
                success: 'Proveedor eliminado con exito',
                error: 'Error al eliminar Proveedor'
            },
        );

        setRequestRefresh(true);
    }

    const renderCell = React.useCallback((item: Supplier, column: SupplierColumn) => {
        switch (column.uid) {
            case "id":
                return item.SupplierID;
            case "name":
                return item.SupplierName;
            case "contact":
                return item.ContactName;
            case "address":
                return item.Address;
            case "city":
                return item.City;
            case "postal":
                return item.PostalCode;
            case "country":
                return item.Country;
            case "phone":
                return item.Phone;
            case "mail":
                return item.Mail;
            case "actions":
                return (
                    <div className="relative flex items-center gap-2">
                        <Tooltip content="Detalles">
                            <span className="text-9xl text-default-400 cursor-pointer active:opacity-50">
                                <EyeOpenIcon
                                    onClick={() => {
                                        setSupplierToViewOrEdit(item);
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
                                        setSupplierToViewOrEdit(item);
                                        onOpenChange();
                                        setMode("edit");
                                    }}
                                />
                            </span>
                        </Tooltip>
                        <Tooltip color="danger" content="Eliminar Usuario">
                            <span className="text-lg text-danger cursor-pointer active:opacity-50">
                                <TrashIcon
                                    onClick={() => deleteSupplier(item)}
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
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="5xl" placement="center" scrollBehavior="outside" backdrop="blur">
                <ModalContent>
                    {(onClose) => (
                        <div>
                            <ModalHeader>
                                {
                                    mode === "create" ? "Crear" : mode === "edit" ? "Editar" : "Ver"
                                } Producto
                            </ModalHeader>
                            <ModalBody>
                                <SupplierForm
                                    isOpen={isOpen}
                                    onOpenChange={onOpenChange}
                                    mode={mode}
                                    supplier={supplierToViewOrEdit}
                                    setRequestRefresh={setRequestRefresh}
                                />
                            </ModalBody>
                        </div>
                    )}
                </ModalContent>
            </Modal>
            <Toaster expand={true} />
            <div className="flex w-full flex-col">
                {topContent}

                <>
                    <ItemsTable
                        items={suppliers.slice((page - 1) * rowsPerPage, page * rowsPerPage)}
                        loadingContent={loadingSuppliers}
                        bottomContent={bottomContent}
                        renderCell={renderCell}
                        columns={supplierColumns} />
                </>
            </div>
        </>
    );
}