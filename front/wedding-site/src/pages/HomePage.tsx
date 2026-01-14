import BackToTopButton from "../components/BackToTopButton";
import Banner from "../components/Banner";
import Footer from "../components/Footer";
import Header from "../components/Header";
import History from "../components/History";
import Info from "../components/Info";
import Local from "../components/Local";

const HomePage: React.FC = () => {
  const SectionSeparator: React.FC = () => (
    <div className="section_separator">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 10" preserveAspectRatio="none">
        <path d="M0,5 C20,-5 40,15 60,5 C80,-5 100,5 100,5" stroke="currentColor" fill="none" strokeWidth="1" />
      </svg>
    </div>
  );

  return (
    <>
      <title>Evelyn & Marccus - O Nosso Casamento</title>
      <meta name="description" content="Bem-vindos ao site do nosso casamento! Encontre todas as informações para celebrar connosco." />

      <Header />
      <Banner />
      <main>
        <div className="banner_image">
          <img src="/assets/images/logo.png" alt="logo" />
        </div>
        <SectionSeparator />
        <History />
        <SectionSeparator />
        <Info />
        <SectionSeparator />
        <Local />
        <section id="gift" className="gift fade-in"></section>
      </main>
      <Footer />
      <BackToTopButton />
    </>
  );
};

export default HomePage;