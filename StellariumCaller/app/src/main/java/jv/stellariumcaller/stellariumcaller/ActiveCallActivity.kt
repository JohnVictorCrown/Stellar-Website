package jv.stellariumcaller.stellariumcaller

import android.os.Bundle
import android.widget.ImageButton
import android.widget.TextView
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat

class ActiveCallActivity : AppCompatActivity() {

    private var isMuted = false

    override fun onResume() {
        super.onResume()
        if (!CallService.isCallActive()) {
            finish()
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_active_call)

        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.active_call_root)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        findViewById<ImageButton>(R.id.btn_mute).setOnClickListener {
            isMuted = !isMuted
            CallService.setMuted(isMuted)
            updateMuteIcon()
        }

        findViewById<ImageButton>(R.id.btn_end_call).setOnClickListener {
            CallService.sendEndCall()
            finish()
        }
    }

    private fun updateMuteIcon() {
        val btn = findViewById<ImageButton>(R.id.btn_mute)
        val status = findViewById<TextView>(R.id.tv_call_status)
        if (isMuted) {
            btn.setImageResource(R.drawable.ic_mic_off)
            btn.setBackgroundResource(android.R.color.darker_gray)
            status.text = "Muted"
            status.setTextColor(android.graphics.Color.parseColor("#FF9800"))
        } else {
            btn.setImageResource(R.drawable.ic_mic)
            btn.setBackgroundColor(android.graphics.Color.parseColor("#333333"))
            status.text = "Connected"
            status.setTextColor(android.graphics.Color.parseColor("#4CAF50"))
        }
    }

    override fun onDestroy() {
        if (CallService.isCallActive()) {
            CallService.sendEndCall()
        }
        super.onDestroy()
    }
}
