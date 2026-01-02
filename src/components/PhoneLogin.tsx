import { useState } from 'react';
import { useSupabase } from '../context/SupabaseContext';
import { Phone, ArrowRight, Loader } from 'lucide-react';

interface PhoneLoginProps {
    isDark: boolean;
}

export const PhoneLogin = ({ isDark }: PhoneLoginProps) => {
    const { signInWithPhone, verifyOtp } = useSupabase();
    const [step, setStep] = useState<'phone' | 'otp'>('phone');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const { error } = await signInWithPhone(phone);
        setLoading(false);

        if (error) {
            setError(error.message);
        } else {
            setStep('otp');
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const { error } = await verifyOtp(phone, otp);
        setLoading(false);

        if (error) {
            setError(error.message);
        }
    };

    const inputBg = isDark ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200';
    const textColor = isDark ? 'text-white' : 'text-slate-900';
    const subTextColor = isDark ? 'text-white/50' : 'text-slate-500';

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-6 ${isDark ? 'bg-[#0f1014]' : 'bg-[#eef2f6]'}`}>
            <div className={`
                w-full max-w-sm p-8 rounded-3xl transition-all duration-500
                ${isDark ? 'glass-panel-dark' : 'glass-panel-light'}
                shadow-2xl
            `}>
                <div className="text-center mb-8">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-200 text-slate-700'}`}>
                        <Phone size={32} />
                    </div>
                    <h2 className={`text-2xl font-bold mb-2 ${textColor}`}>Welcome Back</h2>
                    <p className={`text-sm ${subTextColor}`}>
                        {step === 'phone' ? 'Sign in with your phone number' : `Enter the code sent to ${phone}`}
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
                        {error}
                    </div>
                )}

                {step === 'phone' ? (
                    <form onSubmit={handleSendOtp} className="space-y-4">
                        <div>
                            <input
                                type="tel"
                                placeholder="+1 555 000 0000"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className={`w-full px-4 py-3 rounded-xl outline-none transition-all ${inputBg} ${textColor} focus:ring-2 focus:ring-indigo-500/50`}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`
                                w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all
                                ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98]'}
                                ${isDark ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-white'}
                            `}
                        >
                            {loading ? <Loader className="animate-spin" size={20} /> : <>Continue <ArrowRight size={20} /></>}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                        <div>
                            <input
                                type="text"
                                placeholder="000000"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                maxLength={6}
                                className={`w-full px-4 py-3 rounded-xl outline-none text-center text-2xl tracking-widest transition-all ${inputBg} ${textColor} focus:ring-2 focus:ring-indigo-500/50`}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`
                                w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all
                                ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98]'}
                                ${isDark ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-white'}
                            `}
                        >
                            {loading ? <Loader className="animate-spin" size={20} /> : 'Verify & Sign In'}
                        </button>
                        <button
                            type="button"
                            onClick={() => { setStep('phone'); setError(''); }}
                            className={`w-full py-2 text-sm ${subTextColor} hover:underline`}
                        >
                            Change Phone Number
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};
