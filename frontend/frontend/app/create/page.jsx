"use client";

import { useRouter } from "next/navigation";
import Modal from "../components/Modal";
import CreateRecipeForm from "../components/CreateRecipeForm";

export default function CreatePage() {
  const router = useRouter();

  return (
    <Modal onClose={() => router.push("/")}>
      <CreateRecipeForm onClose={() => router.push("/")} />
    </Modal>
  );
}
