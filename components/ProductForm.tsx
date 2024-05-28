"use client";

import { Product, Supplier } from "@/lib/definitions";

import {
    Card,
    CardFooter,
    Button,
    Spacer,
    Image,
    Input,
    Divider,
    Switch,
    Select,
    SelectItem,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    User,
    SelectedItems
} from "@nextui-org/react";

import { MagnifyingGlassIcon, FileIcon, HeartIcon, PersonIcon, HomeIcon, MobileIcon, EnvelopeOpenIcon, DrawingPinFilledIcon, CheckIcon } from '@radix-ui/react-icons'
import React from "react";


import { useFormStatus } from 'react-dom'

interface formProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    mode: "create" | "edit" | "view";
    product?: Product;
}

export default function ProductForm({ isOpen, onOpenChange, mode, product }: formProps) {
    const { pending } = useFormStatus()
    const [loading, setLoading] = React.useState(false);

    const [suppliers, setSuppliers] = React.useState<Supplier[]>([]);
    const [loadingSuppliers, setLoadingSuppliers] = React.useState<boolean>(false);
    // const [isOpen, setIsOpen] = React.useState(false);


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
                cache: "reload",
                method: "GET",
            }
        ).then((res) => res.json());

        setSuppliers(suppliers);
        // setFilteredSuppliers(suppliers);
        setLoadingSuppliers(false);
    }


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setLoading(true);
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        if (mode === "create") {
            const result = await fetch("/api/products/new", {
                method: "POST",
                body: formData,
            });
            if (result.ok) {
                onOpenChange(false)
            }

        } else if (mode === "edit") {
            const result = await fetch("/api/products/edit" + product?.ProductID, {
                method: "POST",
                body: formData,
            });
            if (result.ok) {
                onOpenChange(false)
            }
        } else {
            onOpenChange(false)
        }
    }

    return (
        // Make a 2 cols form that auto adjust to the screen size
        <form
            onSubmit={handleSubmit}
        >
            <div className="grid md:grid-cols-2 gap-4 grid-cols-1">
                <Input
                    name="ProductName"
                    label="Nombre del Producto"
                    defaultValue={product?.ProductName}
                    isClearable={mode === "create" || mode === "edit"}
                    isRequired={mode === "create"}
                    isReadOnly={mode === "view"}
                    disabled={mode === "view"}
                />
                {/* <Input
                    name="SupplierID"
                    label="ID del Proveedor"
                    defaultValue={product?.SupplierID}
                    isClearable={mode === "create" || mode === "edit"}
                    isRequired={mode === "create"}
                    isReadOnly={mode === "view"}
                    disabled={mode === "view"}
                /> */}
                <Select
                    className="w-full"
                    isLoading={loadingSuppliers && mode !== "view"}
                    items={suppliers}
                    label="Selecciona un Proveedor"
                    placeholder="Selecciona un Proveedor"
                    labelPlacement="outside"
                    // scrollRef={scrollerRef}
                    selectionMode="single"
                    name="SupplierID"
                    renderValue={(items: SelectedItems<Supplier>) => {
                        return items.map((item) => (
                            <div className="flex flex-col w-full" key={item.data?.SupplierID}>
                                <span className="text-small w-full">{item.data?.SupplierName}</span>
                                <span className="text-tiny text-default-400 w-full">{item.data?.SupplierID}</span>
                            </div>
                        ));
                    }}
                // onOpenChange={setIsOpen}

                >
                    {(item) => (
                        <SelectItem key={item.SupplierID} className="capitalize w-full">
                            <div className="flex flex-col w-full">
                                <span className="text-small w-full">{item.SupplierName}</span>
                                <span className="text-tiny text-default-400 w-full">{item.SupplierID}</span>
                            </div>
                        </SelectItem>
                    )}
                </Select>
                <Input
                    name="QuantityInStock"
                    label="Cantidad en Stock"
                    defaultValue={product?.QuantityInStock.toString() || ""}
                    isClearable={mode === "create" || mode === "edit"}
                    isRequired={mode === "create"}
                    isReadOnly={mode === "view"}
                    disabled={mode === "view"}
                    type="number"
                />
                <Input
                    name="ReorderLevel"
                    label="Nivel de Reorden"
                    defaultValue={product?.ReorderLevel.toString() || ""}
                    isClearable={mode === "create" || mode === "edit"}
                    isRequired={mode === "create"}
                    isReadOnly={mode === "view"}
                    disabled={mode === "view"}
                    type="number"
                />
                <Input
                    name="UnitPrice"
                    label="Precio Unitario"
                    defaultValue={product?.UnitPrice.toString() || ""}
                    isClearable={mode === "create" || mode === "edit"}
                    isRequired={mode === "create"}
                    isReadOnly={mode === "view"}
                    disabled={mode === "view"}
                    type="number"
                />
                <Input
                    name="Location"
                    label="Ubicación"
                    defaultValue={product?.Location}
                    isClearable={mode === "create" || mode === "edit"}
                    isRequired={mode === "create"}
                    isReadOnly={mode === "view"}
                    disabled={mode === "view"}
                />

            </div>
            <div className="flex flex-row justify-end mt-5">
                <Button
                    color="primary"
                    startContent={<CheckIcon className="h-6 w-6" />}
                    type="submit"
                    disabled={pending}
                    isLoading={loading}
                >
                    {
                        mode === "create" ? "Crear Usuario" : mode === "edit" ? "Guardar Cambios" : "Cerrar"
                    }
                </Button>
            </div>
        </form>
    );
}