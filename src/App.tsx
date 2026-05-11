import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Home from "./pages/Home";

const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Certifications = lazy(() => import("./pages/Certifications"));
const Partners = lazy(() => import("./pages/Partners"));
const NotFound = lazy(() => import("./pages/NotFound"));

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-foam dark:bg-slate-900 flex flex-col">
          <Nav />
          <div className="flex-1">
            <Suspense fallback={null}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products/:slug" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/certifications" element={<Certifications />} />
                <Route path="/partners" element={<Partners />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    </CartProvider>
  );
}
