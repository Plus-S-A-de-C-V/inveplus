"use client";

import { Check, Usuario } from "@/lib/definitions";

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
    SelectedItems,
} from "@nextui-org/react";
import { useFormStatus } from 'react-dom'

import { MagnifyingGlassIcon, FileIcon, HeartIcon, PersonIcon, HomeIcon, MobileIcon, EnvelopeOpenIcon, DrawingPinFilledIcon, CheckIcon } from '@radix-ui/react-icons'
import React from "react";

interface formProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    mode: "create" | "edit" | "view";
    check?: Check;
}

export default function ChecksForm({ isOpen, onOpenChange, mode, check }: formProps) {
    const { pending } = useFormStatus();
    const [loading, setLoading] = React.useState(false);

    const [usuarios, setUsuarios] = React.useState<Usuario[]>([]);
    const [loadingUsuarios, setLoadingUsuarios] = React.useState<boolean>(false);

    React.useEffect(() => {
        const fetchData = async () => {
            reloadItems();
        }

        fetchData();
    }, []);


    const reloadItems = async () => {
        // TODO:! Implement
        setLoadingUsuarios(true);

        const suppliers = await fetch("/api/users",
            {
                method: "GET",
            }
        ).then((res) => res.json());

        setUsuarios(suppliers);
        // setFilteredSuppliers(suppliers);
        setLoadingUsuarios(false);
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setLoading(true);
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        if (mode === "create") {
            const result = await fetch("/api/checks/new", {
                method: "POST",
                body: formData,
            });
            if (result.ok) {
                onOpenChange(false)
            }

        } else if (mode === "edit") {
            const result = await fetch("/api/checks/edit" + check?.id, {
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
            <div className="grid gap-4 grid-cols-1">
                <Select
                    className="w-full"
                    isLoading={loadingUsuarios && mode !== "view"}
                    items={usuarios}
                    label="Selecciona un Usuario"
                    placeholder="Selecciona un Usuario"
                    labelPlacement="outside"
                    // scrollRef={scrollerRef}
                    selectionMode="single"
                    name="userChecked"
                    renderValue={(items: SelectedItems<Usuario>) => {
                        return items.map((item) => (
                            <div className="flex flex-col w-full" key={item.data?.id}>
                                <span className="text-small w-full">{item.data?.Nombre}</span>
                                <span className="text-tiny text-default-400 w-full">{item.data?.id}</span>
                            </div>
                        ));
                    }}
                // onOpenChange={setIsOpen}

                >
                    {(item) => (
                        <SelectItem key={item.id} className="capitalize w-full">
                            <div className="flex flex-col w-full">
                                <span className="text-small w-full">{item.Nombre}</span>
                                <span className="text-tiny text-default-400 w-full">{item.id}</span>
                            </div>
                        </SelectItem>
                    )}
                </Select>
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
                        mode === "create" ? "Registrar Usuario" : mode === "edit" ? "Guardar Cambios" : "Cerrar"
                    }
                </Button>
            </div>
        </form>
    );
}
