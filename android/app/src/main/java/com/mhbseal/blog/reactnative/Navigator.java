package com.mhbseal.blog.reactnative;

import android.app.Activity;
import android.content.Intent;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.JSApplicationIllegalArgumentException;

/**
 * Created by muhaibao on 17/2/7.
 */

public class Navigator extends ReactContextBaseJavaModule {
    public Navigator(ReactApplicationContext reactContext) {
        super(reactContext);
    }
    @Override
    public String getName() {
        return "Navigator";
    }
    @ReactMethod
    public void push(ReadableMap aty){
        try {
            Activity currentActivity = getCurrentActivity();
            Class toActivity = Class.forName(aty.getString("component"));
            Intent intent = new Intent(currentActivity, toActivity);

            intent.putExtra("params", aty.getString("params"));
            currentActivity.startActivity(intent);
        }catch(Exception e){
            throw new JSApplicationIllegalArgumentException(e.getMessage());
        }
    }
    @ReactMethod
    public void pop() {
        Activity currentActivity = getCurrentActivity();
        currentActivity.finish();
    }
}
