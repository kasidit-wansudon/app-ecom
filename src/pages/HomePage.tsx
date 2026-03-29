import Hero from '@/sections/Hero';
import Categories from '@/sections/Categories';
import Products from '@/sections/Products';
import PromoBanner from '@/sections/PromoBanner';
import Testimonials from '@/sections/Testimonials';
import Newsletter from '@/sections/Newsletter';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <section id="hero">
        <Hero />
      </section>

      <section id="categories">
        <Categories />
      </section>

      <section id="products">
        <Products />
      </section>

      <section id="promo">
        <PromoBanner />
      </section>

      <section id="testimonials">
        <Testimonials />
      </section>

      <section id="newsletter">
        <Newsletter />
      </section>
    </main>
  );
}
