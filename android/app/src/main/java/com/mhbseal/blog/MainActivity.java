package com.mhbseal.blog;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;

import org.json.JSONObject;

import com.mhbseal.blog.reactnative.ReactNativeActivity;

public class MainActivity extends Activity {
    private Button button;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        setTitle("MainActivity");
        button = (Button) findViewById(R.id.btn);
        String btnText = "按钮";
        String paramsStr = getIntent().getStringExtra("params");
        String keyword = "";

        try{
            JSONObject paramsObject = new JSONObject(paramsStr);
            keyword = paramsObject.getString("keyword");
        }catch(Exception e){

        }

        if (keyword.length() > 0) {
            btnText = btnText + "--来自rn的参数：" + keyword;
        }

        button.setText(btnText);
        button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                btnPressed();
            }
        });
    }

    public void btnPressed() {
        Intent intent = new Intent(this, ReactNativeActivity.class);
        intent.putExtra("route", "{\"component\": \"Search\", \"params\":{\"mhbseal\": \"name\", \"job\": \"jser\"}}");

        startActivity(intent);
    }
}