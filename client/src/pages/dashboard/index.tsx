import DashboardPageContent from "@/components/DashboardPageContent";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import axios from "axios";
export default function Home({ data }: { data: any }) {
  return (
    <>
      <Navbar />
      <DashboardPageContent avalableSlotsList={data} />
      <Footer />
    </>
  );
}

export async function getServerSideProps(context: any) {
  try {
    const res = await axios.get("http://localhost:3050/api/appointment/all");

    return {
      props: {
        data: res?.data,
      },
    };
  } catch (err) {
    console.log(err);
    return {
      props: {
        data: [],
      },
    };
  }
}
