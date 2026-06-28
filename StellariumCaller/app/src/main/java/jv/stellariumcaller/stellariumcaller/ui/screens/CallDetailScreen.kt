package jv.stellariumcaller.stellariumcaller.ui.screens

import android.content.ContentValues
import android.media.AudioAttributes
import android.media.MediaPlayer
import android.os.Build
import android.os.Environment
import android.provider.MediaStore
import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Download
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import jv.stellariumcaller.stellariumcaller.CallAudioMessage
import jv.stellariumcaller.stellariumcaller.CallLogRepository
import jv.stellariumcaller.stellariumcaller.ui.theme.*
import java.io.File
import java.text.SimpleDateFormat
import java.util.*

@Composable
fun CallDetailScreen(
    callId: Long,
    repo: CallLogRepository,
    onBack: () -> Unit
) {
    val log = remember(callId) { repo.getCallLog(callId) }
    var playingIndex by remember { mutableIntStateOf(-1) }
    var player by remember { mutableStateOf<MediaPlayer?>(null) }

    DisposableEffect(Unit) {
        onDispose {
            player?.release()
        }
    }

    fun playAudio(msg: CallAudioMessage, index: Int) {
        player?.release()
        try {
            MediaPlayer().apply {
                setDataSource(msg.filePath)
                setAudioAttributes(
                    AudioAttributes.Builder()
                        .setUsage(AudioAttributes.USAGE_MEDIA)
                        .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
                        .build()
                )
                setOnCompletionListener {
                    playingIndex = -1
                    release()
                    player = null
                }
                setOnErrorListener { _, _, _ ->
                    playingIndex = -1
                    false
                }
                prepare()
                start()
                player = this
                playingIndex = index
            }
        } catch (_: Exception) { }
    }

    Column(modifier = Modifier.fillMaxSize().background(BackgroundGradient)) {
        // Header
        Box(
            modifier = Modifier.fillMaxWidth().background(DarkSurface).padding(12.dp)
        ) {
            if (log != null) {
                val dateFormat = remember { SimpleDateFormat("MMM dd, hh:mm a", Locale.getDefault()) }
                val status = when (log.status) {
                    "answered" -> "Answered"
                    "missed" -> "Missed"
                    else -> log.status
                }
                Text(
                    "Call $status - ${dateFormat.format(Date(log.timestamp))}",
                    color = White,
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold
                )
            } else {
                Text("Call not found", color = White, fontSize = 16.sp)
            }
        }

        if (log == null || log.audioMessages.isEmpty()) {
            Box(
                modifier = Modifier.fillMaxSize(),
                contentAlignment = Alignment.Center
            ) {
                Text("No audio messages in this call", color = GrayDark, fontSize = 14.sp)
            }
        } else {
            LazyColumn(
                modifier = Modifier.fillMaxSize().padding(12.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(log.audioMessages.withIndex().toList()) { (index, msg) ->
                    AudioMessageBubble(
                        msg = msg,
                        isPlaying = index == playingIndex,
                        onPlay = { playAudio(msg, index) },
                        onDelete = { repo.deleteAudioMessage(msg.id) },
                        callerDisplayId = callId
                    )
                }
            }
        }
    }
}

@Composable
private fun AudioMessageBubble(
    msg: CallAudioMessage,
    isPlaying: Boolean,
    onPlay: () -> Unit,
    onDelete: () -> Unit,
    callerDisplayId: Long
) {
    val context = LocalContext.current
    val timeFormat = remember { SimpleDateFormat("hh:mm a", Locale.getDefault()) }
    val isSent = msg.direction == "sent"
    val bubbleColor = if (isSent) AccentPurpleDark else AccentBlueDark
    var showDeleteDialog by remember { mutableStateOf(false) }

    if (showDeleteDialog) {
        AlertDialog(
            onDismissRequest = { showDeleteDialog = false },
            title = { Text("Delete Message?", color = White) },
            text = { Text("This will permanently delete this audio message and its file.", color = GrayLight) },
            confirmButton = {
                TextButton(onClick = {
                    onDelete()
                    showDeleteDialog = false
                }) { Text("Delete", color = Red) }
            },
            dismissButton = {
                TextButton(onClick = { showDeleteDialog = false }) { Text("Cancel", color = AccentBlue) }
            },
            containerColor = DarkSurface
        )
    }

    Column(
        modifier = Modifier.fillMaxWidth(),
        horizontalAlignment = if (isSent) Alignment.End else Alignment.Start
    ) {
        Row(
            modifier = Modifier
                .widthIn(max = 320.dp)
                .clip(RoundedCornerShape(12.dp))
                .background(bubbleColor)
                .padding(horizontal = 8.dp, vertical = 6.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Button(
                onClick = onPlay,
                modifier = Modifier.size(36.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Color.Transparent),
                contentPadding = PaddingValues(0.dp)
            ) {
                Icon(
                    Icons.Default.PlayArrow,
                    contentDescription = if (isPlaying) "Playing" else "Play",
                    tint = White
                )
            }
            Spacer(Modifier.width(4.dp))
            IconButton(
                onClick = {
                    saveAudioToDevice(context, msg.filePath, msg.id)
                },
                modifier = Modifier.size(32.dp)
            ) {
                Icon(
                    Icons.Default.Download,
                    contentDescription = "Save",
                    tint = GrayLight,
                    modifier = Modifier.size(18.dp)
                )
            }
            Spacer(Modifier.width(4.dp))
            IconButton(
                onClick = { showDeleteDialog = true },
                modifier = Modifier.size(32.dp)
            ) {
                Icon(
                    Icons.Default.Delete,
                    contentDescription = "Delete",
                    tint = GrayLight,
                    modifier = Modifier.size(18.dp)
                )
            }
            Spacer(Modifier.width(8.dp))
            Text(
                if (isPlaying) "Playing..." else "Tap to play",
                color = White,
                fontSize = 13.sp
            )
            Spacer(Modifier.width(8.dp))
            Text(
                timeFormat.format(Date(msg.timestamp)),
                color = GrayMedium,
                fontSize = 11.sp
            )
        }
    }
}

private fun saveAudioToDevice(context: android.content.Context, filePath: String, msgId: Long) {
    try {
        val file = File(filePath)
        if (!file.exists()) {
            Toast.makeText(context, "Audio file not found", Toast.LENGTH_SHORT).show()
            return
        }
        val fileName = "stellarium_audio_${msgId}_${System.currentTimeMillis()}.opus"
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            val contentValues = ContentValues().apply {
                put(MediaStore.Audio.Media.DISPLAY_NAME, fileName)
                put(MediaStore.Audio.Media.MIME_TYPE, "audio/opus")
                put(MediaStore.Audio.Media.RELATIVE_PATH, "Music/StellariumCaller")
                put(MediaStore.Audio.Media.IS_PENDING, 1)
            }
            val uri = context.contentResolver.insert(MediaStore.Audio.Media.EXTERNAL_CONTENT_URI, contentValues)
            if (uri != null) {
                context.contentResolver.openOutputStream(uri)?.use { output ->
                    file.inputStream().use { input -> input.copyTo(output) }
                }
                contentValues.clear()
                contentValues.put(MediaStore.Audio.Media.IS_PENDING, 0)
                context.contentResolver.update(uri, contentValues, null, null)
                Toast.makeText(context, "Saved to Music/StellariumCaller/", Toast.LENGTH_SHORT).show()
            }
        }
    } catch (e: Exception) {
        Toast.makeText(context, "Save failed: ${e.message}", Toast.LENGTH_SHORT).show()
    }
}
