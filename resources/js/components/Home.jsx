import Hero from './Hero';
import FeaturedProperties from './FeaturedProperties';

export default function Home({ language }) {
  return (
    <main className="min-h-screen">
      <Hero language={language} />
      <FeaturedProperties language={language} />
    </main>
  );
} 