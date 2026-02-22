import styles from "../app/page.module.css";

export default function GuestHome() {
  return (
    <main className={styles.container}>

      {/* HERO */}
      <section className={styles.heroWrapper}>
        <div className={styles.hero}>
          <div className={styles.overlay}></div>

          <h1 className={styles.heroTitle}>
            ITS FOR TIME FOR ADVENTURES
            <br />
            & EXPERIENCES
          </h1>

          {/* SEARCH BOX */}
          <div className={styles.searchBox}>

            {/* Tabs */}
            <div className={styles.searchTabs}>
              <span className={styles.activeTab}>Khách sạn</span>
              <span>Chuyến bay</span>
              <span>Đặt phòng</span>
            </div>

            {/* Divider */}
            <div className={styles.searchDivider}></div>

            {/* Row */}
            <div className={styles.searchRow}>

              <div className={styles.searchField}>
                <label>Địa chỉ</label>
                <input type="text" defaultValue="45 ĐƯỜNG NGUYỄN TRÃI" />
              </div>

              <div className={styles.searchField}>
                <label>Check in</label>
                <input type="text" defaultValue="06 AUGUST, 2024" />
              </div>

              <div className={styles.searchField}>
                <label>Check out</label>
                <input type="text" defaultValue="07 AUGUST, 2024" />
              </div>

              <button className={styles.searchBtn}>
                SEARCH
              </button>

            </div>
          </div>
        </div>
      </section>

      {/* HOTEL SECTION */}
      <section className={styles.hotelSection}>
        <h2 className={styles.sectionTitle}>KHÁCH SẠN</h2>

        <div className={styles.tabs}>
          <span className={styles.activeTab}>HOTELS</span>
          <span>ISLANDS</span>
          <span>CASTLES</span>
          <span>TINY HOUSES</span>
          <span>AMAZING POOLS</span>
          <span>TREEHOUSES</span>
          <span>TROPICAL</span>
        </div>

        <div className={styles.hotelGrid}>
          {[
            {
              title: "CONTINENTAL HOTEL HÀ NỘI",
              price: "$1900",
              image: "/images/room1.jpg",
            },
            {
              title: "CONTINENTAL HOTEL TUYÊN QUANG",
              price: "$1500",
              image: "/images/room2.jpg",
            },
            {
              title: "CONTINENTAL HOTEL TP.HCM",
              price: "$2100",
              image: "/images/room3.jpg",
            },
            {
              title: "CONTINENTAL HOTEL HÀ NỘI",
              price: "$1800",
              image: "/images/room4.jpg",
            },
          ].map((hotel, index) => (
            <div key={index} className={styles.card}>

              <div
                className={styles.cardImage}
                style={{ backgroundImage: `url(${hotel.image})` }}
              ></div>

              <div className={styles.cardOverlay}>
                <div className={styles.cardContent}>
                  <div>
                    <p className={styles.cardTitle}>
                      {hotel.title}
                    </p>
                    <p className={styles.cardPrice}>
                      {hotel.price}
                    </p>
                  </div>

                  <div className={styles.cardArrow}>→</div>
                </div>
              </div>

            </div>
          ))}
        </div>

      </section>

    </main>
  );
}