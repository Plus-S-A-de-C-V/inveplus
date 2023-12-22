"use client";

import { authenticate } from "@/lib/actions";
import { useState } from "react";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Checkbox,
  Input,
  Link,
} from "@nextui-org/react";

// @ts-ignore
import { signIn, signOut, useSession } from "@/auth";
import { EnvelopeIcon as MailIcon } from "@heroicons/react/24/outline";
import { LockClosedIcon as LockIcon } from "@heroicons/react/24/outline";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSignIn = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    await signIn("credentials", {
      redirect: false,
      email,
      password,
    })
      .then((response) => {
        console.log(response);

        //route or smth
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <form onSubmit={handleSignIn}>
      <Input
        autoFocus
        required={true}
        endContent={<MailIcon className="h-6 w-6" />}
        label="Email"
        placeholder="Enter your email"
        variant="bordered"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        required={true}
        endContent={<LockIcon className="h-6 w-6" />}
        label="Password"
        placeholder="Enter your password"
        type="password"
        variant="bordered"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button type="submit">SIGN IN</Button>
    </form>
  );
}
