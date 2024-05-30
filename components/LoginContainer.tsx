"use server";

import { signIn } from "@/auth";
import { Tabs, Tab, Button, Image, Input, Link, Card, CardBody, useUser } from "@nextui-org/react";
import react from "react";


export default async function LoginContainer({
    children,
    titles,
    keys
}: {
    children: React.ReactNode[];
    titles: string[];
    keys: string[];
}) {
    return (
        <>
            <Tabs
                fullWidth
                size="md"
                aria-label="Inicio"
            >
                {
                    children.map((child, index) => (
                        <Tab key={keys[index]} title={titles[index]}>
                            {child}
                        </Tab>
                    ))
                }
            </Tabs>
        </>

    )
}