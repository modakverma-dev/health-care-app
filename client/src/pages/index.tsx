import DashboardPageContent from "@/components/DashboardPageContent";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Inter } from "next/font/google";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  return (
    <div className="flex flex-col overflow-auto">
      <Navbar />
      <div className="pt-20 max-w-[70%] self-center h-screen">
        <h1>
          Lorem, ip Lorem, ipsum. Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Nisi repudiandae nobis quaerat dignissimos libero!
          Aut, cumque. Necessitatibus ipsa dolorem fugit reprehenderit, vel
          nostrum iste esse eius assumenda odio. Provident officia nihil tenetur
          aspernatur?{" "}
        </h1>
        <div className="flex justify-center my-10">
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-[#407CE2] text-white px-5 py-3 rounded-md hover:bg-[#3767ba] transition"
          >
            View appointments
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
