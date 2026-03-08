import Header from "./Header";
import Footer from "./Footer";
import CategoryNav from "./CategoryNav";
import MobileBottomNav from "./MobileBottomNav";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <CategoryNav />
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default Layout;
