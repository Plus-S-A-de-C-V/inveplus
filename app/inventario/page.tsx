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
    Usuario,
    statusOptions,
    statusOptionsColorMap,
    INITIAL_VISIBLE_COLUMNS,
    usersColumns as columns,
    Column,
    Date as Fecha
} from "@/lib/definitions";

import { ItemsTable } from "@/components/table";

import { Toaster, toast } from 'sonner';

export default function Inventario() {
    return (
        <div className="flex w-full flex-col">
            <Tabs aria-label="Inventario">
                <Tab key="productos" title="Productos">
                    <>
                        <ItemsTable />
                    </>
                </Tab>
                <Tab key="proveedores" title="Proveedores">
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                </Tab>
            </Tabs>
        </div>
    );
}