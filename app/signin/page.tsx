import Link from "next/link"

import { Image } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import { signIn, providerMap } from "@/auth";

export default async function Dashboard() {
    return (
        <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
            <div className="flex items-center justify-center py-12">
                <div className="mx-auto grid w-[350px] gap-6">
                    <div className="grid gap-2 text-center">
                        <h1 className="text-3xl font-bold">Iniciar Sesión</h1>
                        <p className="text-balance text-muted-foreground">
                            Introduce tus credenciales para acceder a tu cuenta
                        </p>
                    </div>
                    <div className="grid gap-4">
                        <div className="flex flex-col gap-2">
                            <form
                                action={async (formData) => {
                                    "use server"
                                    await signIn("credentials", formData);
                                }}
                            >
                                <div className="grid gap-2">
                                    <label>ID
                                        <Input
                                            name="id"
                                            type="text"
                                            placeholder="PER-XXXXXXXX"
                                            required
                                        />
                                    </label>

                                </div>
                                <div className="grid gap-2">
                                    <label>Contraseña
                                        ¿Olvidaste tu contraseña?
                                        <Input name="password" type="password" required />
                                    </label>
                                    <Link
                                        href="/forgot-password"
                                        className="ml-auto inline-block text-sm underline"
                                    >
                                    </Link>
                                </div>
                                <Button type="submit" className="w-full">
                                    <span>Iniciar Sesión</span>
                                </Button>
                            </form>
                        </div>
                    </div>
                    {/* <div className="mt-4 text-center text-sm">
                        Don&apos;t have an account?{" "}
                        <Link href="#" className="underline">
                            Sign up
                        </Link>
                    </div> */}
                </div>
            </div >
            <div className="hidden bg-muted lg:block">
                <Image
                    src="https://placehold.co/1600"
                    alt="Image"
                    width="1920"
                    height="1080"
                    className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
            </div>
        </div >
    )
}