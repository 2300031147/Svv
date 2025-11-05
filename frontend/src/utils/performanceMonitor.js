// Capture browser performance metrics using Performance API
export const capturePerformanceMetrics = () => {
    if (!window.performance || !window.performance.getEntriesByType) {
        console.warn('Performance API not supported');
        return null;
    }

    const perfData = window.performance.getEntriesByType('navigation')[0];
    
    if (!perfData) {
        console.warn('Navigation timing not available');
        return null;
    }

    // Get Paint Timing
    const paintEntries = window.performance.getEntriesByType('paint');
    const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    
    // Get Layout Shift (if available)
    let cls = 0;
    if (window.PerformanceObserver && PerformanceObserver.supportedEntryTypes?.includes('layout-shift')) {
        // CLS needs to be observed over time, this is a simplified version
        const layoutShiftEntries = window.performance.getEntriesByType('layout-shift');
        cls = layoutShiftEntries.reduce((sum, entry) => {
            if (!entry.hadRecentInput) {
                return sum + entry.value;
            }
            return sum;
        }, 0);
    }

    return {
        page_load_time: perfData.loadEventEnd - perfData.fetchStart,
        dom_content_loaded: perfData.domContentLoadedEventEnd - perfData.fetchStart,
        time_to_first_byte: perfData.responseStart - perfData.requestStart,
        first_contentful_paint: fcp ? fcp.startTime : null,
        largest_contentful_paint: null, // LCP needs PerformanceObserver
        cumulative_layout_shift: cls,
        first_input_delay: null // FID needs PerformanceObserver
    };
};

// Start observing performance metrics
export const observePerformanceMetrics = (callback) => {
    if (!window.PerformanceObserver) {
        console.warn('PerformanceObserver not supported');
        return null;
    }

    const metrics = {
        fcp: null,
        lcp: null,
        fid: null,
        cls: 0
    };

    try {
        // Observe LCP
        if (PerformanceObserver.supportedEntryTypes?.includes('largest-contentful-paint')) {
            const lcpObserver = new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                const lastEntry = entries[entries.length - 1];
                metrics.lcp = lastEntry.renderTime || lastEntry.loadTime;
                callback(metrics);
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        }

        // Observe FID
        if (PerformanceObserver.supportedEntryTypes?.includes('first-input')) {
            const fidObserver = new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                entries.forEach((entry) => {
                    if (!metrics.fid) {
                        metrics.fid = entry.processingStart - entry.startTime;
                        callback(metrics);
                    }
                });
            });
            fidObserver.observe({ entryTypes: ['first-input'] });
        }

        // Observe CLS
        if (PerformanceObserver.supportedEntryTypes?.includes('layout-shift')) {
            const clsObserver = new PerformanceObserver((entryList) => {
                for (const entry of entryList.getEntries()) {
                    if (!entry.hadRecentInput) {
                        metrics.cls += entry.value;
                        callback(metrics);
                    }
                }
            });
            clsObserver.observe({ entryTypes: ['layout-shift'] });
        }

        // Get FCP
        const paintObserver = new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                if (entry.name === 'first-contentful-paint') {
                    metrics.fcp = entry.startTime;
                    callback(metrics);
                }
            }
        });
        paintObserver.observe({ entryTypes: ['paint'] });

        return metrics;
    } catch (error) {
        console.error('Error observing performance metrics:', error);
        return null;
    }
};
