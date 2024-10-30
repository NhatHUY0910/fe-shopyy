import React, { useState } from 'react';
import { UserOutlined, LockOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';
import { message, Spin } from 'antd';

const ResetPasswordForm = () => {
    // Các trạng thái cho form
    const [step, setStep] = useState<'methods' | 'verify' | 'newPassword'>('methods');
    const [email, setEmail] = useState('');
    const [resetCode, setResetCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // Xử lý gửi mã xác thực qua email
    const handleSendEmail = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:8080/api/password-reset/request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                message.success('Mã xác thực đã được gửi đến email của bạn');
                setStep('verify');
            } else {
                message.error('Không thể gửi mã xác thực. Vui lòng thử lại');
            }
        } catch (error) {
            message.error('Đã có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    // Xử lý gửi mã OTP qua điện thoại (chỉ là giả lập)
    const handleSendSMS = () => {
        console.log('Tính năng gửi OTP qua SMS đang được phát triển');
        message.info('Tính năng này đang được phát triển');
    };

    // Xử lý xác thực mã reset
    const handleVerifyCode = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:8080/api/password-reset/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, resetCode }),
            });

            if (response.ok) {
                message.success('Mã xác thực chính xác');
                setStep('newPassword');
            } else {
                message.error('Mã xác thực không chính xác');
            }
        } catch (error) {
            message.error('Đã có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    // Xử lý đặt mật khẩu mới
    const handleResetPassword = async () => {
        if (newPassword !== confirmPassword) {
            message.error('Mật khẩu không khớp');
            return;
        }

        try {
            setLoading(true);
            const response = await fetch('http://localhost:8080/api/password-reset/reset', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    newPassword,
                    confirmPassword
                }),
            });

            if (response.ok) {
                message.success('Đặt lại mật khẩu thành công');
                setStep('methods');
                // Reset tất cả các trường
                setEmail('');
                setResetCode('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                message.error('Không thể đặt lại mật khẩu. Vui lòng thử lại');
            }
        } catch (error) {
            message.error('Đã có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
            <h2 className="text-2xl font-semibold mb-6 text-center">Quên Mật Khẩu</h2>

            {loading && (
                <div className="flex justify-center mb-4">
                    <Spin />
                </div>
            )}

            {step === 'methods' && (
                <div className="space-y-4">
                    <div className="text-center mb-6">
                        <p className="text-gray-600">Vui lòng chọn phương thức lấy lại mật khẩu</p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center space-x-4 mb-4">
                            <input
                                type="email"
                                placeholder="Nhập email của bạn"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="flex-1 p-2 border rounded"
                            />
                        </div>

                        <button
                            onClick={handleSendEmail}
                            className="w-full p-2 bg-orange-500 text-white rounded hover:bg-orange-600 flex items-center justify-center"
                            disabled={loading}
                        >
                            <MailOutlined className="mr-2" />
                            Gửi mã xác thực qua Email
                        </button>

                        <button
                            onClick={handleSendSMS}
                            className="w-full p-2 bg-gray-500 text-white rounded hover:bg-gray-600 flex items-center justify-center"
                        >
                            <PhoneOutlined className="mr-2" />
                            Gửi mã OTP qua số điện thoại
                        </button>
                    </div>
                </div>
            )}

            {step === 'verify' && (
                <div className="space-y-4">
                    <div className="text-center mb-6">
                        <p className="text-gray-600">
                            Mã xác thực đã được gửi đến email của bạn.
                            Vui lòng kiểm tra và nhập mã xác thực.
                        </p>
                    </div>

                    <input
                        type="text"
                        placeholder="Nhập mã xác thực"
                        value={resetCode}
                        onChange={(e) => setResetCode(e.target.value)}
                        className="w-full p-2 border rounded"
                    />

                    <button
                        onClick={handleVerifyCode}
                        className="w-full p-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                        disabled={loading}
                    >
                        Xác nhận
                    </button>
                </div>
            )}

            {step === 'newPassword' && (
                <div className="space-y-4">
                    <div className="text-center mb-6">
                        <p className="text-gray-600">Nhập mật khẩu mới của bạn</p>
                    </div>

                    <input
                        type="password"
                        placeholder="Mật khẩu mới"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full p-2 border rounded"
                    />

                    <input
                        type="password"
                        placeholder="Nhập lại mật khẩu mới"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full p-2 border rounded"
                    />

                    <button
                        onClick={handleResetPassword}
                        className="w-full p-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                        disabled={loading}
                    >
                        Đặt lại mật khẩu
                    </button>
                </div>
            )}
        </div>
    );
};

export default ResetPasswordForm;