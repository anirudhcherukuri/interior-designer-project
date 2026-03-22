import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { visitorAPI } from '../api/config';

const getBrowserName = (userAgent) => {
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) return 'Chrome';
    if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
    if (userAgent.includes('Edg')) return 'Edge';
    if (userAgent.includes('Opera') || userAgent.includes('OPR')) return 'Opera';
    return 'Other';
};

const getTrafficSource = (referrer) => {
    if (!referrer) return 'Direct';

    const url = referrer.toLowerCase();
    if (url.includes('google')) return 'Google';
    if (url.includes('facebook')) return 'Facebook';
    if (url.includes('instagram')) return 'Instagram';
    if (url.includes('twitter') || url.includes('t.co')) return 'Twitter';
    if (url.includes('linkedin')) return 'LinkedIn';
    if (url.includes('youtube')) return 'YouTube';
    if (url.includes('bing')) return 'Bing';

    try {
        const domain = new URL(referrer).hostname;
        return domain;
    } catch {
        return 'Other';
    }
};

const getDeviceType = (userAgent) => {
    const ua = userAgent.toLowerCase();
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        return "Tablet";
    }
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)os|Opera M(obi|ini)/.test(ua)) {
        return "Mobile";
    }
    return "Desktop";
};

const useVisitorTracking = () => {
    const location = useLocation();

    useEffect(() => {
        const trackActivity = async () => {
            try {
                const userAgent = navigator.userAgent;
                const data = {
                    page: location.pathname,
                    userAgent: userAgent,
                    referrer: document.referrer,
                    browser: getBrowserName(userAgent),
                    platform: navigator.platform,
                    language: navigator.language,
                    screenResolution: `${window.screen.width}x${window.screen.height}`,
                    source: getTrafficSource(document.referrer),
                    device: getDeviceType(userAgent), // Added device tracking
                };

                await visitorAPI.track(data);
            } catch (error) {
                console.error('Failed to track visitor activity:', error);
            }
        };

        trackActivity();
    }, [location]);
};

export default useVisitorTracking;
