package jv.stellariumcaller.stellariumcaller

import android.graphics.Color
import android.media.AudioManager
import android.os.Bundle
import android.view.MotionEvent
import android.view.View
import android.widget.ImageButton
import android.widget.TextView
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat

class ActiveCallActivity : AppCompatActivity() {

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

        volumeControlStream = AudioManager.STREAM_VOICE_CALL

        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.active_call_root)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        val btnPtt = findViewById<ImageButton>(R.id.btn_ptt)
        val tvPttLabel = findViewById<TextView>(R.id.tv_ptt_label)

        btnPtt.setOnTouchListener { _, event ->
            when (event.action) {
                MotionEvent.ACTION_DOWN -> {
                    btnPtt.setBackgroundColor(Color.parseColor("#059669"))
                    btnPtt.setImageResource(R.drawable.ic_mic)
                    tvPttLabel.text = "RECORDING"
                    tvPttLabel.setTextColor(Color.parseColor("#10B981"))
                    CallService.startRecordingPTT()
                    true
                }
                MotionEvent.ACTION_UP, MotionEvent.ACTION_CANCEL -> {
                    btnPtt.setBackgroundColor(Color.parseColor("#1a4a3a"))
                    tvPttLabel.text = "Hold to Talk"
                    tvPttLabel.setTextColor(Color.parseColor("#34D399"))
                    CallService.stopRecordingPTT()
                    true
                }
                else -> false
            }
        }

        findViewById<ImageButton>(R.id.btn_end_call).setOnClickListener {
            CallService.sendEndCall()
            finish()
        }
    }

    override fun onDestroy() {
        if (CallService.isCallActive()) {
            CallService.sendEndCall()
        }
        super.onDestroy()
    }
}
