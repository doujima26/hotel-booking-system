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
    """
    Gui email xac nhan dat phong
    """

    html_content = f"""
    <h2>Xác nhận đặt phòng thành công</h2>
    <p>Xin chào {customer_name},</p>
    <ul>
        <li>Phòng: {room_number}</li>
        <li>Check-in: {check_in}</li>
        <li>Check-out: {check_out}</li>
        <li>Tổng tiền: {total_amount} VND</li>
    </ul>
    """

    message = MessageSchema(
        subject="Xác nhận đặt phòng",
        recipients=[to_email],
        body=html_content,
        subtype="html"
    )

    fm = FastMail(conf)
    await fm.send_message(message)
