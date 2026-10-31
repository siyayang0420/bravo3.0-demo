// Component — the promo banner: title, subtitle and button on the left, an
// image on the right. Home's list opens with one; search results lead with
// the limited-time offer. ponytail: the button goes nowhere yet.
import { type HomeBanner } from '../data/homeListDemo'

export default function PromoBanner({ banner }: { banner: HomeBanner }) {
  return (
    <div className="bv-home-banner">
      <div className="bv-home-banner-copy">
        <h3 className="bv-home-banner-title">{banner.title}</h3>
        <p className="bv-home-banner-sub">{banner.subtitle}</p>
        <button type="button" className="bv-home-banner-cta">
          {banner.cta}
        </button>
      </div>
      <img className="bv-home-banner-img" src={banner.image} alt="" />
    </div>
  )
}
