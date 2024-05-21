import { signOut } from "@/auth"

export default function SignOutPage() {
    return (
        <div>
            <h5>¿Estas seguro de cerrar sesión?</h5>
            <form
                action={async (formData) => {
                    "use server"
                    await signOut()
                }}
            >
                <button type="submit">Sign out</button>
            </form>
        </div>
    )
}