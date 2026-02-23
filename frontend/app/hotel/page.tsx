"use client";

import styles from "./hotel.module.css";

export default function HotelPage() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        
        {/* HEADER SECTION */}
        <header className={styles.header}>
          
          <h1 className={styles.title}>Khách Sạn Continental</h1>
          <div className={styles.stars}>★★★★★</div>
          <p className={styles.location}>
            <span></span> 120 Yên Lãng, Trung tâm Thành phố Hà Nội
          </p>
        </header>

        {/* CONTENT SECTION */}
        <section className={styles.mainContent}>
          <div className={styles.textBlock}>
            <p className={styles.leadText}>
              Khách sạn Continental, tọa lạc tại trung tâm thành phố, là một trong những điểm dừng chân lý tưởng cho du khách trong và ngoài nước. 
            </p>
            <div className={styles.description}>
              <p>
                Với kiến trúc hiện đại kết hợp với nét đẹp cổ điển, khách sạn mang đến không gian sang trọng, thoải mái và đẳng cấp cho tất cả khách hàng. Chỉ vài bước chân, du khách có thể dễ dàng khám phá những điểm đến nổi tiếng, các trung tâm mua sắm, nhà hàng và khu vui chơi giải trí hàng đầu của thành phố.
              </p>
              <p>
                Continental không chỉ nổi bật với vị trí thuận lợi mà còn với hệ thống phòng nghỉ được trang bị tiện nghi hiện đại, đa dạng về loại hình từ phòng tiêu chuẩn đến phòng hạng sang. Mỗi phòng nghỉ đều được thiết kế tỉ mỉ, chú trọng đến từng chi tiết nhỏ để mang lại cảm giác thoải mái nhất.
              </p>
              <p>
                Bên cạnh đó, khách sạn còn cung cấp nhiều dịch vụ cao cấp như nhà hàng với thực đơn phong phú, quầy bar, hồ bơi, spa và phòng tập gym. Với phương châm "Sự hài lòng của khách hàng là ưu tiên hàng đầu", chúng tôi cam kết mang đến những trải nghiệm tuyệt vời và dịch vụ chất lượng cao.
              </p>
            </div>
          </div>

          {/* IMAGE GRID - Modern Layout */}
          <div className={styles.imageGrid}>
            <div className={styles.imageMainWrapper}>
              <img
                src="/images/ks2.jpg"
                alt="Continental Suite"
                className={styles.image}
              />
              
            </div>
            
            <div className={styles.imageSubWrapper}>
              <img
                src="/images/ks1.jpg"
                alt="Hotel Lobby"
                className={styles.image}
              />
              
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}