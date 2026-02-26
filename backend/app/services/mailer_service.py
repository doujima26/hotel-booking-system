from fastapi_mail import FastMail, MessageSchema
from app.core.mail_config import conf
from datetime import date

async def send_booking_confirmation_email(
    to_email: str,
    customer_name: str,
    room_number: str,
    check_in: date,
    check_out: date,
    total_amount: float
):
    
    formatted_amount = "{:,.0f}".format(total_amount).replace(",", ".")
    formatted_check_in = check_in.strftime("%d/%m/%Y")
    formatted_check_out = check_out.strftime("%d/%m/%Y")

    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body {{ font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }}
            .container {{ max-width: 600px; margin: 20px auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }}
            .header {{ background-color: #1a1a1a; color: #ffffff; padding: 30px; text-align: center; }}
            .header h1 {{ margin: 0; font-size: 24px; letter-spacing: 2px; text-transform: uppercase; }}
            .header span {{ color: #6ec1e4; }}
            .content {{ padding: 30px; background-color: #ffffff; }}
            .content h2 {{ color: #1a1a1a; font-size: 20px; margin-top: 0; }}
            .info-table {{ width: 100%; border-collapse: collapse; margin-top: 20px; border-radius: 8px; overflow: hidden; }}
            .info-table td {{ padding: 15px; border-bottom: 1px solid #f8fafc; }}
            .label {{ font-weight: bold; color: #64748b; font-size: 13px; text-transform: uppercase; width: 40%; }}
            .value {{ color: #1e293b; font-weight: 600; text-align: right; }}
            .total-row {{ background-color: #f8fafc; }}
            .total-price {{ color: #1a1a1a; font-size: 20px; font-weight: 800; }}
            .footer {{ background-color: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; }}
            .btn {{ display: inline-block; padding: 12px 25px; background-color: #1a1a1a; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 20px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Continental<span>.com</span></h1>
            </div>
            <div class="content">
                <h2>Xác nhận đặt phòng thành công</h2>
                <p>Xin chào <strong>{customer_name}</strong>,</p>
                <p>Cảm ơn bạn đã lựa chọn Continental Hotel. Đơn đặt phòng của bạn đã được xác nhận thành công. Dưới đây là thông tin chi tiết:</p>
                
                <table class="info-table">
                    <tr>
                        <td class="label">Mã số phòng</td>
                        <td class="value">Phòng {room_number}</td>
                    </tr>
                    <tr>
                        <td class="label">Ngày nhận phòng</td>
                        <td class="value">{formatted_check_in}</td>
                    </tr>
                    <tr>
                        <td class="label">Ngày trả phòng</td>
                        <td class="value">{formatted_check_out}</td>
                    </tr>
                    <tr class="total-row">
                        <td class="label">Tổng cộng</td>
                        <td class="value total-price">{formatted_amount} VND</td>
                    </tr>
                </table>

                <div style="text-align: center;">
                    <a href="#" class="btn">Xem lịch sử đặt phòng</a>
                </div>
                
                <p style="margin-top: 30px; font-size: 14px; color: #64748b;">
                    * Lưu ý: Vui lòng mang theo CCCD/Hộ chiếu khi làm thủ tục nhận phòng.
                </p>
            </div>
            <div class="footer">
                <p>© 2026 Continental Hotel Group. All rights reserved.</p>
                <p>120 Yên Lãng, Hà Nội | Hotline: 0363-158-750</p>
            </div>
        </div>
    </body>
    </html>
    """

    message = MessageSchema(
        subject="[Continental Hotel] Xác nhận đặt phòng thành công",
        recipients=[to_email],
        body=html_content,
        subtype="html"
    )

    fm = FastMail(conf)
    await fm.send_message(message)