package com.saraai.assistant;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import androidx.core.app.ActivityCompat;
import java.util.ArrayList;
import java.util.List;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Professional Permission Check for Android 14+
        checkAndRequestMissingPermissions();
        
        // Handle starting from intent
        handleIntent(getIntent());
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        handleIntent(intent);
    }

    private void handleIntent(Intent intent) {
        if (intent == null) return;
        String action = intent.getAction();
        
        if ("com.epic.assistant.ACTION_TAP".equals(action)) {
            float x = intent.getFloatExtra("x", -1);
            float y = intent.getFloatExtra("y", -1);
            if (x != -1 && y != -1) {
                Intent broadcast = new Intent(EpicAccessibilityService.ACTION_CLICK);
                broadcast.putExtra("x", x);
                broadcast.putExtra("y", y);
                broadcast.setPackage(getPackageName());
                sendBroadcast(broadcast);
            }
        } else if ("com.epic.assistant.ACTION_SWIPE".equals(action)) {
            float x1 = intent.getFloatExtra("x1", -1);
            float y1 = intent.getFloatExtra("y1", -1);
            float x2 = intent.getFloatExtra("x2", -1);
            float y2 = intent.getFloatExtra("y2", -1);
            int duration = intent.getIntExtra("duration", 300);
            
            Intent broadcast = new Intent(EpicAccessibilityService.ACTION_SWIPE);
            broadcast.putExtra("x1", x1);
            broadcast.putExtra("y1", y1);
            broadcast.putExtra("x2", x2);
            broadcast.putExtra("y2", y2);
            broadcast.putExtra("duration", duration);
            broadcast.setPackage(getPackageName());
            sendBroadcast(broadcast);
        }
    }

    private void checkAndRequestMissingPermissions() {
        String[] permissions = {
            Manifest.permission.CAMERA,
            Manifest.permission.RECORD_AUDIO,
            Manifest.permission.ACCESS_FINE_LOCATION,
            Manifest.permission.READ_CONTACTS,
            Manifest.permission.READ_PHONE_STATE,
            Manifest.permission.READ_CALENDAR,
            Manifest.permission.READ_CALL_LOG
        };

        List<String> listPermissionsNeeded = new ArrayList<>();
        for (String p : permissions) {
            if (ActivityCompat.checkSelfPermission(this, p) != PackageManager.PERMISSION_GRANTED) {
                listPermissionsNeeded.add(p);
            }
        }

        if (!listPermissionsNeeded.isEmpty()) {
            ActivityCompat.requestPermissions(this, listPermissionsNeeded.toArray(new String[0]), 100);
        }
    }
}
