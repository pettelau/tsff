"use client";
import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import { ConfirmModal } from "@/app/components/ConfirmModal";
import { startTransition, useState, useTransition } from "react";
import { isCSV } from "@/lib/utils";

import Papa from "papaparse";
import { NIFSchema } from "@/schemas";
import { updateNIFData } from "@/actions/update-NIF-data";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Alert } from "@/app/components/Alert";

export const NIFUpload = () => {
  const router = useRouter();
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  const [CSVFile, setCSVFile] = useState<File | undefined>();

  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [rowsAdded, setRowsAdded] = useState<number | undefined>();
  const [rowsUpdated, setRowsUpdated] = useState<number | undefined>();

  const [isPending, startTransition] = useTransition();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setCSVFile(event.target.files[0]);
    }
  };

  const validateAndUploadCSV = async (file: File | undefined) => {
    if (!file) {
      setError("Ingen fil opplastet");
      return;
    }

    if (!isCSV(file)) {
      setError("Filen er ikke på CSV-format");
      return;
    }

    setError("");
    // startTransition(() => {
    //   updateNIFData(file);
    // });
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async function (results) {
        console.log(results.data);

        const errors: any[] = [];
        const validRows: z.infer<typeof NIFSchema>[] = [];

        // Iterate over each row in the CSV data
        results.data.forEach((row, index) => {
          if (!row || Object.keys(row).length === 0) {
            // Optionally, log skipped rows or handle them as needed
            console.log(`Skipping empty or incomplete row at index ${index + 1}`);
            return; // Skip this iteration
          }
          const validated = NIFSchema.safeParse(row);
          if (!validated.success) {
            // If validation fails, add an error for this row
            errors.push({ row: index + 1, error: validated.error });
          } else {
            // If validation succeeds, add the row to validRows
            validRows.push(validated.data);
          }
        });

        // Check if there were any validation errors
        if (errors.length > 0) {
          // Handle the error case, e.g., by showing an error message
          console.error("Validation errors:", errors);
          setError("Ugyldig format på CSV-fil");
          return;
        }

        // If all rows are valid, proceed with further processing
        startTransition(() => {
          setError(undefined);
          setRowsAdded(undefined);
          setRowsUpdated(undefined);
          updateNIFData(validRows)
            .then((data) => {
              if (data.error) {
                setError(data.error);
              }

              if (data.success) {
                setSuccess(data.success);
                setRowsAdded(data.rowsAdded);
                setRowsUpdated(data.rowsUpdated);
                router.refresh();
              }
            })
            .catch(() => setError("Something went wrong!"));
        });
      },
    });
  };

  return (
    <>
      <Button onClick={onOpen}>Last opp NIF-data</Button>
      <Modal
        isOpen={isOpen}
        scrollBehavior="inside"
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          <ModalHeader>Last opp NIF-data</ModalHeader>
          <ModalBody>
            {error}
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              disabled={isPending}
            />
            {error ? (
              <Alert
                variant="danger"
                title="Kunne ikke oppdatere spillerdatabasen"
              >
                <>{error}</>
              </Alert>
            ) : (
              success && (
                <Alert variant="success" title="Databasen ble oppdatert">
                  <>
                    {rowsAdded} spillere ble lagt til, og {rowsUpdated} ble
                    oppdatert!
                  </>
                </Alert>
              )
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose} isDisabled={isPending}>
              Avbryt
            </Button>
            <ConfirmModal
              description="Er du sikker på at du vil laste opp en ny CSV-fil og dermed risikere å overskrive eksisterende data?"
              onConfirm={() => validateAndUploadCSV(CSVFile)}
              title="Oppdater spillerdatabasen"
              isDisabled={isPending || !CSVFile}
            >
              Last opp og oppdater
            </ConfirmModal>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
