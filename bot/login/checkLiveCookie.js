const axios = require("axios");

/**
 * Validate Facebook session cookie
 * 
 * @param {string} cookie Cookie string in `c_user=123;xs=123;datr=123;` format
 * @param {string} [userAgent] Optional User-Agent string
 * @returns {Promise<Boolean>} True if cookie is valid, false if not
 */
module.exports = async function (cookie, userAgent) {
    if (!cookie) throw new Error("Cookie is required");

    try {
        const response = await axios.get('https://mbasic.facebook.com/settings', {
            headers: {
                Cookie: cookie,
                "User-Agent": userAgent || 'Mozilla/5.0 (Linux; Android 12; M2102J20SG) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.0.0 Mobile Safari/537.36',
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
                "Accept-Language": "vi,en-US;q=0.9,en;q=0.8",
                "Upgrade-Insecure-Requests": "1"
            },
            maxRedirects: 0, // Do not follow redirects; helps detect expired cookies
            validateStatus: (status) => status >= 200 && status < 400 // Accept 3xx responses
        });

        // Indicators that the cookie is valid
        const validIndicators = [
            '/privacy/xcs/action/logging/',
            '/notifications.php?',
            'href="/login/save-password-interstitial'
        ];

        return validIndicators.some(indicator => response.data.includes(indicator));
    } catch (e) {
        // If Facebook redirects to login, the cookie is invalid
        return false;
    }
};
