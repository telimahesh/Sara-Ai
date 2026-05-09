package com.saraai.assistant;

import android.accessibilityservice.AccessibilityService;
import android.view.accessibility.AccessibilityEvent;
import android.util.Log;

public class EpicAccessibilityService extends AccessibilityService {
    private static final String TAG = "EpicAccessibility";

    @Override
    public void onAccessibilityEvent(AccessibilityEvent event) {
        // Here we could handle window configuration changes, notifications, etc.
        // For now, we just acknowledge the service is running.
        Log.d(TAG, "onAccessibilityEvent: " + event.getEventType());
    }

    @Override
    public void onInterrupt() {
        Log.d(TAG, "onInterrupt");
    }

    @Override
    protected void onServiceConnected() {
        super.onServiceConnected();
        Log.d(TAG, "Accessibility Service Connected");
    }
}
