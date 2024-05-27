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
    const [selected, setSelected] = React.useState("productos");
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [page, setPage] = React.useState(1);
    const [pages, setPages] = React.useState(1);

    const [filteredItems, setFilteredItems] = React.useState<Product[] | Supplier[]>([]);
    const [loadingItems, setLoadingItems] = React.useState(true);
    const [filterValue, setFilterValue] = React.useState<string>("");

    const [products, setProducts] = React.useState<Product[]>([]);
    const [productToViewOrEdit, setProductToViewOrEdit] = React.useState<Product | undefined>(undefined);
    const [suppliers, setSuppliers] = React.useState<Supplier[]>([]);
    const [supplierToViewOrEdit, setSupplierToViewOrEdit] = React.useState<Supplier | undefined>(undefined);

    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [mode, setMode] = React.useState<"view" | "edit" | "create">("view");


    React.useEffect(() => {
        const fetchData = async () => {
            reloadItems();
        }

        fetchData();
        console.log("Products: ", products);
        console.log("Suppliers: ", suppliers);

    }, []);

    const reloadItems = async () => {
        // TODO:! Implement
        setLoadingItems(true);

        const [products, suppliers] = await Promise.all([
            await fetch("/api/products",
                {
                    cache: "reload",
                    method: "GET",
                }
            ).then((res) => res.json()),
            await fetch("/api/suppliers", {
                cache: "reload",
                method: "GET",
            }).then((res) => res.json())
        ]);

        setProducts(products);
        setSuppliers(suppliers);

        if (selected === "productos") {
            setFilteredItems(products);
        } else {
            setFilteredItems(suppliers);
        }

        setLoadingItems(false);
    }

    const onClear = React.useCallback(() => {
        setFilterValue("")
        setPage(1)
    }, [])
    const onSearchChange = React.useCallback((value?: string) => {

        if (!value) {
            setFilterValue("")
            if (selected === "productos") {
                setFilteredItems(products)
            } else {
                setFilteredItems(suppliers)
            }
            return;
        }

        if (selected === "productos") {
            const filteredItems = products.filter((product) => {
                return product.ProductName.toLowerCase().includes(value.toLowerCase());
            });

            setFilteredItems(filteredItems);
            setPage(1);
        } else {
            const filteredItems = suppliers.filter((supplier) => {
                return supplier.SupplierName.toLowerCase().includes(value.toLowerCase());
            });

            setFilteredItems(filteredItems);
            setPage(1);
        }

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
                            className="w-1/2"
                            placeholder="Buscar por nombre..."
                            startContent={<MagnifyingGlassIcon className="h-1/2" />}
                            value={filterValue}
                            onClear={() => onClear()}
                            onValueChange={onSearchChange}
                        />
                        <Tabs aria-label="Inventario"
                            onSelectionChange={setSelected}>
                            <Tab key="productos" title="Productos">
                            </Tab>
                            <Tab key="proveedores" title="Proveedores">
                            </Tab>
                        </Tabs>
                    </div>
                    <div className="flex gap-3">
                        <Button color="default" startContent={<ReloadIcon />} onPress={reloadItems} variant="bordered">
                            {
                                selected === "productos" ? "Recargar Productos" : "Recargar Proveedores"
                            }
                        </Button>
                        <Button color="primary" endContent={<PlusIcon />} onPress={() => {
                            // TODO: view items
                            setMode("create");
                            onOpen();
                        }}>
                            Agregar nuevo {
                                selected === "productos" ? "Producto" : "Proveedor"
                            }
                        </Button>
                    </div>

                </div>

                <div className="flex justify-between items-center">
                    {/* <span className="text-default-400 text-small">{users.length} usuarios</span> */}
                    {
                        selected === "productos" ? (
                            <span className="text-default-400 text-small">{products.length} productos</span>
                        ) : (
                            <span className="text-default-400 text-small">{suppliers.length} proveedores</span>
                        )
                    }
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
    }, [selected]);

    const renderCell = React.useCallback((item: Product | Supplier, column: ProductColumn | SupplierColumn) => {
        if (selected === "productos") {
            const product = item as Product;

            switch (column.uid) {
                case "id":
                    return product.ProductID;
                case "nombre":
                    return product.ProductName;
                case "proveedor":
                    return product.SupplierID;
                case "stock":
                    return product.QuantityInStock;
                case "minimo":
                    return product.ReorderLevel;
                case "precio":
                    return product.UnitPrice;
                case "loc":
                    return product.Location;
                default:
                    return "N/A";
            }
        } else {
            const supplier = item as Supplier;

            switch (column.uid) {
                case "id":
                    return supplier.SupplierID;
                case "nombre":
                    return supplier.SupplierName;
                case "contacto":
                    return supplier.ContactName;
                case "direccion":
                    return supplier.Address;
                case "ciudad":
                    return supplier.City;
                case "postal":
                    return supplier.PostalCode;
                case "pais":
                    return supplier.Country;
                case "telefono":
                    return supplier.Phone;
                case "correo":
                    return supplier.Mail;
                default:
                    return "N/A";
            }
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
                                } {
                                    selected === "productos" ? "Producto" : "Proveedor"
                                }
                            </ModalHeader>
                            <ModalBody>
                                {
                                    selected === "productos" ? null
                                        : (
                                            <SupplierForm
                                                isOpen={isOpen}
                                                onOpenChange={onOpenChange}
                                                mode={mode}
                                                supplier={supplierToViewOrEdit}
                                            />
                                        )
                                }
                            </ModalBody>
                        </div>
                    )}
                </ModalContent>
            </Modal>
            <div className="flex w-full flex-col">
                {topContent}
                <>
                    <ItemsTable
                        items={filteredItems.slice((page - 1) * rowsPerPage, page * rowsPerPage)}
                        loadingContent={loadingItems}
                        bottomContent={bottomContent}
                        renderCell={renderCell}
                        columns={
                            selected === "productos"
                                ? productColumns
                                : supplierColumns
                        } />
                </>
            </div>
        </>
    );
}