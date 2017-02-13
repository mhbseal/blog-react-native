//package com.mhbseal.blog;
//
//import android.app.Activity;
//import android.content.Intent;
//import android.os.Bundle;
//import android.view.View;
//import android.widget.Button;
//
//import org.json.JSONObject;
//
//import com.mhbseal.blog.reactnative.ReactNativeActivity;
//
//public class MainActivity extends Activity {
//    private Button button;
//
//    @Override
//    public void onCreate(Bundle savedInstanceState) {
//        super.onCreate(savedInstanceState);
//        setContentView(R.layout.activity_main);
//        setTitle("MainActivity");
//        button = (Button) findViewById(R.id.btn);
//        String btnText = "按钮";
//        String paramsStr = getIntent().getStringExtra("params");
//        String keyword = "";
//
//        try{
//            JSONObject paramsObject = new JSONObject(paramsStr);
//            keyword = paramsObject.getString("keyword");
//        }catch(Exception e){
//
//        }
//
//        if (keyword.length() > 0) {
//            btnText = btnText + "--来自rn的参数：" + keyword;
//        }
//
//        button.setText(btnText);
//        button.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View v) {
//                btnPressed();
//            }
//        });
//    }
//
//    public void btnPressed() {
//        Intent intent = new Intent(this, ReactNativeActivity.class);
//        intent.putExtra("route", "{\"component\": \"Search\", \"params\":{\"mhbseal\": \"name\", \"job\": \"jser\"}}");
//
//        startActivity(intent);
//    }
//}


// rn命令行启动智能从MainActivity启动，所以这里把ReactNativeActivity的代码copy过来，如果测试native和rn跳转，注释上面代码打开，下面注释即可
// 新版的rn增加了非MainActivity启动的参数，待升级rn
package com.mhbseal.blog;

import android.support.annotation.Nullable;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import android.os.Bundle;

public class MainActivity extends ReactActivity {
    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "ReactNative";
    }

    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new ReactActivityDelegate(this, getMainComponentName()) {
            @Nullable
            @Override
            protected Bundle getLaunchOptions() {
                Bundle initialProps = new Bundle();
                initialProps.putString("route", getIntent().getStringExtra("route"));
                return initialProps;
            }
        };
    }
}