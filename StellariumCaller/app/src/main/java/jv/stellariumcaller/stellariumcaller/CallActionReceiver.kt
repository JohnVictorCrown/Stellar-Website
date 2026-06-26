package jv.stellariumcaller.stellariumcaller

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

class CallActionReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        when (intent.action) {
            "ANSWER_CALL" -> {
                CallService.sendAnswer()
                val activityIntent = Intent(context, ActiveCallActivity::class.java).apply {
                    flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
                }
                context.startActivity(activityIntent)
            }
            "DECLINE_CALL" -> {
                CallService.sendEndCall()
            }
        }
    }
}
