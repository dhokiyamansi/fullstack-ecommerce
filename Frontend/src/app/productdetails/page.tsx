import { Suspense } from "react";
import ProductDetailsPage from "@/pages/ProductDetailsPage";

export default function Page() {
  return (
    <Suspense fallback={<div className="text-center text-2xl mt-20">Loading...</div>}>
      <ProductDetailsPage />
    </Suspense>
  );
}
