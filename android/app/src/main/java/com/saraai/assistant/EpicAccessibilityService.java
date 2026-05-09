package com.saraai.assistant;

import android.accessibilityservice.AccessibilityService;
import android.accessibilityservice.GestureDescription;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.graphics.Path;
import android.view.accessibility.AccessibilityEvent;
import android.util.Log;

public class EpicAccessibilityService extends AccessibilityService {
    private static final String TAG = "EpicAccessibility";
    public static final String ACTION_CLICK = "com.epic.assistant.ACTION_CLICK";
    public static final String ACTION_SWIPE = "com.epic.assistant.ACTION_SWIPE";

    private final BroadcastReceiver receiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            String action = intent.getAction();
            if (ACTION_CLICK.equals(action)) {
                float nx = intent.getFloatExtra("x", 0);
                float ny = intent.getFloatExtra("y", 0);
                performNormalizedClick(nx, ny);
            } else if (ACTION_SWIPE.equals(action)) {
                float x1 = intent.getFloatExtra("x1", 0);
                float y1 = intent.getFloatExtra("y1", 0);
                float x2 = intent.getFloatExtra("x2", 0);
                float y2 = intent.getFloatExtra("y2", 0);
                int duration = intent.getIntExtra("duration", 300);
                performNormalizedSwipe(x1, y1, x2, y2, duration);
            }
        }
    };

    private void performNormalizedClick(float nx, float ny) {
        android.util.DisplayMetrics metrics = getResources().getDisplayMetrics();
        float x = (nx / 1000f) * metrics.widthPixels;
        float y = (ny / 1000f) * metrics.heightPixels;
        performClick(x, y);
    }

    private void performNormalizedSwipe(float x1, float y1, float x2, float y2, int duration) {
        android.util.DisplayMetrics metrics = getResources().getDisplayMetrics();
        float sx = (x1 / 1000f) * metrics.widthPixels;
        float sy = (y1 / 1000f) * metrics.heightPixels;
        float ex = (x2 / 1000f) * metrics.widthPixels;
        float ey = (y2 / 1000f) * metrics.heightPixels;

        Path swipePath = new Path();
        swipePath.moveTo(sx, sy);
        swipePath.lineTo(ex, ey);

        GestureDescription.StrokeDescription stroke = new GestureDescription.StrokeDescription(swipePath, 0, duration);
        GestureDescription.Builder builder = new GestureDescription.Builder();
        builder.addStroke(stroke);
        dispatchGesture(builder.build(), null, null);
    }

    @Override
    public void onAccessibilityEvent(AccessibilityEvent event) {
        // Logging for visibility during automation
        if (event.getEventType() == AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED) {
            Log.d(TAG, "Window changed: " + event.getPackageName());
        }
    }

    @Override
    public void onInterrupt() {
        Log.d(TAG, "onInterrupt");
    }

    @Override
    protected void onServiceConnected() {
        super.onServiceConnected();
        Log.d(TAG, "Accessibility Service Connected");
        IntentFilter filter = new IntentFilter(ACTION_CLICK);
        registerReceiver(receiver, filter, Context.RECEIVER_EXPORTED);
    }

    @Override
    public boolean onUnbind(Intent intent) {
        try {
            unregisterReceiver(receiver);
        } catch (Exception e) {
            // Ignored
        }
        return super.onUnbind(intent);
    }

    private void performClick(float x, float y) {
        Path clickPath = new Path();
        clickPath.moveTo(x, y);
        GestureDescription.StrokeDescription clickStroke = new GestureDescription.StrokeDescription(clickPath, 0, 100);
        GestureDescription.Builder clickBuilder = new GestureDescription.Builder();
        clickBuilder.addStroke(clickStroke);
        dispatchGesture(clickBuilder.build(), null, null);
    }
}
