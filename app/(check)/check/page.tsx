"use client";

import { Tabs, Tab, Button, Image, Input, Link, Card, CardBody, useUser, Modal, ModalBody, ModalHeader, ModalContent, useDisclosure } from "@nextui-org/react";
import React, { useEffect, useState } from 'react';
import Clock from "@/components/clock";
import { Check, Usuario } from "@/lib/definitions";
import { getUsers, getObject } from "@/lib/db";
import {
    Autocomplete,
    AutocompleteItem,
    User,
} from "@nextui-org/react";

interface UserWithProfile extends Usuario {
    profilePicture: Blob;
}

export default function Dashboard() {
    const [users, setUsers] = useState<Usuario[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(true);

    const [registering, setRegistering] = useState(false);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [error, setError] = useState(false);

    const [selectedState, setSelectedState] = useState("");

    useEffect(() => {
        console.log("Loading users...");
        const load = async () => {
            const users = await fetch("/api/users", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => res.json());
            // const users = await Promise.all(_users.map(async (user: Usuario) => {
            //     const profilePic = await getObject(user.Foto);
            //     return {
            //         ...user,
            //         // profilePicture: new Blob([profilePic], { type: "image/*" })
            //     } as UserWithProfile;
            // }));

            setUsers(users);
            setLoadingUsers(false);
        }
        load();
    }, [])


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        setRegistering(true);

        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const username = form.get("user") as string;
        const _u = users.find((u) => u.Nombre === username);

        if (!_u) {
            return;
        }

        const user = _u as Usuario;

        // Set userChecked to the selected user in the form
        form.set("userChecked", user.id);

        // Send to the /api/checks/new endpoint
        const res = await fetch("/api/checks/new", {
            method: "POST",
            body: form,
        });

        if (res.status !== 200) {
            setError(true);
        }

        setError(false);
        setRegistering(false);
        setSelectedState("");
        onOpen();
    }

    return (
        <>
            <Modal
                backdrop="blur"
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                radius="lg"
                size="4xl"
                className={"bg-green-500 text-white  dark:text-white font-bold text-8xl " + (error ? "bg-red-500" : "bg-green-500")}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalBody className="my-7">
                                Registro exitoso
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
            <div className="relative flex flex-col w-screen h-screen ">

                <div className="overflow-hidden absolute w-screen h-screen">
                    <div
                        className="absolute blur-lg w-full h-full dark:brightness-[0.2] dark:grayscale scale-105"
                        style={{
                            backgroundImage: `url('/signin.png')`,
                            backgroundPosition: 'center',
                            backgroundSize: 'cover',
                            backgroundRepeat: 'no-repeat'
                        }}
                    />
                </div>

                <div className="z-10 absolute w-screen h-screen content-center">
                    <Card className="w-4/12 m-auto">
                        <CardBody>
                            <>
                                <Image
                                    src="/favicon.ico"
                                    alt="Image"
                                    // width="50"
                                    // height="1080"
                                    style={{ objectFit: "cover", width: "25%" }}
                                    className="dark:brightness-[0.2] dark:grayscale align-middle text-center items-center content-center mx-auto"
                                    radius="none"
                                />
                                <Clock />
                                <div className="mt-6 mb-6">
                                    <form
                                        onSubmit={handleSubmit}
                                    >
                                        <Autocomplete
                                            name="user"
                                            label="Usuario a registrar"
                                            placeholder="Seleccione un usuario"
                                            className="w-full"
                                            // defaultItems={users}
                                            isLoading={loadingUsers}
                                            isRequired
                                            errorMessage="Selecciona un Usuario"
                                            selectedKey={selectedState}
                                            onSelectionChange={(key) => setSelectedState(key?.toString() || "")}
                                        >
                                            {
                                                users.map((user: Usuario) => (
                                                    <AutocompleteItem key={user.id} textValue={user.Nombre}>
                                                        <User
                                                            avatarProps={{
                                                                radius: "lg",
                                                            }}
                                                            description={user.id}
                                                            name={`${user.Nombre} ${user.Apellidos}`}
                                                        >
                                                            {/* {user.Nombre}  {user.Apellidos} */}
                                                        </User>
                                                    </AutocompleteItem>
                                                ))
                                            }
                                        </Autocomplete>
                                        <div className="w-full mt-6">
                                            <Button color="primary" isLoading={registering} className="w-full" type="submit">
                                                Registrar
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            </>
                        </CardBody>
                    </Card>
                </div>
            </div>

        </>
    )
}