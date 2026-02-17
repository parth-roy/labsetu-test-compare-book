import Header from "./Header";
import Footer from "./Footer";
import CategoryNav from "./CategoryNav";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <CategoryNav />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
