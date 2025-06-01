package com.foodify

import android.content.Intent
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import androidx.activity.enableEdgeToEdge;
import android.os.Bundle;
import android.os.Build;
// import io.branch.rnbranch.RNBranchModule
import io.branch.rnbranch.*

class MainActivity : ReactActivity() {

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState);
    // Enable edge-to-edge display for Android 15+
    if (Build.VERSION.SDK_INT >= 35) { // SDK 35 (UpsideDownCake)
      enableEdgeToEdge()
    }
  }


  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "foodify"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  override fun onStart() {
      super.onStart()
      RNBranchModule.initSession(getIntent().getData(), this)
  }
  override fun onNewIntent(intent: Intent) {
    super.onNewIntent(intent)
    setIntent(intent)
    RNBranchModule.reInitSession(this)
  }
}
