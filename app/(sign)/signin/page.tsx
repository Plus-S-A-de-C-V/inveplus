import Link from "next/link"

import { Image } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import { signIn, providerMap } from "@/auth";

export default async function Dashboard() {
    return (
        <div className="w-full h-screen lg:grid lg:grid-cols-3">
            <div className="flex items-center justify-start max-h-screen">
                <div className="mx-auto grid w-[350px] gap-6">
                    <div className="grid gap-2 text-center items-center content-center">
                        <Image
                            src="/favicon.ico"
                            alt="Image"
                            // width="50"
                            // height="1080"
                            style={{ objectFit: "cover", width: "75%" }}
                            className="dark:brightness-[0.2] dark:grayscale align-middle text-center items-center content-center mx-auto"
                            radius="none"
                        />
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
            <div className="col-start-2 col-end-7 hidden md:block lg:block xl:block 2xl:block">
                <div className="w-full">
                    <Image
                        src="/signin.png"
                        alt="Image"
                        width="1920"
                        // height="1080"
                        style={{ objectFit: "cover", width: "100%", height: "100%" }}
                        className="dark:brightness-[0.2] dark:grayscale w-full max-h-screen"
                        radius="none"
                    />
                </div>
            </div>
        </div >
    )
}