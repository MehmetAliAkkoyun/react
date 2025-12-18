import heroBg from "../assets/home-banner.png";

export default function Hero({ onOrderClick }) {
  return (
    <header
      className="hero2"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      <h1 className="hero2__brand">Teknolojik Yemekler</h1>

      <div className="hero2__content">
        <h2 className="hero2__headline">
          KOD ACIKTIRIR
          <br />
          PİZZA, DOYURUR
        </h2>

        <button type="button" className="hero2__btn" onClick={onOrderClick}>    
          ACIKTIM
        </button>
      </div>
    </header>   
  );
}
