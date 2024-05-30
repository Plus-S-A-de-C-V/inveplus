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
    SupplierColumn,
} from "@/lib/definitions";

import { ItemsTable } from "@/components/table";
import ProductForm from "@/components/ProductForm";

import { Toaster, toast } from 'sonner';

type CompleteProduct = Product & { Supplier: Supplier };

export default function Inventario() {
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [page, setPage] = React.useState(1);
    const [pages, setPages] = React.useState(1);

    const [filterValue, setFilterValue] = React.useState<string>("");

    const [products, setProducts] = React.useState<CompleteProduct[]>([]);
    const [filteredProducts, setFilteredProducts] = React.useState<CompleteProduct[]>([]);
    const [productToViewOrEdit, setProductToViewOrEdit] = React.useState<CompleteProduct | undefined>(undefined);
    const [loadingProducts, setLoadingProducts] = React.useState(true);

    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [mode, setMode] = React.useState<"view" | "edit" | "create">("view");
    const [requestRefresh, setRequestRefresh] = React.useState(false);

    const [suppliers, setSuppliers] = React.useState<Supplier[]>([]);


    React.useEffect(() => {
        const fetchData = async () => {
            reloadItems();
        }

        fetchData();
    }, []);

    const reloadItems = async () => {
        // TODO:! Implement
        setLoadingProducts(true);

        const products = await fetch("/api/products", {
            method: "GET",
        }).then((res) => res.json());

        const suppliers = await fetch("/api/suppliers", {
            method: "GET",
        }).then((res) => res.json());

        const completeProducts: CompleteProduct[] = products.map((product: Product) => {
            const supplier = suppliers.find((s: Supplier) => s.SupplierID === product.SupplierID);

            return {
                ...product,
                Supplier: supplier
            } as CompleteProduct;
        });

        setProducts(completeProducts);
        setFilteredProducts(products);
        setSuppliers(suppliers);
        setLoadingProducts(false);
    }

    React.useEffect(() => {
        if (requestRefresh) {
            reloadItems();
            setRequestRefresh(false);
        }
    }, [requestRefresh]);

    const onClear = React.useCallback(() => {
        setFilterValue("")
        setPage(1)
    }, [])
    const onSearchChange = React.useCallback((value?: string) => {

        if (!value) {
            setFilterValue("")
            setFilteredProducts(products)
            return;
        }

        const filteredProds = products.filter((product) => {
            return product.ProductName.toLowerCase().includes(value.toLowerCase());
        });
        setFilteredProducts(filteredProds);
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
                    <Input
                        isClearable
                        className="w-1/2"
                        placeholder="Buscar por nombre..."
                        startContent={<MagnifyingGlassIcon className="h-1/2" />}
                        value={filterValue}
                        onClear={() => onClear()}
                        onValueChange={onSearchChange}
                    />
                    <div className="flex gap-3">
                        <Button color="default" startContent={<ReloadIcon />} onPress={reloadItems} variant="bordered">
                            Recargar Productos
                        </Button>
                        <Button color="primary" endContent={<PlusIcon />} onPress={() => {
                            // TODO: view items
                            setMode("create");
                            onOpen();
                        }}>
                            Agregar Producto
                        </Button>
                    </div>

                </div>

                <div className="flex justify-between items-center">
                    {/* <span className="text-default-400 text-small">{users.length} usuarios</span> */}
                    <span className="text-default-400 text-small">{products.length} productos</span>
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
    }, [filterValue, products, filteredProducts, page, pages]);

    const deleteProduct = async (user: Product) => {
        toast.promise(
            new Promise(async (resolve) => {
                const _deleteUser = async () => {
                    const response = await fetch("/api/products/delete/" + user.ProductID, {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        // body: JSON.stringify({ id: user.ProductID }),
                    });

                    if (response.status === 200) {
                        const newUsers = products.filter((u) => u.ProductID !== user.ProductID);
                        setProducts(newUsers);
                        setFilteredProducts(newUsers);
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                }

                await _deleteUser();
            }),
            {
                loading: 'Eliminando producto...',
                success: 'Producto eliminado con exito',
                error: 'Error al eliminar producto'
            },
        );

        // reloadUsers();
    }

    const renderCell = React.useCallback((item: CompleteProduct, column: ProductColumn) => {

        switch (column.uid) {
            case "id":
                return item.ProductID;
            case "name":
                return item.ProductName;
            case "supplier": {
                return (
                    <User
                        key={item.ProductID}
                        avatarProps={{
                            radius: "lg",
                        }}
                        description={item.Supplier.SupplierID}
                        name={`${item.Supplier.SupplierName} - ${item.Supplier.ContactName}`}
                    >
                        {item.Supplier.SupplierName} - {item.Supplier.ContactName}
                    </User>
                )
            }
            case "stock":
                return item.QuantityInStock;
            case "minimo":
                return item.ReorderLevel;
            case "price":
                return item.UnitPrice;
            case "loc":
                return item.Location;
            case "actions":
                return (
                    <div className="relative flex items-center gap-2">
                        <Tooltip content="Detalles">
                            <span className="text-9xl text-default-400 cursor-pointer active:opacity-50">
                                <EyeOpenIcon
                                    onClick={() => {
                                        setProductToViewOrEdit(item);
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
                                        setProductToViewOrEdit(item);
                                        onOpenChange();
                                        setMode("edit");
                                    }}
                                />
                            </span>
                        </Tooltip>
                        <Tooltip color="danger" content="Eliminar Usuario">
                            <span className="text-lg text-danger cursor-pointer active:opacity-50">
                                <TrashIcon
                                    onClick={() => deleteProduct(item)}
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
                                <ProductForm
                                    isOpen={isOpen}
                                    onOpenChange={onOpenChange}
                                    mode={mode}
                                    product={productToViewOrEdit}
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
                        items={products.slice((page - 1) * rowsPerPage, page * rowsPerPage)}
                        loadingContent={loadingProducts}
                        bottomContent={bottomContent}
                        renderCell={renderCell}
                        columns={productColumns} />
                </>
            </div>
        </>
    );
}