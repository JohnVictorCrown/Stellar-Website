package jv.stellariumcaller.stellariumcaller

import android.net.Uri
import androidx.media3.datasource.BaseDataSource
import androidx.media3.datasource.DataSpec
import java.io.PipedInputStream
import java.io.PipedOutputStream

class WebSocketDataSource : BaseDataSource(true) {
    private val outputStream = PipedOutputStream()
    private val inputStream = PipedInputStream(outputStream, 65536)

    override fun getUri(): Uri? = null

    fun feedAudioData(data: ByteArray) {
        try {
            outputStream.write(data)
            outputStream.flush()
        } catch (_: Exception) { }
    }

    override fun open(dataSpec: DataSpec): Long {
        transferInitializing(dataSpec)
        transferStarted(dataSpec)
        return -1
    }

    override fun read(buffer: ByteArray, offset: Int, length: Int): Int {
        if (length == 0) return 0
        val bytesRead = inputStream.read(buffer, offset, length)
        if (bytesRead > 0) bytesTransferred(bytesRead)
        return bytesRead
    }

    override fun close() {
        transferEnded()
        try { inputStream.close() } catch (_: Exception) { }
        try { outputStream.close() } catch (_: Exception) { }
    }
}
