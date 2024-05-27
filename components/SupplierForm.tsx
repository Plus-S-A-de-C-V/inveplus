import { Supplier } from "@/lib/definitions";

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
} from "@nextui-org/react";

import { MagnifyingGlassIcon, FileIcon, HeartIcon, PersonIcon, HomeIcon, MobileIcon, EnvelopeOpenIcon, DrawingPinFilledIcon, CheckIcon } from '@radix-ui/react-icons'


interface formProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    mode: "create" | "edit" | "view";
    supplier?: Supplier;
}

export default function SupplierForm({ isOpen, onOpenChange, mode, supplier }: formProps) {
    return (
        // Make a 2 cols form that auto adjust to the screen size
        <form>
            <div className="grid md:grid-cols-2 gap-4 grid-cols-1">
                <Input
                    isClearable={mode === "create" || mode === "edit"}
                    isRequired={mode === "create"}
                    isReadOnly={mode === "view"}
                    // value={mode === "create" ? nombre : user?.Nombre}
                    label="Nombre"
                    name="SupplierName"
                    placeholder="Nombre del Proveedor"
                    defaultValue={supplier?.SupplierName}
                    disabled={mode === "view"}
                />
                <Input
                    isClearable={mode === "create" || mode === "edit"}
                    isRequired={mode === "create"}
                    isReadOnly={mode === "view"}
                    label="Contacto"
                    name="ContactName"
                    placeholder="Nombre del Contacto"
                    defaultValue={supplier?.ContactName}
                    disabled={mode === "view"}
                />
                <Input
                    isClearable={mode === "create" || mode === "edit"}
                    isRequired={mode === "create"}
                    isReadOnly={mode === "view"}
                    label="Dirección"
                    name="Address"
                    placeholder="Dirección"
                    defaultValue={supplier?.Address}
                    disabled={mode === "view"}
                />
                <Input
                    isClearable={mode === "create" || mode === "edit"}
                    isRequired={mode === "create"}
                    isReadOnly={mode === "view"}
                    label="Ciudad"
                    name="City"
                    placeholder="Ciudad"
                    defaultValue={supplier?.City}
                    disabled={mode === "view"}
                />
                <Input
                    isClearable={mode === "create" || mode === "edit"}
                    isRequired={mode === "create"}
                    isReadOnly={mode === "view"}
                    label="Código Postal"
                    name="PostalCode"
                    placeholder="Código Postal"
                    defaultValue={supplier?.PostalCode}
                    disabled={mode === "view"}
                />
                <Input
                    isClearable={mode === "create" || mode === "edit"}
                    isRequired={mode === "create"}
                    isReadOnly={mode === "view"}
                    label="País"
                    name="Country"
                    placeholder="País"
                    defaultValue={supplier?.Country}
                    disabled={mode === "view"}
                />
                <Input
                    isClearable={mode === "create" || mode === "edit"}
                    isRequired={mode === "create"}
                    isReadOnly={mode === "view"}
                    label="Teléfono"
                    name="Phone"
                    placeholder="Teléfono"
                    defaultValue={supplier?.Phone}
                    disabled={mode === "view"}
                />
                <Input
                    isClearable={mode === "create" || mode === "edit"}
                    isRequired={mode === "create"}
                    isReadOnly={mode === "view"}
                    label="Correo"
                    name="Mail"
                    placeholder="Correo"
                    defaultValue={supplier?.Mail}
                    disabled={mode === "view"}
                />
            </div>
            <div className="flex flex-row justify-end mt-5">
                <Button
                    color="primary"
                    startContent={<CheckIcon className="h-6 w-6" />}
                    type="submit"
                >
                    {
                        mode === "create" ? "Crear Usuario" : mode === "edit" ? "Guardar Cambios" : "Cerrar"
                    }
                </Button>
            </div>
        </form>
    );
}