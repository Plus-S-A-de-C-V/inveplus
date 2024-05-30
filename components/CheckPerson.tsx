"use server";

import SelectUser from "@/components/SelectUser";

export default async function CheckPerson() {
    return (
        <>
            <SelectUser label="Usuario a registrar" placeholder="Selecciona un usuario" />
        </>
    )

}