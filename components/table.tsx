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

import { Column, ProductColumn } from "@/lib/definitions";

interface Props {
    items: any[];
    loadingContent: boolean;
    topContent?: React.ReactNode;
    bottomContent: React.ReactNode;
    renderCell: (item: any, columnKey: any) => React.ReactNode;
    columns: Column[];
}

export const ItemsTable = ({ items, loadingContent, topContent, bottomContent, renderCell, columns }: Props) => {
    return (
        <>
            <Table
                aria-label="Data table"
                isHeaderSticky
                bottomContent={bottomContent
                }
                bottomContentPlacement="outside"
                classNames={{
                    wrapper: "max-h-[382px]",
                }}
                topContent={topContent}
                topContentPlacement="outside"
            >
                <TableHeader columns={columns}>
                    {(column: Column) => (
                        <TableColumn
                            key={column.uid}
                            align="center"
                        // allowsSorting={column.sortable}
                        >
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody
                    emptyContent={
                        !loadingContent ? (
                            "No se encontraron items"
                        ) : (
                            <Spinner label="Cargando items..." color="default" />
                        )
                    }
                    items={items}
                >
                    {

                        items.map((item) => {
                            return (
                                <TableRow key={item.id}>
                                    {columns.map((column) => (
                                        <TableCell key={column.uid}>
                                            {renderCell(item, column)}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            );
                        })
                    }
                </TableBody>
            </Table>
        </>
    );
}