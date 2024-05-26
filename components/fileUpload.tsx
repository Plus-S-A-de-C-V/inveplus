import { CheckCircledIcon, ClipboardIcon, Link1Icon, PersonIcon, HomeIcon, MobileIcon, EnvelopeOpenIcon, DrawingPinFilledIcon, CheckIcon, CopyIcon } from '@radix-ui/react-icons'


import { Card } from "@nextui-org/react";
import React from "react";

export default function FileInput({
  id,
  title,
  acceptedFileTypesText,
  acceptedFileTypes,
  onFileChange,
  isValid,
  name,
}: any) {
  const [file, setFile] = React.useState(null);

  const handleFileChange = (event: any) => {
    if (event.target.files && event.target.files[0]) {
      onFileChange(event.target.files[0]);
      setFile(event.target.files[0]);
    }
  };

  const getFileSize = (file: any) => {
    if (file) {
      // Get the size in KB, MB, GB
      const KB = 1024;
      const MB = KB * 1024;
      const GB = MB * 1024;

      if (file.size < KB) {
        return `${file.size} bytes`;
      } else if (file.size < MB) {
        return `${(file.size / KB).toFixed(2)} KB`;
      } else if (file.size < GB) {
        return `${(file.size / MB).toFixed(2)} MB`;
      } else {
        return `${(file.size / GB).toFixed(2)} GB`;
      }
    }
  };

  const getFileName = (file: any) => {
    if (file) {
      return file.name;
    }
  };

  return (
    <Card className="h-full p-4 bg-default-100" shadow="none">
      <p className="text-md font-medium">{title}</p>
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor={id}
          className={"flex flex-col items-center justify-center w-full h-64 border-2  border-dashed rounded-lg cursor-pointer   dark:border-gray-600 dark:hover:border-gray-500" + (isValid ? " border-gray-300 dark:hover:bg-neutral-800 dark:bg-neutral-900 bg-gray-50 hover:bg-gray-100" : " border-red-500 dark:hover:bg-red-950 dark:bg-red-800 bg-red-50 hover:bg-red-100")}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {(file && (
              <CheckCircledIcon className="w-8 h-8 text-green-500" />
            )) || <ClipboardIcon className="w-8 h-10  text-gray-400" />}
            <div className="flex flex-row">
              {(file && (
                <div className="flex flex-row">
                  <p className="text-sm mr-4">{getFileName(file)}</p>
                  <p className="text-sm text-default-400">
                    {getFileSize(file)}
                  </p>
                </div>
              )) || (
                  <p className="text-sm text-default-400">
                    Ningun archivo seleccionado
                  </p>
                )}
            </div>
            <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click para cargar</span> ó
              arrastra los archivos
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {acceptedFileTypesText}
            </p>
          </div>
          <input
            name={name}
            id={id}
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept={acceptedFileTypes}
          />
        </label>
      </div>
    </Card>
  );
}
