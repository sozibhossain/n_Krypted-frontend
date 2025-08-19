import Link from "next/link";
import { Button } from "@/components/ui/button";
import Layout from "@/components/dashboard/layout";
import Newsletter from "./_components/newsletter";

export default function Home() {
  return (
    <Layout>
      <Newsletter />
    </Layout>
  );
}
