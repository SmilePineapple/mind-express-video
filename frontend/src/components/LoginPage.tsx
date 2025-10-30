import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { validateLicenseId, validateNickname, formatLicenseId } from '../utils/validation';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [licenseId, setLicenseId] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate license ID
    const formattedLicenseId = formatLicenseId(licenseId);
    const licenseValidation = validateLicenseId(formattedLicenseId);
    
    if (!licenseValidation.isValid) {
      setError(licenseValidation.error || 'Invalid license ID');
      return;
    }

    // Validate nickname (optional)
    const nicknameValidation = validateNickname(nickname);
    if (!nicknameValidation.isValid) {
      setError(nicknameValidation.error || 'Invalid nickname');
      return;
    }

    // Navigate to call room
    navigate(`/room/${formattedLicenseId}`, {
      state: { nickname: nickname.trim() || 'Anonymous' }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-block mb-4"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
              Mind Express Video
            </h1>
            <p className="text-lg md:text-xl text-gray-600">
              Simple, accessible video calling
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* License ID Input */}
            <div>
              <label
                htmlFor="licenseId"
                className="block text-xl font-semibold text-gray-900 mb-3"
              >
                Mind Express License ID
              </label>
              <input
                type="text"
                id="licenseId"
                value={licenseId}
                onChange={(e) => setLicenseId(e.target.value)}
                placeholder="ME12345"
                className="w-full h-20 px-6 text-2xl font-medium border-4 border-gray-300 rounded-2xl focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all"
                autoFocus
                aria-required="true"
                aria-describedby="license-help"
              />
              <p id="license-help" className="mt-3 text-base text-gray-600">
                Format: ME followed by 5 digits (e.g., ME12345)
              </p>
            </div>

            {/* Nickname Input (Optional) */}
            <div>
              <label
                htmlFor="nickname"
                className="block text-xl font-semibold text-gray-900 mb-3"
              >
                Your Name (Optional)
              </label>
              <input
                type="text"
                id="nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="e.g., Teacher, Student, Therapist"
                maxLength={20}
                className="w-full h-20 px-6 text-2xl font-medium border-4 border-gray-300 rounded-2xl focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all"
                aria-describedby="nickname-help"
              />
              <p id="nickname-help" className="mt-3 text-base text-gray-600">
                Maximum 20 characters
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 border-2 border-red-300 rounded-xl"
                role="alert"
              >
                <p className="text-lg font-semibold text-red-800">{error}</p>
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full h-32 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-3xl font-bold rounded-2xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all"
              aria-label="Join video call"
            >
              Join Call
            </motion.button>
          </form>

          {/* Info Section */}
          <div className="mt-8 p-6 bg-blue-50 rounded-2xl">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              How it works:
            </h2>
            <ol className="space-y-2 text-base text-gray-700">
              <li className="flex items-start">
                <span className="font-bold mr-2">1.</span>
                <span>Enter your Mind Express License ID</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">2.</span>
                <span>Share your license ID with the person you want to call</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">3.</span>
                <span>When they join with the same ID, the call starts automatically</span>
              </li>
            </ol>
          </div>
        </div>

        {/* Accessibility Notice */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Designed for accessibility • Keyboard and switch control friendly
          </p>
        </div>
      </motion.div>
    </div>
  );
};
