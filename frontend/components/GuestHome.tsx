import styles from "../app/page.module.css";

export default function GuestHome() {
  return (
    <main className={styles.container}>
      {/* HERO SECTION */}
      <section className={styles.heroWrapper}>
        <div className={styles.hero}>
          <div className={styles.overlay}></div>
          
          <div className={styles.heroContent}>
            <p className={styles.heroSubTitle}>DISCOVER THE WORLD</p>
            <h1 className={styles.heroTitle}>
              IT'S TIME FOR <br />
              <span>ADVENTURES & EXPERIENCES</span>
            </h1>
          </div>

          {/* SEARCH BOX */}
          <div className={styles.searchBox}>
            <div className={styles.searchTabs}>
              <span className={`${styles.tabItem} ${styles.activeTab}`}>Khách sạn</span>
              <span className={styles.tabItem}>Chuyến bay</span>
              <span className={styles.tabItem}>Đặt phòng</span>
            </div>

            <div className={styles.searchRow}>
              <div className={styles.searchField}>
                <label>Địa điểm</label>
                <input type="text" placeholder="Bạn muốn đi đâu?" defaultValue="45 Nguyễn Trãi, Hà Nội" />
              </div>
              <div className={styles.searchDivider}></div>
              <div className={styles.searchField}>
                <label>Nhận phòng</label>
                <input type="text" defaultValue="06 Aug, 2024" />
              </div>
              <div className={styles.searchDivider}></div>
              <div className={styles.searchField}>
                <label>Trả phòng</label>
                <input type="text" defaultValue="07 Aug, 2024" />
              </div>
              <button className={styles.searchBtn}>
                <span>SEARCH</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* HOTEL SECTION */}
      <section className={styles.hotelSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Khám phá điểm đến</h2>
          <div className={styles.filterTabs}>
            <span className={styles.filterActive}>HOTELS</span>
            <span>ISLANDS</span>
            <span>CASTLES</span>
            <span>TINY HOUSES</span>
            <span>TREEHOUSES</span>
          </div>
        </div>

        <div className={styles.hotelGrid}>
          {[
            { title: "CONTINENTAL HANOI", price: "$1,900", image: "/images/room1.jpg" },
            { title: "CONTINENTAL TUYEN QUANG", price: "$1,500", image: "/images/room2.jpg" },
            { title: "CONTINENTAL TP.HCM", price: "$2,100", image: "/images/room3.jpg" },
            { title: "CONTINENTAL HANOI LUX", price: "$1,800", image: "/images/room4.jpg" },
            { title: "CONTINENTAL HANOI LUX", price: "$1,800", image: "/images/room4.jpg" },
            { title: "CONTINENTAL HANOI", price: "$1,900", image: "/images/room1.jpg" },
          ].map((hotel, index) => (
            <div key={index} className={styles.card}>
              <div
                className={styles.cardImage}
                style={{ backgroundImage: `url(${hotel.image})` }}
              >
                <div className={styles.priceBadge}>{hotel.price}</div>
              </div>
              <div className={styles.cardInfo}>
                <div className={styles.cardText}>
                  <h3>{hotel.title}</h3>
                  <p>Luxury Stay & Spa</p>
                </div>
                <div className={styles.cardArrow}>→</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}