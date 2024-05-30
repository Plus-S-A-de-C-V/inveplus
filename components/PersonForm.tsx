import {
  Card,
  CardFooter,
  Button,
  Spacer,
  Image,
  Input,
  Divider,
  Switch,
  Select,
  SelectItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Spinner,
  Autocomplete,
  AutocompleteItem,
} from "@nextui-org/react";

import React, { FormEvent, useEffect, useRef } from "react";

import { MagnifyingGlassIcon, FileIcon, HeartIcon, PersonIcon, HomeIcon, MobileIcon, EnvelopeOpenIcon, DrawingPinFilledIcon, CheckIcon, ExternalLinkIcon } from '@radix-ui/react-icons'


import FileInput from "@/components/fileUpload";

// import {Calendar} from "@nextui-org/react";

const DefaultUser = "https://www.gravatar.com/avatar/?d=mp&s=256";
import { z } from "zod";
const bcrypt = require("bcryptjs");

import { Usuario } from "@/lib/definitions";
import { InformacionMedica, InformacionPersonal } from "@/lib/definitions";

interface formProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  mode: "create" | "edit" | "view";
  user?: Usuario;
  setRequestRefresh: (value: boolean) => void;
}

export default function PersonForm({ isOpen, onOpenChange, mode, user, setRequestRefresh }: formProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isSystemUser, setSystemUser] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [fechaDeNacimientoIsValid, setFechaIsValid] = React.useState(true);
  const [fileINE, setFileINE] = React.useState<File | null>(null);
  const [fileIneIsValid, setFileINEIsValid] = React.useState(true);
  const [fileConstancia, setFileConstancia] = React.useState<File | null>(null);
  const [fileConstanciaIsValid, setFileConstanciaIsValid] =
    React.useState(true);
  const [fileAsignacion, setFileAsignacion] = React.useState<File | null>(null);
  const [fileAsignacionIsValid, setFileAsignacionIsValid] =
    React.useState(true);
  const [fileCURP, setFileCURP] = React.useState<File | null>(null);
  const [fileCURPIsValid, setFileCURPIsValid] = React.useState(true);
  const [profilePic, setProfilePic] = React.useState<File | null>(null);
  const [tipoSangre, setSangre] = React.useState("");
  const [sangreIsValid, setSangreIsValid] = React.useState(true);

  const [isLoading, setIsLoading] = React.useState(true);
  const [sending, setSending] = React.useState(false);

  useEffect(() => {
    // Download the files
    downlaod();

    if (mode === "view" || mode === "edit") {
      setSangre(user?.InformacionMedica?.TipoDeSangre || "");
    }
  }, []);

  // useEffect(() => {
  //   console.log("New Files");
  //   console.log(profilePic);
  //   console.log(fileINE);
  //   console.log(fileConstancia);
  //   console.log(fileAsignacion);
  //   console.log(fileCURP);
  // }, [profilePic, fileINE, fileConstancia, fileAsignacion, fileCURP]);

  const downlaod = async () => {
    if (!user) return;

    setIsLoading(true);

    const profile = await fetch("/api/objects/" + user?.Foto)
      .then(async (res) => await res.blob())
      .then(async (_blob) => {
        const fileName = (user.Foto.match(/\[(.*?)\]/) || "")[1];
        // set type to image
        const file: File = new File([_blob], fileName, { type: "image/*" });
        return file;
      });

    // const ine = await fetch("/api/objects/" + user?.DocumentosPersonales?.INE)
    //   .then(async (res) => res.blob())
    //   .then(async (_blob) => {
    //     const filename = (user.DocumentosPersonales?.INE.match(/\[(.*?)\]/) || "")[1];
    //     const file = new File([_blob], filename, { type: "application/pdf" });
    //     return file;
    //   })


    // const constancia = await fetch("/api/objects/" + user?.DocumentosPersonales?.ConstanciaDeSituacionFiscal)
    //   .then(async (res) => res.blob())
    //   .then(async (_blob) => {
    //     const filename = (user.DocumentosPersonales?.ConstanciaDeSituacionFiscal.match(/\[(.*?)\]/) || "")[1];
    //     const file = new File([_blob], filename, { type: "application/pdf" });
    //     return file;
    //   });

    // const nss = await fetch("/api/objects/" + user?.DocumentosPersonales?.AsignacionDeNSS)
    //   .then(async (res) => res.blob())
    //   .then(async (_blob) => {
    //     const filename = (user.DocumentosPersonales?.AsignacionDeNSS.match(/\[(.*?)\]/) || "")[1];
    //     const file = new File([_blob], filename, { type: "application/pdf" });
    //     return file;
    //   });

    // const curp = await fetch("/api/objects/" + user?.DocumentosPersonales?.CURP)
    //   .then(async (res) => res.blob())
    //   .then(async (_blob) => {
    //     const filename = (user.DocumentosPersonales?.CURP.match(/\[(.*?)\]/) || "")[1];
    //     const file = new File([_blob], filename, { type: "application/pdf" });
    //     return file;
    //   });

    console.log("Profile pic:", profile);
    await setProfilePic(profile);
    // await setFileINE(ine);
    // await setFileConstancia(constancia);
    // await setFileAsignacion(nss);
    // await setFileCURP(curp);

    // // sleep for 1 second
    // await new Promise((resolve) => setTimeout(resolve, 1000));

    // console.log("Files Downloaded")
    // console.log(profilePic);
    // console.log(fileINE);
    // console.log(fileConstancia);
    // console.log(fileAsignacion);
    // console.log(fileCURP);
    setIsLoading(false);
  }

  const handleFileChange = (event: any) => {
    if (event.target.files && event.target.files[0]) {
      setProfilePic(event.target.files[0]);
      console.log(profilePic);
    }
  };

  // const validateCURP = (curp: string) => {
  //   const re =
  //     /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/;
  //   const validado = curp.match(re);

  //   if (!validado) {
  //     //Coincide con el formato general?
  //     return false;
  //   }

  //   //Validar que coincida el dígito verificador
  //   function digitoVerificador(curp17: string) {
  //     //Fuente https://consultas.curp.gob.mx/CurpSP/
  //     var diccionario = "0123456789ABCDEFGHIJKLMNÑOPQRSTUVWXYZ",
  //       lngSuma = 0.0,
  //       lngDigito = 0.0;
  //     for (var i = 0; i < 17; i++)
  //       lngSuma = lngSuma + diccionario.indexOf(curp17.charAt(i)) * (18 - i);
  //     lngDigito = 10 - (lngSuma % 10);
  //     if (lngDigito == 10) return 0;
  //     return lngDigito;
  //   }

  //   if (parseInt(validado[2]) != digitoVerificador(validado[1])) {
  //     return false;
  //   }

  //   return true;
  // };

  // const validarRFC = (rfc: string) => {
  //   const aceptarGenerico = false;
  //   const re =
  //     /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/;
  //   const validado = rfc.match(re);

  //   if (!validado) {
  //     return false;
  //   }

  //   //Separar el dígito verificador del resto del RFC
  //   const digitoVerificador = validado.pop(),
  //     rfcSinDigito = validado.slice(1).join(""),
  //     len = rfcSinDigito.length;

  //   //Obtener el digito esperado
  //   const diccionario = "0123456789ABCDEFGHIJKLMN&OPQRSTUVWXYZ Ñ";
  //   const indice = len + 1;
  //   let suma, digitoEsperado;

  //   if (len == 12) suma = 0;
  //   else suma = 481; //Ajuste para persona moral

  //   for (var i = 0; i < len; i++)
  //     suma += diccionario.indexOf(rfcSinDigito.charAt(i)) * (indice - i);
  //   digitoEsperado = 11 - (suma % 11);
  //   if (digitoEsperado == 11) digitoEsperado = 0;
  //   else if (digitoEsperado == 10) digitoEsperado = "A";

  //   //El dígito verificador coincide con el esperado?
  //   // o es un RFC Genérico (ventas a público general)?
  //   if (
  //     digitoVerificador != digitoEsperado &&
  //     (!aceptarGenerico || rfcSinDigito + digitoVerificador != "XAXX010101000")
  //   )
  //     return false;
  //   else if (
  //     !aceptarGenerico &&
  //     rfcSinDigito + digitoVerificador == "XEXX010101000"
  //   )
  //     return false;
  //   return rfcSinDigito + digitoVerificador;
  // };

  // const validarNSS = (nss: string) => {
  //   const re = /^(\d{2})(\d{2})(\d{2})\d{5}$/;
  //   const validado = nss.match(re);

  //   if (!validado) {
  //     return false;
  //   }

  //   const subDeleg = parseInt(validado[1], 10);
  //   const anno = new Date().getFullYear() % 100;
  //   let annoAlta = parseInt(validado[2], 10);
  //   let annoNac = parseInt(validado[3], 10);

  //   //Comparar años (excepto que no tenga año de nacimiento)
  //   if (subDeleg != 97) {
  //     if (annoAlta <= anno) annoAlta += 100;
  //     if (annoNac <= anno) annoNac += 100;
  //     if (annoNac > annoAlta) return false; // Err: se dio de alta antes de nacer!
  //   }

  //   return luhn(nss);
  // };

  // const luhn = (nss: string) => {
  //   let suma = 0;
  //   let par = false;

  //   for (var i = nss.length - 1; i >= 0; i--) {
  //     let digito = parseInt(nss.charAt(i), 10);
  //     if (par) if ((digito *= 2) > 9) digito -= 9;

  //     par = !par;
  //     suma += digito;
  //   }
  //   return suma % 10 == 0;
  // };

  // const validatePhone = (phone: string) => {
  //   // const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
  //   const re = /(\(\d{3}\)[.-]?|\d{3}[.-]?)?\d{3}[.-]?\d{4}/;
  //   return re.test(phone);
  // };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    setSending(true);
    if (mode === "view") {
      setSending(false);
      onOpenChange(false);
      return;
    } else if (mode === "edit") {
      const formData = new FormData(event.currentTarget);
      const result = await fetch("/api/users/edit/" + user?.id, {
        method: "POST",
        body: formData,
        cache: "no-cache",
      });
      if (result.status === 201) {
        await setSending(false);
        setRequestRefresh(true);
        await onOpenChange(false);
      }
    } else if (mode === "create") {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      // hash the password and store it in the form data
      if (isSystemUser) {
        const hashedPassword = await bcrypt.hash(password, 10);
        formData.set("password", hashedPassword);
      }

      const result = await fetch("/api/users/new", {
        method: "POST",
        body: formData,
        cache: "no-cache",
      });

      if (result.status === 200) {
        setSending(false);
        setRequestRefresh(true);
        onOpenChange(false);
      }
    } else {
      setSending(false);
      onOpenChange(false);
    }

    setSending(false);
  }

  const tiposDeSangre = [
    { label: "A+", value: "A+" },
    { label: "A-", value: "A-" },
    { label: "B+", value: "B+" },
    { label: "B-", value: "B-" },
    { label: "AB+", value: "AB+" },
    { label: "AB-", value: "AB-" },
    { label: "O+", value: "O+" },
    { label: "O-", value: "O-" },
  ];

  type tipoDeSangre = typeof tiposDeSangre[number];

  return (
    (isLoading && mode !== "create") ? (
      <Spinner label="Cargando..." />
    ) : (
      <div className="w-full flex flex-col">
        <form
          // action={handleSubmit}
          onSubmit={handleSubmit}
        >

          <div className="w-full">
            <div className="w-full flex flex-col gap-4">
              <p className="text-3xl mr-auto my-3 font-bold">Información Basica</p>
              <div className="w-full flex flex-col">
                <div className="w-full py-4">
                  <div className="flex items-center justify-center">
                    <Card isFooterBlurred radius="lg" className="border-none">
                      <input
                        name="profilePic"
                        id="profilePic"
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        accept="image/*"
                        ref={inputRef}
                      />
                      <Image
                        alt="Foto de perfil do usuário"
                        isBlurred
                        className="object-cover"
                        height={256}
                        src={
                          profilePic ? URL.createObjectURL(profilePic) : DefaultUser
                        }
                        fallbackSrc={DefaultUser}
                        width={256}
                      />
                      {
                        (mode === "edit" || mode === "create") && (
                          <CardFooter className="justify-center before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                            <Button
                              className="text-primary-900 text-lg"
                              variant="flat"
                              color="default"
                              radius="lg"
                              size="sm"
                            >
                              <label htmlFor="profilePic">Editar Fotografia</label>
                            </Button>
                          </CardFooter>
                        )
                      }
                    </Card>
                  </div>
                </div>
                <div className="flex flex-row w-full">
                  <Input
                    name="nombre"
                    isClearable={mode === "create" || mode === "edit"}
                    isRequired={mode === "create"}
                    isReadOnly={mode === "view"}
                    defaultValue={mode === "create" ? "" : user?.Nombre}
                    type="text"
                    label="Nombre"
                    placeholder="Escribe el nombre de la nueva persona..."
                    // onValueChange={setNombre}
                    // isInvalid={!nombreIsValid}
                    id="nombre"
                  // ref={inputRef}
                  />
                  <Spacer x={3} />
                  <Input
                    name="apellidos"
                    isClearable={mode === "create" || mode === "edit"}
                    isRequired={mode === "create"}
                    isReadOnly={mode === "view"}
                    defaultValue={mode === "create" ? "" : user?.Apellidos}
                    type="text"
                    label="Apellidos"
                    placeholder="Escribe los apellidos de la nueva persona..."
                    // onValueChange={setApellidos}
                    // isInvalid={!apellidosIsValid}
                    id="apellidos"
                  // ref={inputRef}
                  />
                </div>
                {
                  (mode === "edit" || mode === "create") && (
                    <Card className="w-full my-2 bg-default-100 p-2 " shadow="none">
                      <div className="flex flex-row w-full">
                        <div className="flex flex-col gap-1 w-11/12">
                          <p className="text-medium">
                            ¿Habilitar como usuario del sistema?
                          </p>
                          <p className="text-tiny text-default-400">
                            Al habilitarlo, el usuario podra acceder a este sistema, una
                            contraseña de inicio de sesión es necesaria.
                          </p>
                        </div>
                        <Switch
                          isSelected={isSystemUser}
                          onValueChange={setSystemUser}
                          aria-label="Usuario del Sistema"
                        />
                      </div>
                    </Card>
                  )
                }
                {isSystemUser && (
                  <Input
                    name="password"
                    isClearable
                    isRequired
                    type="password"
                    label="Contraseña"
                    placeholder="Escribe la contraseña para la nueva persona..."
                    // value={password}
                    // onValueChange={setPassword}
                    // isInvalid={!passwordIsValid}
                    id="password"
                  // ref={inputRef}
                  />
                )}
              </div>
            </div>
          </div>
          <div>
            <p className="text-3xl mr-auto my-2 font-bold">Información Personal</p>
            <div className="flex-row flex-wrap grid md:grid-cols-1 lg:grid-cols-2">
              <Input
                // isClearable
                isClearable={mode === "create" || mode === "edit"}
                isRequired={mode === "create"}
                // isReadOnly={mode === "view"}
                readOnly={mode === "view"}
                defaultValue={
                  (mode === "edit" || mode === "view")
                    ? new Date(user?.InformacionPersonal?.FechaDeNacimiento || "").toISOString().split("T")[0]
                    : ""
                }
                name="fechaDeNacimiento"
                type="date"
                label="Fecha de Nacimiento"
                labelPlacement="outside-left"
                className="p-2 w-full"
                // startContent={<HomeIcon className="w-5 h-5 text-default-400" />}
                id="fechaDeNacimiento"
                max={new Date().toISOString().split("T")[0]}
                min={"1900-01-01"}
                // onValueChange={setFecha}
                color={fechaDeNacimientoIsValid ? "default" : "danger"}
                ref={inputRef}
              />

              <Input
                name="curp"
                isClearable={mode === "create" || mode === "edit"}
                isRequired={mode === "create"}
                isReadOnly={mode === "view"}
                defaultValue={mode === "create" ? "" : user?.InformacionPersonal?.CURP}
                type="text"
                label="CURP"
                placeholder="Escribe el CURP de la nueva persona..."
                className="p-2 w-full"
                startContent={
                  <MagnifyingGlassIcon className="w-5 h-5 text-default-400" />
                }
                // onValueChange={setCurp}
                // isInvalid={!curpIsValid}
                id="curp"
              // ref={inputRef}
              />
              <Input
                name="rfc"
                isClearable={mode === "create" || mode === "edit"}
                isRequired={mode === "create"}
                isReadOnly={mode === "view"}
                defaultValue={mode === "create" ? "" : user?.InformacionPersonal?.RFC}
                // isRequired
                type="text"
                label="RFC"
                placeholder="Escribe el RFC de la nueva persona..."
                className="p-2 w-full"
                startContent={
                  <FileIcon className="w-5 h-5 text-default-400" />
                }
                // onValueChange={setRfc}
                // isInvalid={!rfcIsValid}
                id="rfc"
              // ref={inputRef}
              />
              <Input
                name="nss"
                isClearable={mode === "create" || mode === "edit"}
                isRequired={mode === "create"}
                isReadOnly={mode === "view"}
                defaultValue={mode === "create" ? "" : user?.InformacionPersonal?.NSS}
                type="text"
                label="NSS"
                placeholder="Escribe el NSS de la nueva persona..."
                className="p-2 w-full"
                startContent={<HeartIcon className="w-5 h-5 text-default-400" />}
                // onValueChange={setNSS}
                // isInvalid={!nssIsInvalid}
                id="nss"
              // ref={inputRef}
              />
              <Input
                isClearable={mode === "create" || mode === "edit"}
                isRequired={mode === "create"}
                isReadOnly={mode === "view"}
                defaultValue={mode === "create" ? "" : user?.InformacionPersonal?.ClaveLector}
                name="claveLector"
                type="text"
                label="Clave de Lector"
                placeholder="Escribe la Clave de Lector de la nueva persona..."
                className="p-2 w-full"
                startContent={
                  <PersonIcon className="w-5 h-5 text-default-400" />
                }
                // onValueChange={setClaveLector}
                // isInvalid={!claveLectorIsValid}
                id="claveLector"
              // ref={inputRef}
              />
              <Input
                name="direccion"
                isClearable={mode === "create" || mode === "edit"}
                isRequired={mode === "create"}
                isReadOnly={mode === "view"}
                defaultValue={mode === "create" ? "" : user?.InformacionPersonal?.Direccion}
                type="text"
                label="Dirección"
                placeholder="Escribe la dirección de la nueva persona..."
                className="p-2 w-full"
                startContent={<HomeIcon className="w-5 h-5 text-default-400" />}
                // onValueChange={setDireccion}
                // isInvalid={!direccionIsValid}
                id="direccion"
              // ref={inputRef}
              />

              <Input
                name="numeroTelefonico"
                isClearable={mode === "create" || mode === "edit"}
                isRequired={mode === "create"}
                isReadOnly={mode === "view"}
                defaultValue={mode === "create" ? "" : user?.InformacionPersonal?.NumeroTelefonico}
                type="text"
                label="Numero de Contacto"
                placeholder="Escribe el numero de contacto de la nueva persona..."
                className="p-2 w-full"
                startContent={
                  <MobileIcon className="w-5 h-5 text-default-400" />
                }
                // onValueChange={setNumeroTelefonico}
                // isInvalid={!numeroTelefonicoIsValid}
                id="numeroTelefonico"
              // ref={inputRef}
              />
              <Input
                name="email"
                isClearable={mode === "create" || mode === "edit"}
                isRequired={mode === "create"}
                isReadOnly={mode === "view"}
                defaultValue={mode === "create" ? "" : user?.InformacionPersonal?.correoElectronico}
                type="email"
                label="Correo Electronico"
                placeholder="Escribe el correo electronico de la nueva persona..."
                className="p-2 w-full"
                startContent={<EnvelopeOpenIcon className="w-5 h-5 text-default-400" />}
                // onValueChange={setEmail}
                // isInvalid={!emailIsValid}
                id="email"
              // ref={inputRef}
              />
            </div>

            <div className="flex-row flex-wrap grid md:grid-cols-2 lg:grid.cols-2 gap-3">
              <FileInput
                name="fileINE"
                title="Cargar INE"
                acceptedFileTypesText="PDF Unicamente"
                acceptedFileTypes={"application/pdf"}
                isValid
                onFileChange={(file: any) => {
                  setFileINE(file);
                }}
                // file={fileINE}
                fileUrl={user?.DocumentosPersonales?.INE}
                // isValid={fileIneIsValid}
                viewOnly={mode === "view"}
              />
              <FileInput
                viewOnly={mode === "view"}
                name="fileConstancia"
                title="Cargar Constancia de Situacion Fiscal"
                acceptedFileTypesText="PDF Unicamente"
                acceptedFileTypes={"application/pdf"}
                isValid
                onFileChange={(file: any) => {
                  setFileConstancia(file);
                }}
                fileUrl={user?.DocumentosPersonales?.ConstanciaDeSituacionFiscal}
              // isValid={fileConstanciaIsValid}
              />
              <FileInput
                viewOnly={mode === "view"}
                name="fileAsignacion"
                title="Cargar Asignación de Numero de Seguro Social"
                acceptedFileTypesText="PDF Unicamente"
                acceptedFileTypes={"application/pdf"}
                isValid
                onFileChange={(file: any) => {
                  setFileAsignacion(file);
                }}
                fileUrl={user?.DocumentosPersonales?.AsignacionDeNSS}
              // isValid={fileAsignacionIsValid}
              />
              <FileInput
                viewOnly={mode === "view"}
                name="fileCURP"
                title="Cargar CURP"
                acceptedFileTypesText="PDF Unicamente"
                acceptedFileTypes={"application/pdf"}
                isValid
                onFileChange={(file: any) => {
                  setFileCURP(file);
                }}
                fileUrl={user?.DocumentosPersonales?.CURP}
              // isValid={fileCURPIsValid}
              />
              <FileInput
                viewOnly={mode === "view"}
                name="comprobanteDomicilio"
                title="Cargar Comprobante de Domicilio"
                acceptedFileTypesText="PDF Unicamente"
                acceptedFileTypes={"application/pdf"}
                isValid
                onFileChange={(file: any) => {
                  setFileINE(file);
                }}
                fileUrl={user?.DocumentosPersonales?.ComprobanteDeDomicilio}
              // isValid={fileIneIsValid}
              />
            </div>
          </div>
          <Divider className="my-4" />
          <div>
            <p className="text-3xl mr-auto my-2 font-bold">Información Medica</p>
            <div className="flex-row flex-wrap grid md:grid-cols-1 lg:grid-cols-2">
              <Input
                name="clinica"
                isClearable={mode === "create" || mode === "edit"}
                isRequired={mode === "create"}
                isReadOnly={mode === "view"}
                defaultValue={mode === "create" ? "" : user?.InformacionMedica?.ClinicaAsignada}
                // isRequired
                type="text"
                label="Clinica Asignada"
                placeholder="Escribe la Clinica Asignada de la nueva persona..."
                className="p-2 w-full"
                startContent={<HomeIcon className="w-5 h-5 text-default-400" />}
                // onValueChange={setClinica}
                // isInvalid={!clinicaIsValid}
                id="clinica"
              // ref={inputRef}
              />
              {/* <Input
              isClearable
              isRequired
              type="text"
              label="Tipo de Sangre"
              placeholder="Escribe el tipo de sangre de la nueva persona..."
              className="p-2 w-full"
              startContent={
                <EyeDropperIcon className="w-5 h-5 text-default-400" />
              }
              value={tipoSangre}
              onValueChange={setSangre}
              isInvalid={!sangreIsValid}
            /> */}
              {
                mode === "view" ? (
                  <>
                    <div>
                      <label className="text-lg font-semibold">Tipo de Sangre</label>
                      <p className="text-lg">{user?.InformacionMedica?.TipoDeSangre}</p>
                    </div>
                  </>
                ) : (
                  <Autocomplete
                    name="tipoSangre"
                    label="Tipo de sangre"
                    placeholder="Seleccione un tipo"
                    className="p-2 w-full"
                    isLoading={isLoading}
                    isRequired
                    errorMessage="Selecciona un Usuario"
                    // selectedKey={tipoSangre}
                    // onSelectionChange={(key) => setSangre(key?.toString() || "")}
                  >
                    {
                      tiposDeSangre.map((tipo: tipoDeSangre) => (
                        <AutocompleteItem key={tipo.label} textValue={tipo.value}>
                          <p>
                            {tipo.label}
                          </p>
                        </AutocompleteItem>
                      ))
                    }
                  </Autocomplete>

                  // <Select
                  //   name="tipoSangre"
                  //   selectionMode="single"
                  //   // isClearable={mode === "create" || mode === "edit"}
                  //   isRequired={mode === "create"}
                  //   // isReadOnly={mode === "view"}
                  //   // value={mode === "create" ? tipoSangre : user?.InformacionMedica?.TipoDeSangre}
                  //   value={tipoSangre}
                  //   className="p-2 w-full"
                  //   label="Tipo de Sangre"
                  //   placeholder="Selecciona el tipo de sangre..."
                  //   startContent={
                  //     <DrawingPinFilledIcon className="w-5 h-5 text-default-400" />
                  //   }
                  //   onChange={(e) => setSangre(e.target.value)}
                  //   isInvalid={!sangreIsValid}
                  //   id="sangre"
                  //   items={tiposDeSangre}
                  // // selectedKeys={tipoSangre}
                  // // onSelectionChange={(key) => setSangre(key?.toString() || "")}
                  // >
                  //   {(item: tipoDeSangre) => (
                  //     <SelectItem key={item.value} className="capitalize w-full">
                  //       {item.label}
                  //     </SelectItem>
                  //   )}
                  // </Select>
                )
              }
            </div>
          </div>
          <Divider className="my-4" />

          <div className="flex flex-row justify-end">
            <Button
              color="primary"
              startContent={<CheckIcon className="h-6 w-6" />}
              type="submit"
              isLoading={sending}
              disabled={sending}
            >
              {
                mode === "create" ? "Crear Usuario" : mode === "edit" ? "Guardar Cambios" : "Cerrar"
              }
            </Button>
          </div>

        </form>

      </div>
    )
  )
}
