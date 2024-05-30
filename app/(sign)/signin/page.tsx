import { Tabs, Tab, Button, Image, Input, Link, Card, CardBody, useUser } from "@nextui-org/react";
import { signIn } from "@/auth";

export default async function Dashboard() {

    return (
        <>
            <div className="relative flex flex-col w-screen h-screen">

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

                                <>
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
                                </>
                            </>
                        </CardBody>
                    </Card>
                </div>
            </div>

        </>
    )
}