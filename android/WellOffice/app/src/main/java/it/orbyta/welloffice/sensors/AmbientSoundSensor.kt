package it.orbyta.welloffice.sensors

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.media.AudioFormat
import android.media.AudioRecord
import android.media.MediaRecorder
import android.os.Handler
import android.os.Looper
import androidx.core.app.ActivityCompat
import it.orbyta.welloffice.structures.EnvironmentData
import kotlin.math.*

class AmbientSoundSensor(
    private val context: Context
) {

    private var audioRecord: AudioRecord? = null
    private var isMonitoring = false
    private val handler = Handler(Looper.getMainLooper())

    fun startMonitoring(
        callback: (EnvironmentData) -> Unit
    ) {
        if (isMonitoring) return

        val sampleRate = 44100
        val bufferSize = AudioRecord.getMinBufferSize(
            sampleRate,
            AudioFormat.CHANNEL_IN_MONO,
            AudioFormat.ENCODING_PCM_16BIT
        )

        if (
            ActivityCompat.checkSelfPermission(
                context,
                Manifest.permission.RECORD_AUDIO
            ) != PackageManager.PERMISSION_GRANTED
        ) {
            return
        }
        audioRecord = AudioRecord(
            MediaRecorder.AudioSource.MIC,
            sampleRate,
            AudioFormat.CHANNEL_IN_MONO,
            AudioFormat.ENCODING_PCM_16BIT,
            bufferSize
        )

        audioRecord?.startRecording()
        isMonitoring = true

        Thread {
            val buffer = ShortArray(bufferSize)
            while (isMonitoring) {
                val bytesRead = audioRecord?.read(buffer, 0, bufferSize) ?: 0
                if (bytesRead > 0) {
                    /*val amplitude = calculateAmplitude(buffer)
                    val decibels = 20 * log10(amplitude) + 90 // Rough calibration*/

                    handler.post {
                        callback(
                            EnvironmentData.NOISE(
                                calculateAmplitude(buffer).toInt().toFloat()
                            )
                        )
                    }
                }
                Thread.sleep(100) // Update every 100ms
            }
        }.start()
    }

    fun stopMonitoring() {
        isMonitoring = false
        audioRecord?.stop()
        audioRecord?.release()
        audioRecord = null
    }

    private fun calculateAmplitude(audioData: ShortArray): Double {
        var sum = 0L

        for (sample in audioData) {
            sum += abs(sample.toLong())
        }

        val average = sum.toDouble() / audioData.size

        return if (average > 1) {
            20 * log10(average) // Adjust baseline
        } else {
            0.0
        }
    }
}