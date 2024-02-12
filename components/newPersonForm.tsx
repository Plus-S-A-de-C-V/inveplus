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
} from "@nextui-org/react";

import React, { useRef } from "react";
import {
  IdentificationIcon,
  ReceiptPercentIcon,
  HeartIcon,
  FingerPrintIcon,
  HomeIcon,
  DevicePhoneMobileIcon,
  EnvelopeIcon,
  EyeDropperIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

import FileInput from "@/components/fileUpload";

const DefaultUser = "https://www.gravatar.com/avatar/?d=mp&s=256";
import { z } from "zod";
const bcrypt = require("bcryptjs");

export default function NewPersonForm() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [nombre, setNombre] = React.useState("");
  const [nombreIsValid, setNombreIsValid] = React.useState(true);
  const [apellidos, setApellidos] = React.useState("");
  const [apellidosIsValid, setApellidosIsValid] = React.useState(true);
  const [isSystemUser, setSystemUser] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [passwordIsValid, setPasswordIsValid] = React.useState(true);
  const [fechaDeNacimiento, setFecha] = React.useState("");
  const [fechaDeNacimientoIsValid, setFechaIsValid] = React.useState(true);
  const [curp, setCurp] = React.useState("");
  const [curpIsValid, setCurpIsValid] = React.useState(true);
  const [rfc, setRfc] = React.useState("");
  const [rfcIsValid, setRfcIsValid] = React.useState(true);
  const [nss, setNSS] = React.useState("");
  const [nssIsInvalid, setNSSIsValid] = React.useState(true);
  const [claveLector, setClaveLector] = React.useState("");
  const [claveLectorIsValid, setClaveLectorIsValid] = React.useState(true);
  const [direccion, setDireccion] = React.useState("");
  const [direccionIsValid, setDireccionIsValid] = React.useState(true);
  const [numeroTelefonico, setNumeroTelefonico] = React.useState("");
  const [numeroTelefonicoIsValid, setNumeroTelefonicoIsValid] =
    React.useState(true);
  const [email, setEmail] = React.useState("");
  const [emailIsValid, setEmailIsValid] = React.useState(true);
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
  const [clinica, setClinica] = React.useState("");
  const [clinicaIsValid, setClinicaIsValid] = React.useState(true);
  const [tipoSangre, setSangre] = React.useState("");
  const [sangreIsValid, setSangreIsValid] = React.useState(true);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleFileChange = (event: any) => {
    if (event.target.files && event.target.files[0]) {
      setProfilePic(event.target.files[0]);
      console.log(profilePic);
    }
  };

  const validateCURP = (curp: string) => {
    const re =
      /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/;
    const validado = curp.match(re);

    if (!validado) {
      //Coincide con el formato general?
      return false;
    }

    //Validar que coincida el dígito verificador
    function digitoVerificador(curp17: string) {
      //Fuente https://consultas.curp.gob.mx/CurpSP/
      var diccionario = "0123456789ABCDEFGHIJKLMNÑOPQRSTUVWXYZ",
        lngSuma = 0.0,
        lngDigito = 0.0;
      for (var i = 0; i < 17; i++)
        lngSuma = lngSuma + diccionario.indexOf(curp17.charAt(i)) * (18 - i);
      lngDigito = 10 - (lngSuma % 10);
      if (lngDigito == 10) return 0;
      return lngDigito;
    }

    if (parseInt(validado[2]) != digitoVerificador(validado[1])) {
      return false;
    }

    return true;
  };

  const validarRFC = (rfc: string) => {
    const aceptarGenerico = false;
    const re =
      /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/;
    const validado = rfc.match(re);

    if (!validado) {
      return false;
    }

    //Separar el dígito verificador del resto del RFC
    const digitoVerificador = validado.pop(),
      rfcSinDigito = validado.slice(1).join(""),
      len = rfcSinDigito.length;

    //Obtener el digito esperado
    const diccionario = "0123456789ABCDEFGHIJKLMN&OPQRSTUVWXYZ Ñ";
    const indice = len + 1;
    let suma, digitoEsperado;

    if (len == 12) suma = 0;
    else suma = 481; //Ajuste para persona moral

    for (var i = 0; i < len; i++)
      suma += diccionario.indexOf(rfcSinDigito.charAt(i)) * (indice - i);
    digitoEsperado = 11 - (suma % 11);
    if (digitoEsperado == 11) digitoEsperado = 0;
    else if (digitoEsperado == 10) digitoEsperado = "A";

    //El dígito verificador coincide con el esperado?
    // o es un RFC Genérico (ventas a público general)?
    if (
      digitoVerificador != digitoEsperado &&
      (!aceptarGenerico || rfcSinDigito + digitoVerificador != "XAXX010101000")
    )
      return false;
    else if (
      !aceptarGenerico &&
      rfcSinDigito + digitoVerificador == "XEXX010101000"
    )
      return false;
    return rfcSinDigito + digitoVerificador;
  };

  const validarNSS = (nss: string) => {
    const re = /^(\d{2})(\d{2})(\d{2})\d{5}$/;
    const validado = nss.match(re);

    if (!validado) {
      return false;
    }

    const subDeleg = parseInt(validado[1], 10);
    const anno = new Date().getFullYear() % 100;
    let annoAlta = parseInt(validado[2], 10);
    let annoNac = parseInt(validado[3], 10);

    //Comparar años (excepto que no tenga año de nacimiento)
    if (subDeleg != 97) {
      if (annoAlta <= anno) annoAlta += 100;
      if (annoNac <= anno) annoNac += 100;
      if (annoNac > annoAlta) return false; // Err: se dio de alta antes de nacer!
    }

    return luhn(nss);
  };

  const luhn = (nss: string) => {
    let suma = 0;
    let par = false;

    for (var i = nss.length - 1; i >= 0; i--) {
      let digito = parseInt(nss.charAt(i), 10);
      if (par) if ((digito *= 2) > 9) digito -= 9;

      par = !par;
      suma += digito;
    }
    return suma % 10 == 0;
  };

  const validatePhone = (phone: string) => {
    // const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    const re = /(\(\d{3}\)[.-]?|\d{3}[.-]?)?\d{3}[.-]?\d{4}/;
    return re.test(phone);
  };

  const handleSubmit = async () => {
    console.log("Submitting");

    const dataToCheck = [
      { value: nombre, setInvalid: setNombreIsValid, fieldName: "Nombre" },
      {
        value: apellidos,
        setInvalid: setApellidosIsValid,
        fieldName: "Apellidos",
      },
      {
        value: isSystemUser ? password : "UsuarioSinContraseña",
        setInvalid: setPasswordIsValid,
        fieldName: "Password",
      },
      {
        value: fechaDeNacimiento,
        setInvalid: setFechaIsValid,
        fieldName: "Fecha de nacimiento",
      },
      { value: curp, setInvalid: setCurpIsValid, fieldName: "CURP" },
      // { value: rfc, setInvalid: setRfcIsValid },
      // { value: nss, setInvalid: setNSSIsValid },
      {
        value: claveLector,
        setInvalid: setClaveLectorIsValid,
        fieldName: "Clave lector",
      },
      {
        value: direccion,
        setInvalid: setDireccionIsValid,
        fieldName: "Dirección",
      },
      {
        value: numeroTelefonico,
        setInvalid: setNumeroTelefonicoIsValid,
        fieldName: "Numero telefonico",
      },
      {
        value: email,
        setInvalid: setEmailIsValid,
        fieldName: "Correo electronico",
      },
      // { value: clinica, setInvalid: setClinicaIsValid },
      {
        value: tipoSangre,
        setInvalid: setSangreIsValid,
        fieldName: "Tipo de sangre",
      },
    ];

    let isValid = true;

    dataToCheck.forEach(({ value, setInvalid }) => {
      console.log("Checking ", value);
      if (value === "" || value.length === 0) {
        setInvalid(false);
        isValid = false;
        inputRef.current?.focus();
      } else {
        setInvalid(true);
      }
    });

    if (fileINE === null) {
      setFileINEIsValid(false);
      isValid = false;
    } else {
      setFileINEIsValid(true);
    }

    // if (fileConstancia === null) {
    //   setFileConstanciaIsValid(false);
    //   isValid = false;
    // } else {
    //   setFileConstanciaIsValid(true);
    // }

    // if (fileAsignacion === null) {
    //   setFileAsignacionIsValid(false);
    //   isValid = false;
    // } else {
    //   setFileAsignacionIsValid(true);
    // }

    if (fileCURP === null) {
      setFileCURPIsValid(false);
      isValid = false;
    } else {
      setFileCURPIsValid(true);
    }

    // Validate Email with zod
    if (z.string().email().safeParse(email).success === false) {
      setEmailIsValid(false);
      isValid = false;
    }

    // If CURP is not empty, validate it, if not, continue
    if (curp === "") {
      setCurpIsValid(true);
    } else if (!validateCURP(curp)) {
      setCurpIsValid(false);
      isValid = false;
    }

    if (rfc === "") {
      setRfcIsValid(true);
    } else if (!validarRFC(rfc)) {
      setRfcIsValid(false);
      isValid = false;
    }

    if (nss === "") {
      setNSSIsValid(true);
    } else if (!validarNSS(nss)) {
      setNSSIsValid(false);
      isValid = false;
    }

    if (!validatePhone(numeroTelefonico)) {
      setNumeroTelefonicoIsValid(false);
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    const fileToUplaod = [
      fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": profilePic?.type || "document/pdf",
        },
        body: profilePic,
      }).then((res) => res.json()),

      fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": fileINE?.type || "document/pdf",
        },
        body: fileINE,
      }).then((res) => res.json()),

      fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": fileConstancia?.type || "document/pdf",
        },
        body: fileConstancia,
      }).then((res) => res.json()),

      fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": fileAsignacion?.type || "document/pdf",
        },
        body: fileAsignacion,
      }).then((res) => res.json()),

      fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": fileCURP?.type || "document/pdf",
        },
        body: fileCURP,
      }).then((res) => res.json()),
    ];

    // TODO: Handle errors
    const uploadedFiles = await Promise.all(fileToUplaod);

    const [
      _profilePicUrl,
      _fileINEUrl,
      _fileConstanciaUrl,
      _fileAsignacionUrl,
      _fileCURPUrl,
    ] = uploadedFiles;

    const profilePicUrl = _profilePicUrl.fileName;
    const fileINEUrl = _fileINEUrl.fileName;
    const fileConstanciaUrl = _fileConstanciaUrl?.fileName || null;
    const fileAsignacionUrl = _fileAsignacionUrl?.fileName || null;
    const fileCURPUrl = _fileCURPUrl.fileName;

    // Hash password and send it
    console.log("Hashing password... and sending it...");
    bcrypt.hash(password, 20, async (err: any, hash: any) => {
      if (err) {
        // TODO: Handle error
        console.error(err);
        return;
      }

      const hashedPassword = hash;
      const nuevaPersona = {
        profilePicUrl,
        nombre,
        apellidos,
        hashedPassword,
        isSystemUser,
        fechaDeNacimiento,
        curp,
        rfc,
        nss,
        claveLector,
        direccion,
        numeroTelefonico,
        email,
        clinica,
        tipoSangre,
        fileINEUrl,
        fileConstanciaUrl,
        fileAsignacionUrl,
        fileCURPUrl,
      };

      console.log("Data2Send: ", nuevaPersona);

      await fetch("/api/nuevaPersona", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nuevaPersona,
        }),
      })
        .then((res) => {
          if (res.status === 200) {
            console.log("Success", res);
          }
        })
        .catch((err) => {
          console.log("Error", err);
        });
    });
  };

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

  return (
    // The first section is about basic user information
    // where it's the user photo, first and last name
    <div className="w-full flex flex-col">
      <Modal isOpen={isUploading}></Modal>

      <div className="w-full">
        <div className="w-full flex flex-col gap-4">
          <p className="text-3xl mr-auto my-3 font-bold">Información Basica</p>
          <div className="w-full flex flex-col">
            <div className="w-full py-4">
              <div className="flex items-center justify-center">
                <Card isFooterBlurred radius="lg" className="border-none">
                  <input
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
                </Card>
              </div>
            </div>
            <div className="flex flex-row w-full">
              <Input
                isClearable
                isRequired
                type="text"
                label="Nombre"
                placeholder="Escribe el nombre de la nueva persona..."
                value={nombre}
                onValueChange={setNombre}
                isInvalid={!nombreIsValid}
                id="nombre"
                ref={inputRef}
              />
              <Spacer x={3} />
              <Input
                isClearable
                isRequired
                type="text"
                label="Apellidos"
                placeholder="Escribe los apellidos de la nueva persona..."
                value={apellidos}
                onValueChange={setApellidos}
                isInvalid={!apellidosIsValid}
                id="apellidos"
                ref={inputRef}
              />
            </div>
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
            {isSystemUser && (
              <Input
                isClearable
                isRequired
                type="password"
                label="Contraseña"
                placeholder="Escribe la contraseña para la nueva persona..."
                value={password}
                onValueChange={setPassword}
                isInvalid={!passwordIsValid}
                id="password"
                ref={inputRef}
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
            isRequired
            type="date"
            label="Fecha de Nacimiento"
            labelPlacement="outside-left"
            className="p-2 w-full"
            // startContent={<HomeIcon className="w-5 h-5 text-default-400" />}
            id="fechaDeNacimiento"
            max={new Date().toISOString().split("T")[0]}
            min={"1900-01-01"}
            onValueChange={setFecha}
            value={fechaDeNacimiento}
            color={fechaDeNacimientoIsValid ? "default" : "danger"}
            ref={inputRef}
          />

          <Input
            isClearable
            isRequired
            type="text"
            label="CURP"
            placeholder="Escribe el CURP de la nueva persona..."
            className="p-2 w-full"
            startContent={
              <IdentificationIcon className="w-5 h-5 text-default-400" />
            }
            value={curp}
            onValueChange={setCurp}
            isInvalid={!curpIsValid}
            id="curp"
            ref={inputRef}
          />
          <Input
            isClearable
            // isRequired
            type="text"
            label="RFC"
            placeholder="Escribe el RFC de la nueva persona..."
            className="p-2 w-full"
            startContent={
              <ReceiptPercentIcon className="w-5 h-5 text-default-400" />
            }
            value={rfc}
            onValueChange={setRfc}
            isInvalid={!rfcIsValid}
            id="rfc"
            ref={inputRef}
          />
          <Input
            isClearable
            // isRequired
            type="text"
            label="NSS"
            placeholder="Escribe el NSS de la nueva persona..."
            className="p-2 w-full"
            startContent={<HeartIcon className="w-5 h-5 text-default-400" />}
            value={nss}
            onValueChange={setNSS}
            isInvalid={!nssIsInvalid}
            id="nss"
            ref={inputRef}
          />
          <Input
            isClearable
            isRequired
            type="text"
            label="Clave de Lector"
            placeholder="Escribe la Clave de Lector de la nueva persona..."
            className="p-2 w-full"
            startContent={
              <FingerPrintIcon className="w-5 h-5 text-default-400" />
            }
            value={claveLector}
            onValueChange={setClaveLector}
            isInvalid={!claveLectorIsValid}
            id="claveLector"
            ref={inputRef}
          />
          <Input
            isClearable
            isRequired
            type="text"
            label="Dirección"
            placeholder="Escribe la dirección de la nueva persona..."
            className="p-2 w-full"
            startContent={<HomeIcon className="w-5 h-5 text-default-400" />}
            value={direccion}
            onValueChange={setDireccion}
            isInvalid={!direccionIsValid}
            id="direccion"
            ref={inputRef}
          />

          <Input
            isClearable
            isRequired
            type="text"
            label="Numero de Contacto"
            placeholder="Escribe el numero de contacto de la nueva persona..."
            className="p-2 w-full"
            startContent={
              <DevicePhoneMobileIcon className="w-5 h-5 text-default-400" />
            }
            value={numeroTelefonico}
            onValueChange={setNumeroTelefonico}
            isInvalid={!numeroTelefonicoIsValid}
            id="numeroTelefonico"
            ref={inputRef}
          />
          <Input
            isClearable
            isRequired
            type="email"
            label="Correo Electronico"
            placeholder="Escribe el correo electronico de la nueva persona..."
            className="p-2 w-full"
            startContent={<EnvelopeIcon className="w-5 h-5 text-default-400" />}
            value={email}
            onValueChange={setEmail}
            isInvalid={!emailIsValid}
            id="email"
            ref={inputRef}
          />
        </div>

        <div className="flex-row flex-wrap grid md:grid-cols-2 lg:grid.cols-2 gap-3">
          <FileInput
            title="Cargar INE"
            acceptedFileTypesText="PDF Unicamente"
            acceptedFileTypes={"application/pdf"}
            onFileChange={(file: any) => {
              setFileINE(file);
            }}
            isValid={fileIneIsValid}
          />
          <FileInput
            title="Cargar Constancia de Situacion Fiscal"
            acceptedFileTypesText="PDF Unicamente"
            acceptedFileTypes={"application/pdf"}
            onFileChange={(file: any) => {
              setFileConstancia(file);
            }}
            isValid={fileConstanciaIsValid}
          />
          <FileInput
            title="Cargar Asignación de Numero de Seguro Social"
            acceptedFileTypesText="PDF Unicamente"
            acceptedFileTypes={"application/pdf"}
            Change={(file: any) => {
              setFileAsignacion(file);
            }}
            isValid={fileAsignacionIsValid}
          />
          <FileInput
            title="Cargar CURP"
            acceptedFileTypesText="PDF Unicamente"
            acceptedFileTypes={"application/pdf"}
            onFileChange={(file: any) => {
              setFileCURP(file);
            }}
            isValid={fileCURPIsValid}
          />
        </div>
        {/* TODO: Add map
          <Map
            initialViewState={{
              latitude: 22.1268734,
              longitude: -100.9174276,
              zoom: 18,
            }}
            style={{ width: 600, height: 400 }}
            // mapStyle="https://api.maptiler.com/maps/streets/style.json?key=get_your_own_key"
            mapStyle="https://api.maptiler.com/maps/streets-v2-pastel/style.json?key=o7xqVEeWnFYaAmW64KKV"
          /> */}
      </div>
      <Divider className="my-4" />
      <div>
        <p className="text-3xl mr-auto my-2 font-bold">Información Medica</p>
        <div className="flex-row flex-wrap grid md:grid-cols-1 lg:grid-cols-2">
          <Input
            isClearable
            // isRequired
            type="text"
            label="Clinica Asignada"
            placeholder="Escribe la Clinica Asignada de la nueva persona..."
            className="p-2 w-full"
            startContent={<HomeIcon className="w-5 h-5 text-default-400" />}
            value={clinica}
            onValueChange={setClinica}
            isInvalid={!clinicaIsValid}
            id="clinica"
            ref={inputRef}
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
          <Select
            className="p-2 w-full"
            label="Tipo de Sangre"
            placeholder="Selecciona el tipo de sangre..."
            isRequired
            startContent={
              <EyeDropperIcon className="w-5 h-5 text-default-400" />
            }
            value={tipoSangre}
            onChange={(e) => setSangre(e.target.value)}
            isInvalid={!sangreIsValid}
            id="sangre"
          >
            {tiposDeSangre.map((animal) => (
              <SelectItem key={animal.value} value={animal.value}>
                {animal.label}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>
      <Divider className="my-4" />

      <div className="flex flex-row justify-end">
        <Button
          color="primary"
          startContent={<CheckIcon className="h-6 w-6" />}
          onClick={handleSubmit}
        >
          Crear Usuario
        </Button>
      </div>
    </div>
  );
}
