import { Check, Usuario } from "@/lib/definitions";
import { getUsers, getObject } from "@/lib/db";
import {
    Autocomplete,
    AutocompleteItem,
    User,
} from "@nextui-org/react";

interface SelectUserProps {
    label: string;
    placeholder: string;
}

interface UserWithProfile extends Usuario {
    profilePicture: Blob;
}

export default async function SelectUser({ label, placeholder }: SelectUserProps) {
    const _users = await getUsers() || [];
    const users = await Promise.all(_users.map(async (user: Usuario) => {
        const profilePic = await getObject(user.Foto);
        return {
            ...user,
            // profilePicture: new Blob([profilePic], { type: "image/*" })
        } as UserWithProfile;
    }));
    return (
        <Autocomplete
            label={label}
            placeholder={placeholder}
            className="w-full"
            defaultItems={users}
        >
            {
                users.map((user: UserWithProfile) => (
                    <AutocompleteItem key={user.id} textValue={user.Nombre}>
                        <User
                            avatarProps={{
                                radius: "lg",
                            }}
                            description={user.id}
                            name={`${user.Nombre} ${user.Apellidos}`}
                        >
                            {user.Nombre}  {user.Apellidos}
                        </User>
                    </AutocompleteItem>
                ))
            }

        </Autocomplete>
    )
}